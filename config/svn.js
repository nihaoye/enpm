const path = require('path')
const common = require('./common')
const svnSetting = require('./svn.json')
module.exports = {
    username:svnSetting.username,
    password:svnSetting.password,
    registry:svnSetting.registry,
    cwd:common.resourcePath
};