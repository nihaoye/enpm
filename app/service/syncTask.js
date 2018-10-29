const Service = require('egg').Service;
const util = require('utility');
class SyncTaskService extends Service {
    async listNoSTask(taskId){
        const syncTask=this.app.model.SyncTask;
        const Op=this.app.model.Op;
        let list=null;
        if(!taskId){
            list = await syncTask.findAll({where:{state:{[Op.or]:[0,1,3]}}});
        }else{
            list = await syncTask.findAll({where:{taskId:taskId,state:{[Op.or]:[0,1,3]}}});
        }
        return list;
    }
    async listWaitingTask(taskId){
        const syncTask=this.app.model.SyncTask;
        const Op=this.app.model.Op;
        let list=null;
        if(!taskId){
            list = await syncTask.findAll({where:{state:0}});
        }else{
            list = await syncTask.findAll({where:{taskId:taskId,state:0}});
        }
        return list;
    }
    async addTask({taskId,name,version,sync_type,description,sync_dev,trace_id}){
        const syncTask=this.app.model.SyncTask;
        version=version||"latest";
        sync_type=sync_type||'pkg';
        if(sync_type==='pkg'){
            taskId=taskId||util.randomString(16);
        }
        let result=null;
        if(version!=='latest'){
            result=await syncTask.findOne({where:{taskId:taskId,name:name,version:version}});//根据taskIdname和version查有没有存在的任务了，如果存在了就不需要创建了
        }
        if(result){
            result=await syncTask.create({
                taskId:taskId,
                name:name,
                version:version,
                sync_type:sync_type,
                description:description||"",
                state:4,
                result:"存在重复的任务，忽略更新",
                sync_dev:sync_dev,
                trace_id:trace_id
            });
        }else{
            result=await syncTask.create({
                taskId:taskId,
                name:name,
                version:version,
                sync_type:sync_type,
                description:description||"",
                state:0,
                sync_dev:sync_dev,
                trace_id:trace_id
            });
        }
        return result;
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
    async listTask(taskId){
        return await this.app.model.SyncTask.findAll({where:{taskId:taskId}});
    }
}
module.exports=SyncTaskService;
