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
   router.get("/task/add",controller.syncTask.addTask);
   router.get("/listTask/:taskId",controller.syncTask.listTask);
  // router.get("/task/startNoSTasks",controller.syncTask.startNoSTasks);

  // router.get('/package/buildAndSendPackage',controller.package.buildAndSendPackage);
  // router.get('/package/recieveAndSavePackage',controller.package.recieveAndSavePackage);
  // router.get('/package/buildAndSendSyncMsg',controller.package.buildAndSendSyncMsg);
  // router.get('/package/recieveSyncMsg',controller.package.recieveSyncMsg);
  if(true||!app.config.isInternet){//内网环境配置的路由
    router.post('/package/task/add',controller.package.addTask);
    router.get('/package/listWaitTasks',controller.package.listWaitTasks)
  }
};
