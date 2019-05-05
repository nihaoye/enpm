const Subscription = require('egg').Subscription;
const PackageUtil = require('../utils/packageUtil');
class BuildPackage extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
        // 每周二早上10点
        cron: '0 0 2 ? * 2',
        type:'worker'
      };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
      if(this.ctx.app.config.isInternet){//外网环境
        let packageUtil=new PackageUtil({
            app:this.ctx.app,
            service:this.ctx.app.service
        })
        packageUtil.buildAndSendPackage();
      }
  }
}

module.exports = BuildPackage;