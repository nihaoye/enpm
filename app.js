
const fse = require('fs-extra');
const commonConfig = require('./config/common')
module.exports = app => {
    app.beforeStart(() => {
        console.log("************enpm启动**************")
        fse.ensureDirSync(commonConfig.resourcePath+"/sync_packages");
    })
};