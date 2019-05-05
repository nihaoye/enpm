
const fse = require('fs-extra');
const commonConfig = require('./config/common');
const path = require('path');
const svn = require('./app/utils/svn');
module.exports = app => {
    app.beforeStart(() => {
        console.log("************enpm启动**************")
        fse.ensureDir(path.join(commonConfig.resourcePath,"tmp"));
        fse.pathExists(path.join(commonConfig.resourcePath,'.svn')).then((isExist)=>{
            if(!isExist){
                svn.checkout();
            }
        })
        //app.model.sync();
    })
};
