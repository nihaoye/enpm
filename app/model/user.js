const utility = require("utility");
module.exports = app => {
    const {STRING,TEXT, BOOLEAN} = app.Sequelize;
    const User = app.model.define('User', {
        id:{
            type:STRING(32),
            defaultValue:app.Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING(100),
            allowNull: false,
            comment: 'user name',
        },
        salt: {
            type: STRING(100),
            allowNull: false,
        },
        password_sha: {
            type: STRING(100),
            allowNull: false,
            comment: 'user password hash',
        },
        ip: {
            type: STRING(64),
            allowNull: false,
            comment: 'user last request ip',
        },
        roles: {
            type: STRING(200),
            allowNull: false,
            defaultValue: '[]',
        },
        rev: {
            type: STRING(40),
            allowNull: false,
        },
        email: {
            type: STRING(400),
            allowNull: false,
        },
        json: {
            type:TEXT('long'),
            allowNull: true,
            get: function () {
                let value = this.getDataValue("json");
                if (typeof value === "string") {
                    value = JSON.parse(value);
                }
                return value;
            },
            set: function (value) {
                if (typeof value !== 'string') {
                    value = JSON.stringify(value);
                }
                this.setDataValue("json", value);
            },
        },
        isNpmUser: {
            field: 'npm_user',
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'user sync from npm or not, 1: true, other: false',
        }
    }, {
        tableName: 'user',
        comment: 'user base info',
        indexes: [
            {
                unique: true,
                fields: ['name']
            },
            {
                fields: ['gmt_modified']
            }
        ],
    });
    var obj={
        // utils
        createPasswordSha: function (password, salt) {
            return utility.sha1(password + salt);
        },
        // read
        auth: async function (name, password) {
            var user = await this.findByName(name);
            if (user) {
                var sha = this.createPasswordSha(password, user.salt);
                if (user.password_sha !== sha) {
                    user = null;
                }
            }
            return user;
        },
        findByName: async function (name) {
            return await this.find({where: {name: name}});
        },
        listByNames: async function (names) {
            if (!names || names.length === 0) {
                return [];
            }
            return await this.findAll({
                where: {
                    name: {
                        in: names
                    }
                }
            });
        },
        search: async function (query, options) {
            return await this.findAll({
                where: {
                    name: {
                        like: query + '%'
                    }
                },
                limit: options.limit
            });
        },

        // write
        saveNpmUser: async function (data) {
            var user = await this.findByName(data.name);
            if (!user) {
                user = this.build({
                    isNpmUser: true,
                    name: data.name,
                    salt: '0',
                    password_sha: '0',
                    ip: '0',
                });
            }
            user.isNpmUser = true;
            user.json = data;
            user.email = data.email || '';
            user.rev = data._rev || '';
            if (user.changed()) {
                user = await user.save();
            }
            return user;
        },
        saveCustomUser: async function (data) {
            var name = data.user.login;
            var user = await this.findByName(name);
            if (!user) {
                user = this.build({
                    isNpmUser: false,
                    name: name,
                });
            }

            var rev = '1-' + data.user.login;
            var salt = data.salt || '0';
            var passwordSha = data.password_sha || '0';
            var ip = data.ip || '0';

            user.isNpmUser = false;
            user.email = data.user.email;
            user.ip = ip;
            user.json = data.user;
            user.rev = rev;
            user.salt = salt;
            user.password_sha = passwordSha;
            if (user.changed()) {
                user = await user.save();
            }
            return user;
        },

        // add cnpm user
        add: async function (user) {
            var roles = user.roles || [];
            try {
                roles = JSON.stringify(roles);
            } catch (e) {
                roles = '[]';
            }
            var rev = '1-' + utility.md5(JSON.stringify(user));

            var row = this.build({
                rev: rev,
                name: user.name,
                email: user.email,
                salt: user.salt,
                password_sha: user.password_sha,
                ip: user.ip,
                roles: roles,
                isNpmUser: false,
            });

            return await row.save();
        },

        update: async function (user) {
            var rev = user.rev || user._rev;
            var revNo = Number(rev.split('-', 1));
            if (!revNo) {
                var err = new Error(rev + ' format error');
                err.name = 'RevFormatError';
                err.data = {user: user};
                throw err;
            }
            revNo++;
            var newRev = revNo + '-' + utility.md5(JSON.stringify(user));
            var roles = user.roles || [];
            try {
                roles = JSON.stringify(roles);
            } catch (e) {
                roles = '[]';
            }

            var row = await this.findByName(user.name);
            if (!row) {
                return null;
            }

            row.rev = newRev;
            row.email = user.email;
            row.salt = user.salt;
            row.password_sha = user.password_sha;
            row.ip = user.ip;
            row.roles = roles;
            row.isNpmUser = false;

            return await row.save(['rev', 'email', 'salt', 'password_sha', 'ip', 'roles', 'isNpmUser']);
        }
    };
    Object.assign(User,obj);
    return User;
};