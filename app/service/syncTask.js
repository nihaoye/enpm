const Service = require('egg').Service;
const util = require('utility');
class SyncTaskService extends Service {
    async listNoSTask(taskId){
        const syncTask=this.app.model.SyncTask;
        const Op=this.app.model.Op;
        let list=null;
        if(taskId){
            list = await syncTask.findAll({where:{state:{[Op.or]:[0,3]}}});
        }else{
            list = await syncTask.findAll({where:{taskId:taskId,state:{[Op.or]:[0,3]}}});
        }
        return list;
    }
    async addTask({taskId,name,version,sync_type,description,sync_dev}){
        const syncTask=this.app.model.SyncTask;
        version=version||"*";
        sync_type=sync_type||'pkg';
        if(sync_type==='pkg'){
            taskId=taskId||util.randomString(16);
        }
        let result=await syncTask.findOne({where:{taskId:taskId,name:name,version:version}});
        if(result){
            return result;
        }
        return await syncTask.create({
            taskId:taskId,
            name:name,
            version:version,
            sync_type:sync_type,
            description:description||"",
            state:0,
            sync_dev:sync_dev
        })
    }
    async updateTask(id,{description,state,result}){
        const syncTask=this.app.model.SyncTask;
        return await syncTask.update({
            description,
            state,
            result
        },{where:{id:id}})
    }
    /**
     * 查找一个未完成的任务
     * @returns {Promise<void>}
     */
    async findOneNoSTask(taskId){
        const syncTask=this.app.model.SyncTask;
        return await syncTask.findOne({where:{taskId:taskId,state:0},order:[['id','ASC']]})
    }
}
module.exports=SyncTaskService;
