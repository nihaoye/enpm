const Service = require('egg').Service;
class DbHistory extends Service {
    async findAll(){
        return await this.app.model.DbHistory.findAll();
    }
}
module.exports=DbHistory;