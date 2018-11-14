const pkg=require("../package.json");
const path=require("path");
const resourcePath=path.resolve(process.cwd(),'.enpm');
module.exports={
    resourcePath:resourcePath,
    version:pkg.version,
    filePath:path.join(resourcePath,"nfs"),
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
    scopes: [ '@enpm'],
    nfsPath:path.join(resourcePath,"nfs"),
    isInternet:0
};
