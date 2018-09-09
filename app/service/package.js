const Service = require('egg').Service;
const semver =require("semver");
function parseRow(row) {
    if (row && row.package) {
        if (row.package.indexOf('%7B%22') === 0) {
            // now store package will encodeURIComponent() after JSON.stringify
            row.package = decodeURIComponent(row.package);
        }
        row.package = JSON.parse(row.package);
        if (typeof row.publish_time === 'string') {
            // pg bigint is string
            row.publish_time = Number(row.publish_time);
        }
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
        if(mods&&mods.length>0){
            for (var mod of mods) {
                parseRow(mod);
            }
        }
        return mods;
    };
    async getModuleById(id){
        var row = await this.app.model.Module.findById(id);
        parseRow(row);
        return row;
    }
    async getModule (name, version) {
        var row = await this.app.model.Module.findByNameAndVersion(name, version);
        parseRow(row);
        return row;
    };
    async getModuleByTag (name, tag) {
        var tag = await this.app.model.Tag.findByNameAndTag(name, tag);
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
        var tags = await this.app.model.Tag.findAll({
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
        return await this.app.model.Module.findAll({
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
        var tags = await this.app.model.Tag.findAll({
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

        var rows = await this.app.model.Module.findAll({
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
        var moduleNames = await this.app.model.NpmModuleMaintainer.listModuleNamesByUser(username);
        moduleNames.forEach(function (name) {
            if (!map[name]) {
                names.push(name);
            }
        });
        // find from private module maintainer table
        moduleNames = await this.app.model.ModuleMaintainer.listModuleNamesByUser(username);
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
/*        var results=await this.app.model.ModuleDeps.findAll({
            where:{
                dependent:name
            }
        });
        results=results||[];
        let obj={};
        results.forEach((r)=>{
            obj[r.name]=true;
        });
        let datas=[];
        dependencies.forEach((dep)=>{
            if(!obj[dep]){
                datas.push({dependent:name,name:dep})
            }
        });
        if(datas.length>0){
            return await this.app.model.ModuleDeps.bulkCreate(datas);
        }
        return null;*/
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
        const {Module}=this.app.model;
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
            item.publish_time = publish_time;
            // meaning first maintainer, more maintainers please check module_maintainer table
            item.author = mod.author;
            item.package = pkg;
            item.dist_tarball = dist.tarball;
            item.dist_shasum = dist.shasum;
            item.dist_size = dist.size;
            item.description = description;
            item = await item.save();
        }else{
            await item.update({
                publish_time:publish_time,
                author:mod.author,
                package:pkg,
                dist_tarball:dist.tarball,
                dist_shasum:dist.shasum,
                dist_size:dist.size,
                description:description
            })
        }
        var result = {
            id: item.id,
            gmt_modified: item.gmt_modified
        };
        if (!Array.isArray(keywords)) {
            return result;
        }
        let w={};
        for(let item of keywords){
            if(typeof item==="string"){
                w[item.trim()]=true;
            }
        }
        keywords=Object.keys(w);
        if (keywords.length > 0) {
            // add keywords
            await this.addKeywords(mod.name, description,keywords);
        }

        return result;
    };
    async addKeyword(data) {
        const {ModuleKeyword}=this.app.model;
        var item = await ModuleKeyword.findByKeywordAndName(data.keyword, data.name);
        if (!item) {
            item = ModuleKeyword.build(data);
            item.description = data.description;
            await item.save()
        }else{
            await item.update({description:data.description});
        }
        return item;
    };
    async addKeywords(name, description, keywords) {
/*  这种方式效率太低了
        var tasks = [];
        keywords.forEach((keyword)=> {
            tasks.push(this.addKeyword({
                name: name,
                keyword: keyword,
                description: description
            }));
        });
        return await Promise.all(tasks);
        */
        const {ModuleKeyword}=this.app.model;
        await ModuleKeyword.destroy({
            where:{
                name:name
            }
        });
        let datas=[];
        for(let kw of keywords){
            datas.push({name:name,keyword:kw,description:description})
        }
        return await ModuleKeyword.bulkCreate(datas);
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
            item.publish_time = publish_time;
            item.package = pkg;
            await item.save();
        }else{
            await item.update({publish_time:publish_time,package:pkg})
        }
        var result = {
            id: item.id,
            gmt_modified: item.gmt_modified,
        };
        return result;
    };
    async savePackageReadme(name, readme,version) {
        const {PackageReadme}=this.app.model;
        var item = await PackageReadme.find({ where: { name: name} });
        if (!item) {
            item = PackageReadme.build({
                name: name,
            });
            item.readme = readme;
            item.version = version;
            return await item.save();
        }else if(semver.lt(item.version,version)){
           await item.update({version,readme});
        }
        return item;
    };
    async addModuleTag(name, tag, version) {
        var {Tag} = this.app.model;
        var mod = await this.getModule(name, version);
        if (!mod) {
            return null;
        }
        var row = await Tag.findByNameAndTag(name, tag);
        if (!row) {
            row = Tag.build({
                name: name,
                tag: tag
            });
            row.module_id = mod.id;
            row.version = version;
            return await row.save();
        }else{
            return await row.update({module_id:mod.id,version:version});
        }
    };
    async addStar(name, user) {
        const {ModuleStar}=this.app.model;
        var row = await ModuleStar.find({
            where: {
                name: name,
                user: user
            }
        });
        if (row) {
            return row;
        }
        row = ModuleStar.build({
            name: name,
            user: user
        });
        return await row.save();
    };
    async addStars(name, users) {
        const {ModuleStar}=this.app.model;
         await ModuleStar.destroy({
            where: {
                name: name
            }
        });
        let result=[];
        for(let user of users){
            result.push({name:name,user:user})
        }
        return await ModuleStar.bulkCreate(result);
    };
    async search(word, options) {
        const models=this.app.model;
        const {ModuleKeyword,Module}=this.app.model.ModuleKeyword;
        options = options || {};
        let limit = options.limit || 100;
        word = word.replace(/^%/, ''); //ignore prefix %
        // search flows:
        // 1. prefix search by name
        // 2. like search by name
        // 3. keyword equal search
        let ids = {};
        let sql = 'SELECT module_id FROM tag WHERE LOWER(name) LIKE LOWER(?) AND tag=\'latest\' \
    ORDER BY name LIMIT ?;';
        let rows = await models.query(sql, [word + '%', limit ]);
        for (let i = 0; i < rows.length; i++) {
            ids[rows[i].module_id] = 1;
        }

        if (rows.length < 20) {
            rows = await models.query(sql, [ '%' + word + '%', limit ]);
            for (let i = 0; i < rows.length; i++) {
                ids[rows[i].module_id] = 1;
            }
        }

        let keywordRows = await ModuleKeyword.findAll({
            attributes: [ 'name', 'description' ],
            where: {
                keyword: word
            },
            limit: limit,
            order: [ [ 'id', 'DESC' ] ]
        });

        let data = {
            keywordMatchs: keywordRows,
            searchMatchs: []
        };

        ids = Object.keys(ids);
        if (ids.length > 0) {
            data.searchMatchs = await Module.findAll({
                attributes: [ 'name', 'description' ],
                where: {
                    id: ids
                },
                order: 'name'
            });
        }
        return data;
    };
}
module.exports = PackageService;
