'use strict';

const Controller = require('egg').Controller;

class PackageController extends Controller {
    async sync() {
        const { ctx, service } = this;
        var arr=this.ctx.params.name.split("@");
        var name=arr[0];
        var version=arr[1];
        var data=await service.sync.syncOneVersion(name,version);
        ctx.body = data;
    }
}

module.exports = PackageController;
