const Subscription = require('egg').Subscription;
const PackageUtil = require('../utils/packageUtil');
class BuildSyncMsg extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
        // 每周五下午4点
        cron: '0 0 16 * * 5',
        type:'worker'
      };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
      if(!this.ctx.app.config.isInternet){//内网环境
        let packageUtil=new PackageUtil({
            app:this.ctx.app,
            service:this.ctx.app.service
        })
        packageUtil.buildAndSendSyncMsg();
      }
  }
}

module.exports = BuildSyncMsg;