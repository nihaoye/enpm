const Controller = require('egg').Controller;
const path=require("path");
const semver =require("semver");
class SyncTaskController extends Controller {
     sendTaskMsg(task,msg){
        return this.ctx.body={
            task:task,
            msg:msg,
            directionUrl:'/listTask/'+task.taskId
        }
    }
    async addTask() {
        let params = this.ctx.query;
        if (!params.name) {
            this.ctx.body = {msg:"请输入需要更新的包名",error:1};
            return;
        }
        let result = await this.service.syncTask.addTask(params);
        if (result == 0) {
            this.ctx.body = {msg:"该任务已存在，不需要更新",error:1};
        } else {
            this.ctx.body = result;
        }
    }
    async startTaskByNameVersion() {
        const Op=this.app.model.Op;
        let params = this.ctx.params;
        if(!params.version||params.version==="latest"){//如果更新最新版本的话就强制直接更新，不用检查任务是否重复
            let pkg=await this.service.sync.requestLatestPackage(params.name);
            console.log(pkg);
            let sourcePackage=await this.service.package.getModuleByRange(pkg.name,pkg.version);
            if(sourcePackage){
                this.ctx.body={msg:"已存在的最新版本:"+pkg.version+"，不需要更新",error:1};
                return;
            }
            this.app.getLogger("syncLogger").info("检查并更新最新版本:"+pkg.name+"@"+pkg.version);
            let task=await this.service.syncTask.addTask({
                name:pkg.name,
                version:pkg.version,
                sync_dev:this.ctx.query.syncDev?1:0,
            });
            this.service.sync.sync_worker(task);
            this.sendTaskMsg(task,"开启同步任务...");
            return;
        }
        if(params.version!=="*"&&!semver.valid(params.version)){
            this.ctx.body={msg:"版本校验错误!",error:1};
            return;
        }
        let item = await this.app.model.SyncTask.findOne({where: {name: params.name,version: params.version,state:{[Op.or]:[0,1,2]},sync_dev:this.ctx.query.syncDev?1:0}});
        if (item) {
            if (item.state == 2) {
                this.sendTaskMsg(item,"存在相同的重复任务,不需要同步");
            } else if (item.state == 1) {
                this.sendTaskMsg(item,"该任务正在执行中...");
            } else {
                this.sendTaskMsg(item,"开启同步任务...");
                this.service.sync.sync_worker(item);
            }
        } else {
            let task=await this.service.syncTask.addTask({
                name:params.name,
                version:params.version||"latest",
                sync_dev:this.ctx.query.syncDev?1:0,
            });
            this.service.sync.sync_worker(task);
            this.sendTaskMsg(task,"开启同步任务...");
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
                    await this.service.sync.sync_worker(list[i]);
                }
            })

        } else {
            this.ctx.body = {msg: "没有需要开启的任务", data: null}
        }
    }
    async listTask(){
         this.ctx.body=await this.service.syncTask.listTask(this.ctx.params.taskId)
    }
}

module.exports = SyncTaskController;
