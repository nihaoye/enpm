'use strict';

const Controller = require('egg').Controller;
class NpmController extends Controller {
    async chartDeps(){
        let {name} = this.ctx.request.query;
        if(!name){
            this.ctx.body = {code:0,msg:'请输入名称'};
            return false
        }
        this.ctx.body = await this.service.npmTool.chartDeps(name);
    }
    startCheckedModuleFile(){
        let isCheckHash = this.ctx.request.query.isCheckHash;
        if(global.moduleCheckResult.isChecking){
            this.ctx.body = {code:0,msg:'任务正在进行中'};
            return;
        }
        this.service.npmTool.startCheckedModuleFile(isCheckHash);
        this.ctx.body = {code:1,msg:"开启文件检测任务..."};
    }
    checkedModuleFileCondition(){
        this.ctx.body =  global.moduleCheckResult;
    }
    async correctFilesByNpm(){
        let params = this.ctx.request.body;
        let modules = null;
        if(!params.data&&params.length>0){
            modules = params;
        }else if(typeof params.data === 'string'){
            modules = JSON.parse(params.data);
        }else if(params.data instanceof Array){
            modules = params.data;
        }else{
            this.ctx.body = {code:0,msg:'提交数据有误'};
            return;
        }
        this.ctx.body =  await this.service.npmTool.correctFilesByNpm(modules);
    }
    async getPopular(){
        let top = this.ctx.request.body.top;
        this.ctx.body = await this.service.npmTool.getPopular(top);
    }
}
module.exports = NpmController;
