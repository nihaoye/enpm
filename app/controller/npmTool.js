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

}
module.exports = NpmController;
