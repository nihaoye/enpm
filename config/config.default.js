'use strict';
const path = require("path");
const commonConfig=require('./common');
module.exports = appInfo => {
    const config = exports = {};
    config.resourcePath=commonConfig.resourcePath;
    config.isInternet=commonConfig.isInternet;
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1536199081447_3693';
    config.security = {
        xframe: {
          enable: false,
        },
        csrf: {
            ignore:/.*/g,
        },
    }
    config.cluster = {
        listen: {
          path: '',
          port: commonConfig.port||7001,
          hostname: '',
        },
      };
    // add your config here
    config.middleware = [];


    config.customLogger={
        syncLogger: {
            file: path.join(appInfo.root, 'logs/enpm/sync.log'),
        }
    };
    config.sequelize = {
        host:"localhost",
        port:"3306",
        username:"root",
        password:"root",
        dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
        database: 'enpm',
        storage: path.join(config.resourcePath,'data.sqlite'),
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
        },
        pool: {
            max: 50,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

    };
    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH.OPTOINS'
    };
    return config;
};
