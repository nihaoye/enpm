const Service = require('egg').Service;
const semver =require("semver");
function parseRow(row) {
    if (row && row.package) {
        if (row.package.indexOf('%7B%22') === 0) {
            // now store package will encodeURIComponent() after JSON.stringify
            row.package = decodeURIComponent(row.package);
        }
        row.package = JSON.parse(row.package);
    }
    if (typeof row.publish_time === 'string') {
        // pg bigint is string
        row.publish_time = Number(row.publish_time);
    }
}
function stringifyPackage(pkg) {
    return encodeURIComponent(JSON.stringify(pkg));
}
class PackageService extends Service {
    async listModulesByName(moduleName, attributes) {
        var {Module,Tag,NpmModuleMaintainer,ModuleMaintainer} = this.app.model;
        var mods = await Module.findAll({
            where: {
                name: moduleName
            },
            order: [ ['id', 'DESC'] ],
            attributes,
        });
        console.log(mods[0]);
        if(mods&&mods.length>0){
            for (var mod of mods) {
                parseRow(mod);
            }
        }
        return mods;
    };
    async getModuleById(id){
        var row = await Module.findById(id);
        parseRow(row);
        return row;
    }
    async getModule (name, version) {
        var row = await Module.findByNameAndVersion(name, version);
        parseRow(row);
        return row;
    };
    async getModuleByTag (name, tag) {
        var tag = await Tag.findByNameAndTag(name, tag);
        if (!tag) {
            return null;
        }
        return await this.getModule(tag.name, tag.version);
    };
    async getModuleByRange(name, range) {
        var rows = await this.listModulesByName(name, [ 'id', 'version']);
        var versionMap = {};
        var versions = rows.map(function(row) {
            versionMap[row.version] = row;
            return row.version;
        }).filter(function(version) {
            return semver.valid(version);
        });
        var version = semver.maxSatisfying(versions, range);
        if (!versionMap[version]) {
            return null;
        }

        var id = versionMap[version].id;
        return await this.getModuleById(id);
    }
    async getLatestModule (name) {
        return await this.getModuleByTag(name, 'latest');
    }
    async listPrivateModulesByScope(scope) {
        var tags = await Tag.findAll({
            where: {
                tag: 'latest',
                name: {
                    like: scope + '/%'
                }
            }
        });

        if (tags.length === 0) {
            return [];
        }

        var ids = tags.map(function (tag) {
            return tag.module_id;
        });
        return await Module.findAll({
            where: {
                id: ids
            }
        });
    };
    async listModules (names) {
        if (names.length === 0) {
            return [];
        }

        // fetch latest module tags
        var tags = await Tag.findAll({
            where: {
                name: names,
                tag: 'latest'
            }
        });
        if (tags.length === 0) {
            return [];
        }

        var ids = tags.map(function (tag) {
            return tag.module_id;
        });

        var rows = await Module.findAll({
            where: {
                id: ids
            },
            attributes: [
                'name', 'description', 'version',
            ]
        });
        return rows;
    }
    async listModulesByUser(username) {
        var names = await this.listModuleNamesByUser(username);
        return await this.listModules(names);
    }
    async listModuleNamesByUser(username) {
        var sql = 'SELECT distinct(name) AS name FROM module WHERE author=?;';
        var rows = await this.app.model.query(sql,{ replacements: [username] });
        var map = {};
        var names = rows.map(function (r) {
            return r.name;
        });

        // find from npm module maintainer table
        var moduleNames = await NpmModuleMaintainer.listModuleNamesByUser(username);
        moduleNames.forEach(function (name) {
            if (!map[name]) {
                names.push(name);
            }
        });
        // find from private module maintainer table
        moduleNames = await ModuleMaintainer.listModuleNamesByUser(username);
        moduleNames.forEach(function (name) {
            if (!map[name]) {
                names.push(name);
            }
        });
        return names;
    }
    async addDependency(name, dependency) {
        var row = await this.app.model.ModuleDeps.find({
            where: {
                name: dependency,
                dependent: name
            }
        });
        if (row) {
            return row;
        }
        return await this.app.model.ModuleDeps.build({
            name: dependency,
            dependent: name
        }).save();
    };
    async addDependencies (name, dependencies) {
        var task=[];
        for (var i = 0; i < dependencies.length; i++) {
            task.push(this.addDependency(name, dependencies[i]));
        }
        return Promise.all(task);
    };
    async listDependents (dependency) {
        var items = await this.app.model.ModuleDeps.findAll({
            where: {
                name: dependency
            }
        });
        return items.map(function (item) {
            return item.dependent;
        });
    };

