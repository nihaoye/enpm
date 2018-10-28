const Service = require('egg').Service;
const semver =require("semver");
const utility=require("utility");
const path=require("path");
const crypto=require("crypto");
const fs=require('fs');
const fse=require("fs-extra");
const common=require("../utils/common");
const config=require("../../config/common");
const os = require('os');
const nfs=require('../utils/fs-cnpm')({
    dir: config.nfsPath
});
const urllib=require("urllib");
var USER_AGENT = 'sync.cnpmjs.org/' + config.version +
    ' hostname/' + os.hostname() +
    ' syncModel/' + 'exist' +
    ' syncInterval/' + '10m' +
    ' syncConcurrency/' + '1' +
    ' ' + urllib.USER_AGENT;
const npm = require('../utils/npm');
const EventEmitter=require("eventemitter3");
const ee=new EventEmitter();
let waitingSyncPackages=[];//等待同步的包
const max_task_num=config.syncMaxTaskCount;//最大任务数
let taskCount=0;//正在进行的任务数
/*function addWaitingSyncPackages(name,version){
    for(let item of waitingSyncPackages){
        if(item.name===name&&item.version===version){
            return;
        }
    }
    waitingSyncPackages.push({name:name,version:version});
}
function removeWaitingSyncPackages(name,version){
    for(let i=0;i<waitingSyncPackages.length;i++){
        var item=waitingSyncPackages[i];
        if(item.name===name&&item.version===version){
            waitingSyncPackages.splice(i,1)
        }
    }
}*/
class SyncPackage extends Service{
    async syncPackage(versionIndex,sourcePackage){
        let logger=this.app.logger;
        var _self=this;
        var downurl = sourcePackage.dist.tarball;
        var filename = path.basename(downurl);
        var filepath = common.getTarballFilepath(filename);
        var ws = fs.createWriteStream(filepath);
        var options = {
            writeStream: ws,
            followRedirect: true,
            timeout: 600000, // 10 minutes download
            headers: {
                'user-agent': USER_AGENT
            },
            gzip: true,
        };
        var dependencies = Object.keys(sourcePackage.dependencies || {});
/*        var devDependencies = [];
        if (this.syncDevDependencies) {
            devDependencies = Object.keys(sourcePackage.devDependencies || {});
        }*/
        // add module dependence
        await this.service.package.addDependencies(sourcePackage.name, dependencies);
        var shasum = crypto.createHash('sha1');
        var dataSize = 0;
        try {
            var r;
            try {
                r = await urllib.request(downurl, options);
            } catch (err) {
                logger.error('[sync_worker] download %j to %j error: %s', downurl, filepath, err);
                throw err;
            }
            var statusCode = r.status || -1;
            if (statusCode !== 200) {
                var err = new Error('Download ' + downurl + ' fail, status: ' + statusCode);
                throw err;
            }
            // read and check
            await fse.readFile(filepath).then((data)=>{
                shasum.update(data);
                dataSize += data.length;
            });
            if (dataSize === 0) {
                var err = new Error('Download ' + downurl + ' file size is zero');
                err.name = 'DownloadTarballSizeZeroError';
                logger.error('[sync_worker] %s', err.message);
                throw err;
            }
            // check shasum
            shasum = shasum.digest('hex');
            if (shasum !== sourcePackage.dist.shasum) {
                var err = new Error('Download ' + downurl + ' shasum:' + shasum +
                    ' not match ');
                err.name = 'DownloadTarballShasumError';
                logger.error('[sync_worker] %s', err.message);
                throw err;
            }
            options = {
                key: common.getCDNKey(sourcePackage.name, filename),
                size: dataSize,
                shasum: shasum
            };
            // upload to NFS
            var result;
            try {
                result = await nfs.upload(filepath, options);
            } catch (err) {
                logger.error('[sync_worker] upload %j to nfs error: %s', err);
                throw err;
            }
            var r = await afterUpload(result);
            return r;
        } finally {
            // remove tmp file whatever
            fs.unlink(filepath, utility.noop);
        }
        async function afterUpload(result) {
            var author = "admin";
            if (Array.isArray(sourcePackage.maintainers) && sourcePackage.maintainers.length > 0) {
                author = sourcePackage.maintainers[0].name || username;
            } else if (sourcePackage._npmUser && sourcePackage._npmUser.name) {
                // try to use _npmUser instead
                author = sourcePackage._npmUser.name;
                sourcePackage.maintainers = [ sourcePackage._npmUser ];
            }

            var mod = {
                version: sourcePackage.version,
                name: sourcePackage.name,
                package: sourcePackage,
                author: author,
                publish_time: sourcePackage.publish_time,
            };
            // delete _publish_on_cnpm, because other cnpm maybe sync from current cnpm
            delete mod.package._publish_on_cnpm;
            if (true) {
                // sync as publish
                mod.package._publish_on_cnpm = true;
            }

            var dist = {
                shasum: shasum,
                size: dataSize,
                noattachment: dataSize === 0,
            };

            if (result.url) {
                dist.tarball = result.url;
            } else if (result.key) {
                dist.key = result.key;
                dist.tarball = result.key;
            }
            mod.package.dist = dist;
            var r = await _self.service.package.saveModule(mod);
            var moduleAbbreviatedResult = await _self.service.package.saveModuleAbbreviated(mod);
            var moduleAbbreviatedId = moduleAbbreviatedResult.id;
            return r;
        }
    }
    async saveNpmUser(username) {
        var {User} =this.app.model;
        var user = await npm.getUser(username);
        var existsUser = await User.findByName(username);
        if (!user&&existsUser) {
            if (existsUser && existsUser.isNpmUser) {
                // delete it
                await User.destroy({
                    where: {
                        name: username,
                    }
                });
                return { exists: true, deleted: true, isNpmUser: true };
            }
            return { exists: false };
        }
        if(!existsUser){
            await User.saveNpmUser(user);
        }
        return user;
    }
    async sync(task){//{taskId,name,versionIndex,syncType,syncDevDeps}
        var taskId=task.taskId,
            name=task.name,
            versionIndex=task.version,
            syncType=task.sync_type,
            syncDevDeps=task.sync_dev;
        var logger=this.app.getLogger("syncLogger");
        taskId=taskId||utility.randomString(16);
        var logSign=`[${taskId}:${name}|${versionIndex}|${syncType}]`;
        logger.info(`${logSign}同步包开始`);
        let syncTask=this.service.syncTask;
        versionIndex=versionIndex||"*";
        var sourcePackage=await this.service.package.getModuleByRange(name,versionIndex);
        var deps=null;
        var devDeps=null;
        if(sourcePackage){
            logger.info(`${logSign}同步包结束(已存在符合版本的包,不需要同步)`);
           await syncTask.updateTask(task.id,{state:2,result:"info:已存在符合版本的包，不需要同步"});
            if(syncDevDeps){
                devDeps=sourcePackage.devDependencies;
                let arr=[];
                arr.push(this.service.syncTask.addTask({
                    taskId:taskId,
                    name:k,
                    version:devDeps[k],
                    sync_type:'devDep',
                }));
                Promise.all(arr);
            }
            ee.emit("next",{taskId:taskId,name:name,version:versionIndex});
            return task;
        }
        var url="/"+name.replace('/', '%2f');
        var res={};
        try{
            res=await npm.request(url);
        }catch(e){
            logger.warn(`${logSign}同步包失败(请求包失败,可能网络超时`+'\n'+JSON.stringify(e));
            await syncTask.updateTask(task.id,{state:3,result:"error:同步包失败(请求包失败,可能网络超时)"});
            ee.emit("next",{taskId:taskId,name:name,version:versionIndex});
            return task;
        }
        if(res.status!=200){
            logger.warn(`${logSign}同步包失败(请求包失败,网络状态码为:${res.status}`+"\n"+JSON.stringify(res.data));
            await syncTask.updateTask(task.id,{state:3,result:"error:请求包失败,网络状态码为:"+res.status});
            ee.emit("next",{taskId:taskId,name:name,version:versionIndex});
            //throw new Error(res.data||"同步包失败!");
            return task;
        }
        var pkg=res.data;
        var versions=Object.keys(pkg.versions);
        if(!semver.validRange(versionIndex)){
            logger.warn(`${logSign}同步包失败(版本校验错误,不同步该版本)`);
            await syncTask.updateTask(task.id,{state:3,result:"error:同步包失败(版本校验错误)"});
            ee.emit("next",{taskId:taskId,name:name,version:versionIndex});
            return task;
        }
        var latestversion=semver.maxSatisfying(versions,versionIndex);
        sourcePackage=pkg.versions[latestversion];
        if(!latestversion){
            var errorStr="没有符合版本的包";
            if(versionIndex==="*"){
                errorStr+="，可能该包暂时没有正式版本发布，可尝试同步明确的版本号";
            }
            logger.warn(`${logSign}同步包失败${errorStr}`);
            await syncTask.updateTask(task.id,{state:3,result:"error:同步包失败("+errorStr+")"});
            ee.emit("next",{taskId:taskId,name:name,version:versionIndex});
            return task;
        }
        deps=sourcePackage.dependencies;
        devDeps=sourcePackage.devDependencies;
        for(let k in deps){
            let arr=[];
            arr.push(this.service.syncTask.addTask({
                taskId:taskId,
                name:k,
                version:deps[k],
                sync_type:'dep',
            }));
            Promise.all(arr);
            //addWaitingSyncPackages(k,deps[k]);
        }
        if(syncDevDeps){
            for(let k in devDeps){
                let arr=[];
                arr.push(this.service.syncTask.addTask({
                    taskId:taskId,
                    name:k,
                    version:devDeps[k],
                    sync_type:'devDep',
                }));
                Promise.all(arr);
                //addWaitingSyncPackages(k,devDeps[k]);
            }
        }
        return await this.app.model.transaction().then(async (t)=>{
            try {
                //同步包
                await this.syncPackage(versionIndex, sourcePackage);
                //同步readme
                await this.service.package.savePackageReadme(name, pkg.readme, latestversion);
                for (let user of sourcePackage.maintainers) {
                    await Promise.all([this.app.model.NpmModuleMaintainer.addMaintainer(name, user.name), this.saveNpmUser(user.name)]);
                }
                if (pkg['dist-tags']) {
                    let arr = [];
                    for (let k in pkg['dist-tags']) {
                        arr.push(this.service.package.addModuleTag(name, k, pkg['dist-tags'][k]));
                        //addWaitingSyncPackages(name,pkg['dist-tags'][k]);
                        if(pkg['dist-tags'][k]!==versionIndex){
                            arr.push(this.service.syncTask.addTask({//创建新的任务
                                taskId:taskId,
                                name:name,
                                version:pkg['dist-tags'][k],
                                description:'dist-tags:'+k+'开启的任务',
                                sync_type:'tag',
                                sync_dev:task.sync_dev
                            }));
                        }
                    }
                    await Promise.all(arr);
                }
                if (pkg.users) {
                    await this.service.package.addStars(name, Object.keys(pkg.users));
                }
                logger.info(`${logSign}同步包成功`);
                await syncTask.updateTask(task.id,{state: 2});
                await t.commit();
                ee.emit("next",{taskId:taskId,name: name, version: versionIndex});
                return task;
            }catch(e){
                await t.rollback();
                logger.warn(`${logSign}同步包失败,可能回滚数据库`+"\n"+JSON.stringify(e));
                await syncTask.updateTask(task.id,{state:3,result:"error:同步包失败,可能回滚数据库,详情可查看服务器包同步日志"});
                ee.emit("next", {taskId:taskId,name: name, version: versionIndex});
                return task;
            }
        })
    }
    async sync_worker(task){
        let name=task.name,
            versionIndex=task.version,
            syncDevDeps=task.sync_dev;
        const logger=this.app.getLogger("syncLogger");
        const syncTask=this.service.syncTask;
        versionIndex=versionIndex||"*";
        if(!name)return;
        logger.warn("---------------[执行同步包任务开始]"+(syncDevDeps?"[并同步该包的开发依赖包]":"")+name+":"+versionIndex+" -------------------------");
        this.sync(task);
        return new Promise(resolve => {
            ee.on("next",async (obj)=>{
                //taskCount-=1;
                let task = await syncTask.findOneNoSTask(obj.taskId);
                if(!task){
                    logger.warn("---------------[同步结束]------------------");
                    ee.off("next");
                    resolve(true);
                    return obj.taskId;
                }
                this.sync(task)
                /*let num=max_task_num-taskCount;//需要启动的任务数
                if(num>waitingSyncPackages.length-1){
                    num=waitingSyncPackages.length-1;
                }
                let startSyncPackages=[];
                for(let i=0;i<=num;i++){
                    taskCount+=1;
                }*/
            })
        })
    }
    async addSyncTask(name,versionIndex,syncDevDeps){
        let task=await syncTask.addTask({
            name:name,
            version:versionIndex,
            sync_dev:syncDevDeps?1:0,
        });
        return task;
    }
    showWaiting(taskId){
        return this.service.syncTask.listNoSTask(taskId);
    }
}
module.exports=SyncPackage;
