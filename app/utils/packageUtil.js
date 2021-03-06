const path=require('path');
const fse = require('fs-extra');
const commonConfig=require('../../config/common');
const targetPath=path.join(commonConfig.resourcePath,'sync_packages');
const Op = require('sequelize').Op;
const svn = require('../utils/svn');
const isEmpty = require('lodash/isEmpty')
class PackageUtil{
    constructor({app,service,model}){
        this.app=app
        this.service=service;
        this.model=model||this.app.model;
    }
    async buildAndSendPackage(){
        this.app.logger.info("发送同步包到内网");
        let result=await this.buildPackage();
        if(result.code === 0){
            this.app.logger.warn(result.msg);
            return result;
        }else if(result.code === 2){
            this.app.logger.info(result.msg);
            return result;
        }
        if(await svn.update()){
            this.app.logger.warn("svn更新失败");
            return {code:0,msg:'svn更新失败'};
        }
        if(await svn.commit()){
            this.app.logger.warn("svn提交失败");
            return {code:0,msg:'svn提交失败'};
        }
        await this.model.DbHistory.destroy({where:{sqlstr:{[Op.not]:""}}});
        return {code:1,msg:'打包发送成功'};
    }
    async recieveAndSavePackage(){
       this.app.logger.info("从"+(commonConfig.isInternet?'内网':'外网')+"接收同步包并解析同步数据库");
       if(await svn.update()){
           this.app.logger.warn("svn同步失败");
           return {code:0,msg:'svn同步失败'};
       }
       let hz = "";
       if(commonConfig.isInternet){
            hz = '_in'
        }else{
            hz = '_out'
        }
        if(!fse.existsSync(path.join(targetPath,"db_history"+hz+".json"))){
            fse.ensureFileSync(path.join(targetPath,"db_history"+hz+".json"))
        }
       let dbhis=await fse.readFile(path.join(targetPath,"db_history"+hz+".json"),'utf-8');
       dbhis&&(dbhis = JSON.parse(dbhis));
       if(isEmpty(dbhis)){
           this.app.logger.info("不需要同步");
           return {code:2,msg:'不需要同步'};
       }
        this.app.logger.info("开始写入sql");
        global.dbhisLock = true;
        try{
            for(let item of dbhis){
                await this.app.model.query(item.sqlstr);
            }
        }catch(err){
            this.app.logger.error(err);
        }finally{
            global.dbhisLock = false;
        }
       this.app.logger.info("写入完成");
       await fse.writeFile(path.join(targetPath,"db_history"+hz+".json"),"");
       if(await svn.commit()){
           this.app.logger.warn('svn提交失败');
       }
       return {code:1,msg:'同步成功'};
    }
    async buildAndSendSyncMsg(){
        let buildResult = await this.buildAndSendPackage();
        if(buildResult.code===0){
            return buildResult;
        }
        if(!fse.existsSync(targetPath+'/syncMsg.json')){
            fse.ensureFileSync(targetPath+'/syncMsg.json');
        }
        let syncMsg=fse.readFileSync(targetPath+'/syncMsg.json','utf8');
        syncMsg=(syncMsg?(syncMsg = JSON.parse(syncMsg)):[]);
        if(syncMsg.length>0){
            this.app.logger.info("发送同步消息");
            if(await svn.update()){
                this.app.logger.warn("svn更新失败");
                return {code:0,msg:"svn更新失败"};
            }
            if(await svn.commit()){
                this.app.logger.warn("svn提交失败");
                return {code:0,msg:"svn提交失败"};
            }
            this.app.logger.info("发送成功");
        }
        return {code:1,msg:"发送成功"};
    }
    async recieveSyncMsg(){
        this.app.logger.info("同步内网消息开始");
        let result =await this.recieveAndSavePackage();
        if(result.code === 0){
            return result;
        }
        if(await svn.update()){
            this.app.logger.warn("svn更新失败");
            return {code:0,msg:"svn更新失败"};
        }
        if(!fse.existsSync(targetPath+"/syncMsg.json")){
            fse.ensureFileSync(targetPath+"/syncMsg.json");
        }
        let syncMsg=fse.readFileSync(targetPath+"/syncMsg.json",'utf8');
        syncMsg=(syncMsg?(syncMsg = JSON.parse(syncMsg)):[]);
        if(isEmpty(syncMsg)){
            this.app.logger.info("没有需要同步的消息");
            return {code:2,msg:"没有需要同步的消息"};
        }
        for(let i=0;i<syncMsg.length;i++){
            if(syncMsg[i].version==='latest'){
                var pkg=await this.service.sync.requestLatestPackage(syncMsg[i].name);
                syncMsg[i].version=pkg.version;
            }
            await this.service.syncTask.addTask(syncMsg[i]);
        }
        fse.writeFileSync(targetPath+'/syncMsg.json',"");
        if(await svn.commit()){
            this.app.logger.warn('svn提交失败');
            return {code:0,msg:"svn提交失败"};
        }
        await this.service.syncTask.startNosTasks();
        return {code:0,msg:"同步成功",data:syncMsg};
    }
    async buildPackage(){
        let hz = "";
        if(commonConfig.isInternet){
            hz = '_out'
        }else{
            hz = '_in'
        }
        if(!fse.existsSync(path.join(targetPath,"db_history"+hz+".json"))){
            fse.ensureFileSync(path.join(targetPath,"db_history"+hz+".json"))
        }
        if(!isEmpty(fse.readFileSync(path.join(targetPath,"db_history"+hz+".json"),'utf-8'))){
            this.app.logger.info('存在没有同步完成的历史，请先同步再打包');
            return {code:0,msg:'存在没有同步完成的历史，请先同步再打包'};
        }
        let his=await this.model.DbHistory.findOne({attributes: ['id','gmt_create'],order:[['id','ASC']]});
        if(!his){
            this.app.logger.info("没有需要的同步记录");
            return {code:2,msg:"没有需要的同步记录"};
        }
        await this.dbHistoryBuild();
        return {code:1,msg:"数据库历史打包成功"};
    }
    async dbHistoryBuild(){
        let dbHis=await this.model.DbHistory.findAll({order:[['id','ASC']]});
        let hz = '';
        if(commonConfig.isInternet){
            hz = '_out'
        }else{
            hz = '_in'
        }
        if(!fse.existsSync(path.join(targetPath,'db_history'+hz+'.json'))){
            fse.ensureFileSync(path.join(targetPath,'db_history'+hz+'.json'));
        }
        await fse.writeJson(path.join(targetPath,'db_history'+hz+'.json'),dbHis);
        return dbHis;
    }
}
module.exports=PackageUtil;