    async saveModule(mod) {
        const {Module,ModuleKeyword}=this.app.model;
        var keywords = mod.package.keywords;
        if (typeof keywords === 'string') {
            keywords = [keywords];
        }
        var pkg = stringifyPackage(mod.package);
        var description = mod.package && mod.package.description || '';
        var dist = mod.package.dist || {};
        // dist.tarball = '';
        // dist.shasum = '';
        // dist.size = 0;
        var publish_time = mod.publish_time || Date.now();
        var item = await Module.findByNameAndVersion(mod.name, mod.version);
        if (!item) {
            item = Module.build({
                name: mod.name,
                version: mod.version
            });
        }
        item.publish_time = publish_time;
        // meaning first maintainer, more maintainers please check module_maintainer table
        item.author = mod.author;
        item.package = pkg;
        item.dist_tarball = dist.tarball;
        item.dist_shasum = dist.shasum;
        item.dist_size = dist.size;
        item.description = description;

        if (item.changed()) {
            item = await item.save();
        }
        var result = {
            id: item.id,
            gmt_modified: item.gmt_modified
        };

        if (!Array.isArray(keywords)) {
            return result;
        }

        var words = [];
        for (var i = 0; i < keywords.length; i++) {
            var w = keywords[i];
            if (typeof w === 'string') {
                w = w.trim();
                if (w) {
                    words.push(w);
                }
            }
        }

        if (words.length > 0) {
            // add keywords
            await this.addKeywords(mod.name, description, words);
        }

        return result;
    };
    async addKeyword(data) {
        var item = await ModuleKeyword.findByKeywordAndName(data.keyword, data.name);
        if (!item) {
            item = ModuleKeyword.build(data);
        }
        item.description = data.description;
        if (item.changed()) {
            // make sure object will change, otherwise will cause empty sql error
            // @see https://github.com/cnpm/cnpmjs.org/issues/533
            return await item.save();
        }
        return item;
    };
    async addKeywords(name, description, keywords) {
        var tasks = [];
        keywords.forEach((keyword)=> {
            tasks.push(this.addKeyword({
                name: name,
                keyword: keyword,
                description: description
            }));
        });
        return await Promise.all(tasks);
    };
    async saveModuleAbbreviated(mod) {
        var {ModuleAbbreviated} = this.app.model;
        var pkg = JSON.stringify({
            name: mod.package.name,
            version: mod.package.version,
            deprecated: mod.package.deprecated,
            dependencies: mod.package.dependencies,
            optionalDependencies: mod.package.optionalDependencies,
            devDependencies: mod.package.devDependencies,
            bundleDependencies: mod.package.bundleDependencies,
            peerDependencies: mod.package.peerDependencies,
            bin: mod.package.bin,
            directories: mod.package.directories,
            dist: mod.package.dist,
            engines: mod.package.engines,
            _hasShrinkwrap: mod.package._hasShrinkwrap,
            _publish_on_cnpm: mod.package._publish_on_cnpm,
        });
        var publish_time = mod.publish_time || Date.now();
        var item = await ModuleAbbreviated.findByNameAndVersion(mod.name, mod.version);
        if (!item) {
            item =ModuleAbbreviated.build({
                name: mod.name,
                version: mod.version,
            });
        }
        item.publish_time = publish_time;
        item.package = pkg;

        if (item.changed()) {
            item = await item.save();
        }
        var result = {
            id: item.id,
            gmt_modified: item.gmt_modified,
        };

        return result;
    };
    async savePackageReadme(name, readme, latestVersion) {
        const {PackageReadme}=this.app.model;
        var item = await PackageReadme.find({ where: { name: name,version:latestVersion} });
        if (!item) {
            item = PackageReadme.build({
                name: name,
            });
            item.readme = readme;
            item.version = latestVersion;
            return await item.save();
        }
        return item;
    };
}
module.exports = PackageService;