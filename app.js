
const fse = require('fs-extra');
const commonConfig = require('./config/common');
const path = require('path');
module.exports = app => {
    app.beforeStart(() => {
        console.log("************enpm启动**************")
        fse.ensureDirSync(path.join(commonConfig.resourcePath,"tmp"));
        //app.model.sync();
    })
};
