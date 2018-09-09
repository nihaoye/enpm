'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get("/sync/:name/:version",controller.syncTask.startTaskByNameVersion);
  router.get("/task/add",controller.syncTask.addTask);
  router.get("/task/showWait",controller.package.showWaiting);

  //下载
  router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/download\/(@[\w\-\.]+\/[\w\-\.]+)$/,controller.download.downPackage);
  router.get('/:name/download/:filename',controller.download.downPackage);
  router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/\-\/(@[\w\-\.]+\/[\w\-\.]+)$/,controller.download.downPackage);
  router.get('/:name/-/:filename',controller.download.downPackage);

};
