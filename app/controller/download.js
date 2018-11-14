const Controller = require('egg').Controller;
const config=require("../../config/common");
const fs=require('fs');
const nfs=require('../utils/fs-cnpm')({
    dir: config.nfsPath
});
class DownloadController extends Controller {
     downPackage(){
/*        var name = this.params.name || this.params[0];
        var filename = this.params.filename || this.params[1];
        var version = filename.slice(name.length + 1, -4);
        var row = await this.app.service.package.getModule(name, version);
        // can not get dist
        var url = null;

/!*        if (typeof nfs.url === 'function') {
            if (is.generatorFunction(nfs.url)) {
                url = await nfs.url(common.getCDNKey(name, filename));
            } else {
                url = nfs.url(common.getCDNKey(name, filename));
            }
        }

        debug('download %s %s %s %s', name, filename, version, url);*!/

        if (!row || !row.package || !row.package.dist) {
            if (!url) {
                return;
            }
            this.status = 302;
            this.set('Location', url);
            _downloads[name] = (_downloads[name] || 0) + 1;
            return;
        }

        _downloads[name] = (_downloads[name] || 0) + 1;

        if (config.downloadRedirectToNFS && url) {
            this.status = 302;
            this.set('Location', url);
            return;
        }

        var dist = row.package.dist;
        if (!dist.key) {
            // try to use nsf.url() first
            url = url || dist.tarball;
            debug('get tarball by 302, url: %s', url);
            this.status = 302;
            this.set('Location', url);
            return;
        }

        // else use `dist.key` to get tarball from nfs
        if (typeof dist.size === 'number' && dist.size > 0) {
            this.length = dist.size;
        }
        this.type = mime.lookup(dist.key);
        this.attachment(filename);
        this.etag = dist.shasum;

        this.body = await downloadAsReadStream(dist.key);*/
        this.ctx.body="正在开发..."
    }
}
module.exports = DownloadController;
