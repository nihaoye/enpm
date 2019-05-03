const Service = require('egg').Service;
const path = require('path');
const fse = require('fs-extra');
const crypto=require("crypto");
const os = require('os');
const urllib=require("urllib");
const npm = require('../utils/npm');
const common = require('../utils/common');
const commonConfig = require('../../config/common');

const nfs=require('../utils/fs-cnpm')({
    dir: config.nfsPath
});
const nfsPath =commonConfig.nfsPath;
global.moduleCheckResult = {
    count:0,
    missFiles:[],
    checkedFileCount:0,
    isChecking:false,
    step:1000,
    errorFileHashs:[],
};

class NpmTool extends Service {
    async chartDeps(name){
        let treeHash = {};
        let model = this.app.model;
        async function treeDeps(module){
            if(treeHash[module.name]){
                return module;
            }
            treeHash[module.name] = module;
            let deps =await model.ModuleDeps.findAll({where:{deps:module.name}});
            if(deps&&deps.length>0){
                module.children =[];
                deps.forEach((item)=>{
                    module.children.push({name:item.name})
                });
                for(let i=0;i<deps.length;i++){
                    await treeDeps(module.children[i])
                }
            }
            return module;
        }
        return await treeDeps({name:name});
    }
    async startCheckedModuleFile(isCheckHash,isReset){
        if(isReset!==false){
            global.moduleCheckResult.missFiles=[];
            global.moduleCheckResult.isChecking=true;
            global.moduleCheckResult.count=await this.app.model.Module.count();
            global.moduleCheckResult.checkedFileCount=0;
            global.moduleCheckResult.errorFileHashs = [];
        }
        if(global.moduleCheckResult.count<=0){
            global.moduleCheckResult.isChecking=false;
            return true;
        }

        let result = await this.app.model.Module.findAll({attributes:['id','name','version','dist_shasum','dist_tarball','gmt_create'],limit:global.moduleCheckResult.step,offset:global.moduleCheckResult.checkedFileCount,order:[['gmt_create','ASC']]});
        if(!result||result.length<=0){
            return true;
        }
        let filePath = null;
        for(let item of result){
            filePath = path.join(nfsPath,item.dist_tarball);
            if(await fse.pathExists(filePath)){
                if(isCheckHash){
                    let shasum = await this.getFileHash(filePath);
                    if(shasum !==item.dist_shasum){
                        global.moduleCheckResult.isChecking&&global.moduleCheckResult.errorFileHashs.push(item);
                    }
                }
            }else{
                global.moduleCheckResult.isChecking&&global.moduleCheckResult.missFiles.push(item);
            }
            global.moduleCheckResult.isChecking&&(global.moduleCheckResult.checkedFileCount+=1);
        }
        if(global.moduleCheckResult.checkedFileCount<global.moduleCheckResult.count&&global.moduleCheckResult.isChecking){
            await this.startCheckedModuleFile(isCheckHash,false);
        }else{
            global.moduleCheckResult.isChecking = false;
        }
        return true;
    }
    async getFileHash(filepath) {
        var shasum = crypto.createHash('sha1');
        let data = await fse.readFile(filepath);
        shasum.update(data);
        shasum = shasum.digest('hex');
        return shasum;
    }
    async getFilesByNpm(modules){

    }
    async downPackage(module){
        let logger=this.app.logger;
        var _self=this;
        let sourcePackage =await npm.request(module.name+"/"+module.version);
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
            var mod = {
                version: sourcePackage.version,
                name: sourcePackage.name,
                author: author,
                publish_time: sourcePackage.publish_time,
            };
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
            var r = await _self.app.model.Module.update({dist_shasum:dist.shasum,dist_size:dist.size},{where:{name:mod.name,version:mod.version}});
            return r;
        }
    }
}
module.exports=NpmTool;
