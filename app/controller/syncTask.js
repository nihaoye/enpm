const Controller = require('egg').Controller;

class SyncTaskController extends Controller {
    async addTask() {
        let params = this.ctx.query;
        if (!params.name) {
            this.ctx.body = "请输入需要更新的包名";
            return;
        }
        let result = await this.service.syncTask.addTask(params);
        if (result == 0) {
            this.ctx.body = "该任务已存在，不需要更新";
        } else {
            this.ctx.body = result;
        }
    }
    async startTaskByNameVersion() {
        let params = this.ctx.params;
        let item = await this.app.model.SyncTask.findOne({where: {name: params.name, version: params.version}});
        if (false) {
            if (item.state == 2) {
                this.ctx.body = "该任务已经同步完成,不需要同步";
            } else if (item.state == 1) {
                this.ctx.body = "该任务正在同步中...";
            } else {
                this.ctx.body = "开启同步任务";
                this.service.sync.sync_worker(item);
            }
        } else {
            let task=await this.service.syncTask.addTask({
                name:params.name,
                version:params.version,
                sync_dev:this.ctx.query.syncDev?1:0,
            });
            this.service.sync.sync_worker(task);
            this.ctx.body="开启同步任务";
        }
    }
    async startNoSTasks() {
        let list = await this.service.syncTask.listNoSTask();
        if (list) {
            this.ctx.body = {
                message: "开启需要执行的任务",
                data: list
            };
            setTimeout(async () => {
                for (let i = 0; i < list.length; i++) {
                    await this.service.sync.sync_worker(list[i].name, list[i].version);
                }
            })

        } else {
            this.ctx.body = {message: "没有需要开启的任务", data: null}
        }
    }
}

module.exports = SyncTaskController;
