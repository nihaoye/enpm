'use strict';
const path = require("path");
module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1536199081447_3693';

    // add your config here
    config.middleware = [];

    config.sequelize = {
        dialect: 'sqlite', // support: mysql, mariadb, postgres, mssql
        database: 'test',
        storage: 'e://sqldata/enpm.sqlite',
        // delegate: 'myModel', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
        // baseDir: 'my_model', // load all files in `app/${baseDir}` as models, default to `model`
        // exclude: 'index.js', // ignore `app/${baseDir}/index.js` when load models, support glob and array
        // more sequelize options
        define:{
            timestamps: true,
            createdAt: 'gmt_create',
            updatedAt: 'gmt_modified',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
    };

    config.comm={
        filePath:path.join(appInfo.root,".enpm/nfs"),
        tmpPath:path.join(appInfo.root,".enpm/tmp")
    };
    return config;
};
