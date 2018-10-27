const Service = require('egg').Service;
const util = require('utility');
class SyncTaskService extends Service {
    async listNoSTask(){
        const syncTask=this.app.model.SyncTask;
        const Op=this.app.model.Op;
        let list =await syncTask.findAll({where:{state:{[Op.or]:[0,3]}}});
        return list;
    }
    async addTask({taskId,name,version,sync_type,description}){
        const syncTask=this.app.model.SyncTask;
        version=version||"*";
        if(sync_type==='pkg'){
            taskId=taskId||util.randomString(16);
        }
        return await syncTask.create({
            taskId:taskId,
            name:name,
            version:version,
            sync_type:sync_type,
            description:description||"",
            state:0
        })
    }
    async updateTask(id,{description,state,result}){
        const syncTask=this.app.model.SyncTask;
        return await syncTask.update({where:{id:id}},{
            description,
            state,
            result
        })
    }
    syncTaskService(taskId,name,version){
        let _self=this;
        if(!taskId){
            throw new Error("taskId必传");
        }
        let id=null;
        let isCreated=false;
        async function create(sync_type,description){
            if(isCreated){
                throw new Error("只能调用一次创建方法");
            }
            let data= await _self.syncTask.addTask({
                taskId:taskId,
                name:name,
                version:version,
                sync_type:sync_type,
                description:description
            });
            isCreated=true;
            id=data.id;
            return data;
        }
        async function update(id,{description,state,result}){
            if(!id||!isCreated){
               throw new Error("此服务还没有调用创建方法");
            }
            let data=await update({where:{id:id}},{description,state,result});
            return data;
        }
        return function({sync_type,description,state,result}){
            if(!isCreated){
                create(sync_type,description)
            }else{
                update(id,{description,state,result})
            }
        }
    }
}
module.exports=SyncTaskService;
