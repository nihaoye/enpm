
const path=require('path');
const fse = require('fs-extra');
const tarfold=require('../utils/tarFolds')
const commonConfig=require('../../config/common');
const targetPath=commonConfig.resourcePath+'/sync_packages';
const msger=require('../utils/msger');
const dayjs = require('dayjs');
const Op = require('sequelize').Op;
const zipper = require('zip-local');
class PackageUtil{
    constructor({app,service,model}){
        this.app=app
        this.service=service;
        this.model=model||this.app.model;
    }
    async buildAndSendPackage(){
        this.app.logger.info("执行计划任务:发送同步包到内网");
        let zipfile=await this.buildPackage();
        if(!zipfile){
            return false;
        }
        await msger.login();
        await msger.sendMsg({
             title:dayjs().format('YYYYMMDD'),
             file:zipfile,
             type:'file'
        });
        await fse.emptyDirSync(this.app.config.resourcePath+'/sync_packages');
        return 1;
    }
    async recieveAndSavePackage(){
       this.app.logger.info("执行计划任务:从外网接收同步包并解析同步数据库");
       await msger.login();
       let msg=await msger.getMsg('file');
       let reciveMsg=null;
       fse.ensureFileSync(this.app.config.resourcePath+"/sync_packages/recieveMsg.log");
       reciveMsg=fse.readFileSync(this.app.config.resourcePath+"/sync_packages/recieveMsg.log",'utf8');
       if(reciveMsg&&JSON.parse(reciveMsg).id==msg.id){
           console.log("已经同步过了的消息，不需要同步了");
           return 2;
       }
       fse.ensureDirSync(this.app.config.resourcePath+"/sync_packages/tmp2");
       let zipfile=this.app.config.resourcePath+"/sync_packages/tmp2"+"/sync_"+Date.now()+".zip"
       await msger.downloadFile(msg.file,zipfile);
       this.extractPackage(zipfile);
       fse.moveSync(this.app.config.resourcePath+'/sync_packages/tmp2/nfs',this.app.config.resourcePath+"/nfs");
       let dbhis=await fse.readJson(this.app.config.resourcePath+'/sync_packages/tmp2'+"/db_history.json");
       console.log("开始写入sql");
       for(let item of dbhis){
        await this.app.model.query(item.sqlstr);
       }
       console.log("写入完成");
       await fse.emptyDirSync(this.app.config.resourcePath+'/sync_packages/tmp2');
       console.log("清空临时文件夹");
       fse.writeJSONSync(this.app.config.resourcePath+"/sync_packages/recieveMsg.log",msg);
       await msger.delMsg(msg.id)
       return 1;
    }
    async buildAndSendSyncMsg(){
        fse.ensureFileSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json');
        let syncMsg=fse.readFileSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json','utf8');
        syncMsg=syncMsg?JSON.parse(syncMsg):[];
        if(syncMsg.length>0){
            await msger.login();
            console.log('发送同步消息');
            await msger.sendMsg({
                title:dayjs().format("YYYYMMDD"),
                content:JSON.stringify(syncMsg),
                type:"sync"
            });
            fse.writeJSONSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json',[]);
            return syncMsg;
        }else{
            return null;
        }
    }
    async recieveSyncMsg(){
        await msger.login();
        let msg=await msger.getMsg("sync");
        if(!msg||!msg.content)return;
        fse.ensureFileSync(this.app.config.resourcePath+"/sync_packages/syncMsg.log");
        let syncMsg=fse.readFileSync(this.app.config.resourcePath+"/sync_packages/syncMsg.log",'utf8');
        if(syncMsg&&JSON.parse(syncMsg).id==msg.id){
            console.log("已经同步过了的消息，不需要同步了");
            return 2;
        }
        let msgTasks=JSON.parse(msg.content);
        for(let i=0;i<msgTasks.length;i++){
            if(msgTasks[i].version=='latest'){
                var pkg=await this.service.sync.requestLatestPackage(msgTasks[i].name);
                msgTasks[i].version=pkg.version;
            }
            await this.service.syncTask.addTask(msgTasks[i]);
        }
        fse.writeJSONSync(this.app.config.resourcePath+'/sync_packages/syncMsg.log',msg);
        console.log("开始同步未完成的包");
        this.service.syncTask.startNosTasks();
        return msg;
    }
    async buildPackage(){
        let his=await this.model.DbHistory.findOne({attributes: ['id','gmt_create'],order:[['gmt_create','ASC']]});
        if(!his){
            return null;
        }
        let startDate=his.gmt_create;
        let pkgs=await this.service.package.findByDate(new Date(startDate.getTime()-200));//提前200毫秒怕会有漏
        if(!pkgs||pkgs.length===0){
            return false;
        }
        pkgs.forEach(async (pkg)=>{
            await this.copyPackage(pkg);
        });
        await this.dbHistoryBuild();
        fse.ensureDirSync(path.resolve(targetPath,'tmp'));
        let zipfile=await tarfold.c(path.resolve(targetPath,'tmp'));
        return zipfile;
    }
    async copyPackage(pkg){
        const sourcePath=commonConfig.nfsPath;
        return await fse.copy(sourcePath+"\\"+pkg.dist_tarball,targetPath+'\\tmp\\nfs'+"\\"+pkg.dist_tarball);
    }
    async dbHistoryBuild(){
        let dbHis=await this.model.DbHistory.findAll({order:[['gmt_create','ASC']]});
        let result=await fse.writeJson(path.resolve(targetPath,'tmp/db_history.json'),dbHis);
        await this.model.DbHistory.destroy({where:{sqlstr:{[Op.not]:""}}});
        return result;
    }
    extractPackage(filePath){
        console.log("开始解压文件");
        return zipper.sync.unzip(filePath).save(path.resolve(this.app.config.resourcePath,"sync_packages/tmp2"));
    }
}
module.exports=PackageUtil;