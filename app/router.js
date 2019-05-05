'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  //同步包
  // router.get("/sync/:name/:version",controller.syncTask.startTaskByNameVersion);
  // router.get("/sync/:name",controller.syncTask.startTaskByNameVersion);
   router.get("/listTask/:taskId",controller.syncTask.listTask);
  // router.get("/task/startNoSTasks",controller.syncTask.startNoSTasks);
  router.get('/npmTool/chartDeps',controller.npmTool.chartDeps);
  router.get('/npmTool/startCheckedModuleFile',controller.npmTool.startCheckedModuleFile);
  router.get('/npmTool/checkedModuleFileCondition',controller.npmTool.checkedModuleFileCondition);

  if(!app.config.isInternet){//内网环境配置的路由
    router.post('/package/task/add',controller.package.addTask);
    router.get('/package/listWaitTasks',controller.package.listWaitTasks);
    router.post('/package/buildSyncMsg',controller.package.buildAndSendSyncMsg);
    router.post('/package/recievePackage',controller.package.recieveAndSavePackage);
  }else{//外网环境配置路由
    router.post('/package/buildAndSendPackage',controller.package.buildAndSendPackage);
    router.post('/package/recieveSyncMsg',controller.package.recieveSyncMsg);
    router.post("/task/delete",controller.syncTask.delTask);
    router.post("/task/add",controller.syncTask.addTask);
    router.post("/task/startNoSTasks",controller.syncTask.startNoSTasks);
    router.get("/tasks",controller.syncTask.listTask);
    router.get("/task/syncTaskCount",controller.syncTask.getTaskCount);

    router.post('/npmTool/correctFilesByNpm',controller.npmTool.correctFilesByNpm);
    router.get('/npmTool/popular',controller.npmTool.getPopular);
  }
};
