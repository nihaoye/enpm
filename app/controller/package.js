'use strict';

const Controller = require('egg').Controller;

class PackageController extends Controller {
    async sync() {
        const { ctx, service } = this;
        var name=this.ctx.params.name;
        var version=this.ctx.params.version;
        var syncDevDeps=this.ctx.query.syncDevDeps;
        var data=service.sync.sync_worker(name,version,syncDevDeps);
        /*for(var i=0;i<2;i++){
            await this.ctx.model.NpmModuleMaintainer.addMaintainer("gulp","contra");
            await this.ctx.model.NpmModuleMaintainer.addMaintainer("gulp"+Math.random(),"contra");
        }*/
        ctx.body = "开启任务!";
    }
    async showWaiting(){
        this.ctx.body=this.service.sync.showWaiting()
    }
}

module.exports = PackageController;
