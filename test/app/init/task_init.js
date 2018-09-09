const mm = require('egg-mock');

let app=mm.app();
app.ready().then(async ()=>{
    app.mockService("syncTask","addTask",function(){
    return "addTask"
});
const ctx = app.mockContext();
for(let item of tasks){
    await ctx.service.syncTask.addTask({name:item})
}
console.log("------=end=------")
});


