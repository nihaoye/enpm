const pkg=require("../package.json");
const path=require("path");
module.exports={
    version:pkg.version,
    filePath:path.join("../",".enpm/nfs"),
    httpProxy:null,
    sourceNpmRegistry:'https://registry.npm.taobao.org',
    officialNpmRegistry: 'https://registry.npmjs.com',
    officialNpmReplicate: 'https://replicate.npmjs.com',
    sourceNpmRegistryIsCNpm:true,
    uploadDir:path.join("./",".enpm/tmp"),
    registryHost: '127.0.0.1:7001',
    admins: {
        admin: 'admin@cnpmjs.org',
    },
    scopes: [ '@enpm'],
    nfsPath:path.join("../.enpm","nfs"),
    syncMaxTaskCount:4
};
