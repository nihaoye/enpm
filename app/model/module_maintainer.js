module.exports = app => {
    const {STRING} = app.Sequelize;
    const ModuleMaintainer = app.model.define('ModuleMaintainer', {
        id:{
            type:STRING(32),
            defaultValue:app.Sequelize.UUIDV4,
            primaryKey: true
        },
        user: {
            type: STRING(100),
            allowNull: false,
            comment: 'user name'
        },
        name: {
            type: STRING(100),
            allowNull: false,
            comment: 'module name',
        }
    }, {
        tableName: 'module_maintainer',
        comment: 'private module maintainers',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['user', 'name']
            },
            {
                fields: ['name']
            }
        ]
    });
    ModuleMaintainer.listModuleNamesByUser = async function (user) {
        var rows = await this.findAll({
            attributrs: ['name'],
            where: {
                user: user
            }
        });
        return rows.map(function (row) {
            return row.name;
        });
    };
    ModuleMaintainer.listMaintainers = async function (name) {
        var rows = await this.findAll({
            attributrs: ['user'],
            where: {
                name: name
            }
        });
        return rows.map(function (row) {
            return row.user;
        });
    };
    ModuleMaintainer.addMaintainer = async function (name, user) {
        var row = await this.find({
            where: {
                user: user,
                name: name
            }
        });
        if (!row) {
            row = await this.build({
                user: user,
                name: name
            }).save();
        }
        return row;
    };
    ModuleMaintainer.removeMaintainers = async function (name, users) {
        // removeMaintainers(name, oneUserName)
        if (typeof users === 'string') {
            users = [users];
        }
        if (users.length === 0) {
            return;
        }
        await this.destroy({
            where: {
                name: name,
                user: users,
            }
        });
    };
    ModuleMaintainer.removeAllMaintainers = async function (name) {
        await this.destroy({
            where: {
                name: name
            }
        });
    };
    ModuleMaintainer.updateMaintainers = async function (name, users) {
        // maintainers should be [username1, username2, ...] format
        // find out the exists maintainers
        // then remove all the users not present and add all the left

        if (users.length === 0) {
            return {
                add: [],
                remove: []
            };
        }
        var exists = await this.listMaintainers(name);

        var addUsers = users.filter(function (username) {
            // add user which in `users` but do not in `exists`
            return exists.indexOf(username) === -1;
        });

        var removeUsers = exists.filter(function (username) {
            // remove user which in `exists` by not in `users`
            return users.indexOf(username) === -1;
        });

        await Promise.all([
            this.addMaintainers(name, addUsers),
            this.removeMaintainers(name, removeUsers),
        ]);
        return {
            add: addUsers,
            remove: removeUsers
        };
    };
    return ModuleMaintainer;
};
