'use strict';

const Controller = require('egg').Controller;
const PackageUtil = require('../utils/packageUtil');
const semver = require('semver')
const fse=require('fs-extra');
const accessToken = 'finest';
class PackageController extends Controller {
    constructor(props){
        super(props);
        this.packageUtil=new PackageUtil({
            app:this.app,
            service:this.service
        });
    }
    async buildAndSendPackage(){//外网功能
        if(this.ctx.request.body.accessToken !== accessToken){
            this.ctx.body = {code:0,msg:'口令错误'};
            return true;
        }
        var result = await this.packageUtil.buildAndSendPackage();
        if(result === 1){
            this.ctx.body={code:1,msg:"打包发送成功!"};
        } else if(result ===2){
            this.ctx.body={code:1,msg:"不需要打包!"};
        }else{
            this.ctx.body={code:0,msg:"打包发送失败!"};
        }
        return true;
    }
    async recieveSyncMsg(){//外网功能
        if(this.ctx.request.body.accessToken !== accessToken){
            this.ctx.body = {code:0,msg:'口令错误'};
            return true;
        }
        let status=await this.packageUtil.recieveSyncMsg();
        if(!status){
            this.ctx.body={
                code:0,
                msg:"更新失败"
            }
        }else if(status==2){
            this.ctx.body={
                code:1,
                msg:"没有新的需要同步消息"
            }
        }else{
            this.ctx.body=status;
        }
    }
    async recieveAndSavePackage(){//内网功能
        if(this.ctx.request.body.accessToken !== accessToken){
            this.ctx.body = {code:0,msg:'口令错误'};
            return true;
        }
        let status=await this.packageUtil.recieveAndSavePackage();
        if(status==1){
            this.ctx.body="接收包成功";
        }else if(status==0){
            this.ctx.body="接收包失败";
        }else if(status==2){
            this.ctx.body="不需要同步";
        }
        
    }
    async buildAndSendSyncMsg(){//内网功能
        if(this.ctx.request.body.accessToken !== accessToken){
            this.ctx.body = {code:0,msg:'口令错误'};
            return true;
        }
        this.ctx.body=await this.packageUtil.buildAndSendSyncMsg()
    }
    async addTask(){ 
        let params=this.ctx.request.body;
        if(!params.name){
            this.ctx.body={
                code:0,
                msg:"请输入包名"
            }
            return false;
        }
        params.version=params.version||'latest';
        if(params.version!=='latest'){
            if(!semver.validRange(params.version)){
                this.ctx.body={
                    code:0,
                    msg:"版本号填写错误"
                }
                return;
            }
        }
        let result=null;
        fse.ensureFileSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json');
        let syncMsg=fse.readFileSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json','utf8');
        syncMsg=syncMsg?JSON.parse(syncMsg):[];
        for(let item of syncMsg){
            if(item.name==params.name.trim()&&item.version==params.version.trim()){
                result=item;
                break;
            }
        }
        if(result){
            this.ctx.body={
                code:0,
                msg:"重复的申请"
            }
           return 2;//忽略 
        }
        if(params.version!=='latest'){
            result=await this.app.model.SyncTask.findOne({where:{name:params.name.trim(),version:params.version,sync_dev:params.sync_dev==1?1:0}})
        }
        if(result){
            this.ctx.body={
                code:0,
                msg:"符合版本("+result.version+")的npm包已经存在,不需要更新"
            }
           return 2;//忽略 
        }
        syncMsg.push({
            name:params.name,
            version:params.version||"latest",
            sync_dev:params.sync_dev==1?1:0,
            description:"[内网申请]"+(params.description||"")
        })
        fse.writeJSONSync(this.app.config.resourcePath+'/sync_packages/syncMsg.json',syncMsg);
        this.ctx.body={
            code:1,
            msg:"提交成功"
        };
    }
    listWaitTasks(){
        fse.ensureFileSync(this.ctx.app.config.resourcePath+'/sync_packages/syncMsg.json')
        let json=fse.readFileSync(this.ctx.app.config.resourcePath+'/sync_packages/syncMsg.json','utf8');
        json=json?JSON.parse(json):[];
        this.ctx.body=json;
    }
}

module.exports = PackageController;
