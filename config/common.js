const pkg=require("../package.json");
const path=require("path");
const resourcePath=path.join("/",'.enpm');
module.exports={
    resourcePath:resourcePath,
    version:pkg.version,
    httpProxy:null,
    sourceNpmRegistry:'https://registry.npm.taobao.org',
    officialNpmRegistry: 'https://registry.npmjs.com',
    officialNpmReplicate: 'https://replicate.npmjs.com',
    sourceNpmRegistryIsCNpm:true,
    uploadDir:path.join(resourcePath,"tmp"),
    registryHost: '127.0.0.1:7001',
    admins: {
        admin: 'admin@cnpmjs.org',
    },
    port:7011,
    scopes: [ '@enpm'],
    nfsPath:path.join(resourcePath,"nfs"),
    isInternet:0
};
