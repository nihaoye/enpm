const fse = require("fs-extra");
const commonConfig = require("./config/common");
const path = require("path");
const svn = require("./app/utils/svn");
const axios = require("axios");
module.exports = app => {
  app.beforeStart(() => {
    console.log("************enpm启动**************");
    fse.ensureDir(path.join(commonConfig.resourcePath, "tmp"));
    fse
      .pathExists(path.join(commonConfig.resourcePath, ".svn"))
      .then(isExist => {
        if (!isExist) {
            console.log('svn连接测试...')
            svn.checkout().then((e)=>{
              if(e){
                console.log('svn连接测试:失败')
              }else{
                console.log('svn连接测试:成功')
              }
              
            })
        }
      });
    try {
        
      axios.get(commonConfig.officialNpmRegistry).then(() => {
        commonConfig.isInternet = 1;
        app.config.isInternet = 1;
        console.log("检测环境:外网")
      });
    } catch (e) {
        commonConfig.isInternet = 0;
        app.config.isInternet = 0;
        console.log("检测环境:内网")
    }
    //app.model.sync();
  });
};
