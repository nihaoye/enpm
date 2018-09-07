const Service = require('egg').Service;
const semver =require("semver");
const utility=require("utility");
const path=require("path");
const crypto=require("crypto");
const fs=require('fs');
const common=require("../utils/common");
const config=require("../../config/common");
const os = require('os');
const nfs=require('../utils/fs-cnpm')({
    dir: config.nfsPath
});
const urllib=require("urllib");
var USER_AGENT = 'sync.cnpmjs.org/' + config.version +
    ' hostname/' + os.hostname() +
    ' syncModel/' + 'exist' +
    ' syncInterval/' + '10m' +
    ' syncConcurrency/' + '1' +
    ' ' + urllib.USER_AGENT;
const npm = require('../utils/npm');
class SyncPackage extends Service{
    async syncOneVersion(name,version){
        var _self=this;
        var sourcePackage=await this.service.package.getModuleByRange(name,version);
        if(sourcePackage){
            return sourcePackage;
        }
        var url="/"+name+"/"+(version||"latest");
        var res=await npm.request(url);
        if(res.status!=200){
            throw new Error("同步包失败");
        }
        sourcePackage=res.data;
        var downurl = sourcePackage.dist.tarball;
        var filename = path.basename(downurl);
        var filepath = common.getTarballFilepath(filename);
        var ws = fs.createWriteStream(filepath);
        var options = {
            writeStream: ws,
            followRedirect: true,
            timeout: 600000, // 10 minutes download
            headers: {
                'user-agent': USER_AGENT
            },
            gzip: true,
        };
        var dependencies = Object.keys(sourcePackage.dependencies || {});
        var devDependencies = [];
        if (this.syncDevDependencies) {
            devDependencies = Object.keys(sourcePackage.devDependencies || {});
        }
        // add module dependence
        await this.service.package.addDependencies(sourcePackage.name, dependencies);
        var shasum = crypto.createHash('sha1');
        var dataSize = 0;
        try {
            var r;
            try {
                r = await urllib.request(downurl, options);
            } catch (err) {
                //logger.syncInfo('[sync_module_worker] download %j to %j error: %s', downurl, filepath, err);
                throw err;
            }
            var statusCode = r.status || -1;
            if (statusCode !== 200) {
                var err = new Error('Download ' + downurl + ' fail, status: ' + statusCode);
                throw err;
            }
            // read and check
            var rs = fs.createReadStream(filepath);
            await new Promise(function(resolve){
                rs.on('data', function (data) {
                    shasum.update(data);
                    dataSize += data.length;
                    resolve()
                });
            });
            if (dataSize === 0) {
                var err = new Error('Download ' + downurl + ' file size is zero');
                err.name = 'DownloadTarballSizeZeroError';
                //logger.syncInfo('[sync_module_worker] %s', err.message);
                throw err;
            }
            // check shasum
            shasum = shasum.digest('hex');
            if (shasum !== sourcePackage.dist.shasum) {
                var err = new Error('Download ' + downurl + ' shasum:' + shasum +
                    ' not match ');
                err.name = 'DownloadTarballShasumError';
                //logger.syncInfo('[sync_module_worker] %s', err.message);
                throw err;
            }
            options = {
                key: common.getCDNKey(sourcePackage.name, filename),
                size: dataSize,
                shasum: shasum
            };
            // upload to NFS
            //logger.syncInfo('[sync_module_worker] uploading %j to nfs', options);
            var result;
            try {
                result = await nfs.upload(filepath, options);
            } catch (err) {
                //logger.syncInfo('[sync_module_worker] upload %j to nfs error: %s', err);
                throw err;
            }
            //logger.syncInfo('[sync_module_worker] uploaded, saving %j to database', result);
            var r = await afterUpload(result);
            /*logger.syncInfo('[sync_module_worker] sync %s@%s done!',
                sourcePackage.name, sourcePackage.version);*/
            return r;
        } finally {
            // remove tmp file whatever
            fs.unlink(filepath, utility.noop);
        }
        async function afterUpload(result) {
            //make sure sync module have the correct author info
            //only if can not get maintainers, use the username
            var author = "admin";
            if (Array.isArray(sourcePackage.maintainers) && sourcePackage.maintainers.length > 0) {
                author = sourcePackage.maintainers[0].name || username;
            } else if (sourcePackage._npmUser && sourcePackage._npmUser.name) {
                // try to use _npmUser instead
                author = sourcePackage._npmUser.name;
                sourcePackage.maintainers = [ sourcePackage._npmUser ];
            }

            var mod = {
                version: sourcePackage.version,
                name: sourcePackage.name,
                package: sourcePackage,
                author: author,
                publish_time: sourcePackage.publish_time,
            };
            // delete _publish_on_cnpm, because other cnpm maybe sync from current cnpm
            delete mod.package._publish_on_cnpm;
            if (true) {
                // sync as publish
                mod.package._publish_on_cnpm = true;
            }

            var dist = {
                shasum: shasum,
                size: dataSize,
                noattachment: dataSize === 0,
            };

            if (result.url) {
                dist.tarball = result.url;
            } else if (result.key) {
                dist.key = result.key;
                dist.tarball = result.key;
            }
            mod.package.dist = dist;
            var r = await _self.service.package.saveModule(mod);
            var moduleAbbreviatedId = null;
            if (true) {
                var moduleAbbreviatedResult = await _self.service.package.saveModuleAbbreviated(mod);
                moduleAbbreviatedId = moduleAbbreviatedResult.id;
            }
            console.log('    [%s:%s] done, insertId: %s, author: %s, version: %s, '
                + 'size: %d, publish_time: %j, publish on cnpm: %s, '
                + 'moduleAbbreviatedId: %s',
                sourcePackage.name, version,
                r.id,
                author, mod.version, dataSize,
                new Date(mod.publish_time),
                true,
                moduleAbbreviatedId);
            return sourcePackage;
        }
    }

}
module.exports=SyncPackage;