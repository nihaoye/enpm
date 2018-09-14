const Service = require('egg').Service;
class SyncTaskService extends Service {
    async listNoSTask(){
        const syncTask=this.app.model.SyncTask;
        const Op=this.app.model.Op;
        let list =await syncTask.findAll({where:{state:{[Op.or]:[0,3]}}});
        return list;
    }
    async addTask({name,version,description}){
        const syncTask=this.app.model.SyncTask;
        version=version||"*";
        let item=await syncTask.find({where:{name,version}});
        if(item){
            return 0;
        }
        return await syncTask.create({
            name:name,
            version:version,
            description:description||"",
            state:0
        })
    }
}
module.exports=SyncTaskService;
