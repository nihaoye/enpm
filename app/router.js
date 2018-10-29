'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  //同步包
  router.get("/sync/:name/:version",controller.syncTask.startTaskByNameVersion);
  router.get("/sync/:name",controller.syncTask.startTaskByNameVersion);
  router.get("/task/add",controller.syncTask.addTask);
  router.get("/listTask/:taskId",controller.syncTask.listTask);
  router.get("/task/startNoSTasks",controller.syncTask.startNoSTasks);


  //下载
/*  router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/download\/(@[\w\-\.]+\/[\w\-\.]+)$/,controller.download.downPackage);
  router.get('/:name/download/:filename',controller.download.downPackage);
  router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/\-\/(@[\w\-\.]+\/[\w\-\.]+)$/,controller.download.downPackage);
  router.get('/:name/-/:filename',controller.download.downPackage);*/

/*    router.get(/^\/(@[\w\-\.]+\/[^\/]+)$/, syncByInstall, listAllVersions);
    // scope package: params: [$name, $version]
    router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/([^\/]+)$/, syncByInstall, getOneVersion);

    router.get('/:name', syncByInstall, listAllVersions);
    router.get('/:name/:version', syncByInstall, getOneVersion);

    // try to add module
    router.put(/^\/(@[\w\-\.]+\/[\w\-\.]+)$/, login, publishable, savePackage);
    router.put('/:name', login, publishable, savePackage);

    // sync from source npm
    router.put(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/sync$/, sync.sync);
    router.put('/:name/sync', sync.sync);
    router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/sync\/log\/(\d+)$/, sync.getSyncLog);
    router.get('/:name/sync/log/:id', sync.getSyncLog);

    // add tag
    router.put(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/([\w\-\.]+)$/, login, editable, tag);
    router.put('/:name/:tag', login, editable, tag);

    // need limit by ip
    router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/download\/(@[\w\-\.]+\/[\w\-\.]+)$/, limit, downloadPackage);
    router.get('/:name/download/:filename', limit, downloadPackage);
    router.get(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/\-\/(@[\w\-\.]+\/[\w\-\.]+)$/, limit, downloadPackage);
    router.get('/:name/-/:filename', limit, downloadPackage);

    // delete tarball and remove one version
    router.delete(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/download\/(@[\w\-\.]+\/[\w\-\.]+)\/\-rev\/([\w\-\.]+)$/,
        login, unpublishable, removeOneVersion);
    router.delete('/:name/download/:filename/-rev/:rev', login, unpublishable, removeOneVersion);

    // update module, unpublish will PUT this
    router.put(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/\-rev\/([\w\-\.]+)$/, login, publishable, editable, updatePackage);
    router.put('/:name/-rev/:rev', login, publishable, editable, updatePackage);

    // remove all versions
    router.delete(/^\/(@[\w\-\.]+\/[\w\-\.]+)\/\-rev\/([\w\-\.]+)$/, login, unpublishable, removePackage);
    router.delete('/:name/-rev/:rev', login, unpublishable, removePackage);

    // try to create a new user
    // https://registry.npmjs.org/-/user/org.couchdb.user:fengmk2
    router.put('/-/user/org.couchdb.user::name', addUser);
    router.get('/-/user/org.couchdb.user::name', showUser);
    router.put('/-/user/org.couchdb.user::name/-rev/:rev', login, updateUser);

    // list all packages of user
    router.get('/-/by-user/:user', userPackage.list);
    router.get('/-/users/:user/packages', listPackagesByUser);

    // download times
    router.get('/downloads/range/:range/:name', downloadTotal);
    router.get(/^\/downloads\/range\/([^\/]+)\/(@[\w\-\.]+\/[\w\-\.]+)$/, downloadTotal);
    router.get('/downloads/range/:range', downloadTotal);

    // GET /-/package/:pkg/dependents
    router.get('/-/package/:name/dependents', existsPackage, listDependents);
    router.get(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dependents$/, existsPackage, listDependents);

    // GET /-/package/:pkg/dist-tags -- returns the package's dist-tags
    router.get('/-/package/:name/dist-tags', existsPackage, tags.index);
    router.get(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dist\-tags$/, existsPackage, tags.index);

    // PUT /-/package/:pkg/dist-tags -- Set package's dist-tags to provided object body (removing missing)
    router.put('/-/package/:name/dist-tags', login, existsPackage, editable, tags.save);
    router.put(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dist\-tags$/, login, existsPackage, editable, tags.save);

    // POST /-/package/:pkg/dist-tags -- Add/modify dist-tags from provided object body (merge)
    router.post('/-/package/:name/dist-tags', login, existsPackage, editable, tags.update);
    router.post(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dist\-tags$/, login, existsPackage, editable, tags.update);

    // PUT /-/package/:pkg/dist-tags/:tag -- Set package's dist-tags[tag] to provided string body
    router.put('/-/package/:name/dist-tags/:tag', login, existsPackage, editable, tags.set);
    router.put(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dist\-tags\/([\w\-\.]+)$/, login, existsPackage, editable, tags.set);
    // POST /-/package/:pkg/dist-tags/:tag -- Same as PUT /-/package/:pkg/dist-tags/:tag
    router.post('/-/package/:name/dist-tags/:tag', login, existsPackage, editable, tags.set);

    // DELETE /-/package/:pkg/dist-tags/:tag -- Remove tag from dist-tags
    router.delete('/-/package/:name/dist-tags/:tag', login, existsPackage, editable, tags.destroy);
    router.delete(/^\/\-\/package\/(@[\w\-\.]+\/[\w\-\.]+)\/dist\-tags\/([\w\-\.]+)$/, login, existsPackage, editable, tags.destroy);*/

};
