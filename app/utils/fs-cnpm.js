
var mkdirp = require('mkdirp');
var path = require('path');
const fs = require('fs-extra');

/**
 * Expose `Client`
 */
module.exports = Client;

function Client(options) {
    if (!options || !options.dir) {
        throw new Error('need present options.dir');
    }

    if (!(this instanceof Client)) {
        return new Client(options);
    }
    this.dir = options.dir;
    mkdirp.sync(this.dir);
}

async function ensureDirExists(filepath) {
    return await fs.ensureDir(filepath);
}

Client.prototype.upload = async function(filepath, options) {
    var destpath = this._getpath(options.key);
    //await ensureDirExists(destpath);
/*    var content = await fs.readFile(filepath);
    await fs.writeFile(destpath, content);*/
    await fs.copy(filepath, destpath);
    return { key: options.key };
};

Client.prototype.uploadBuffer = async function (content, options) {
    var filepath = this._getpath(options.key);
    await ensureDirExists(filepath);
    await fs.write(filepath, content);
    return { key: options.key };
};

Client.prototype.download = async function(key, savePath, options) {
    var filepath = this._getpath(key);
    await fs.copy(filepath,savePath);
};

Client.prototype.remove = async function (key) {
    var filepath = this._getpath(key);
    await fs.remove(filepath);
};


Client.prototype._getpath = function (key) {
    return path.join(this.dir, key);
};
