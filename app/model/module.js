module.exports = app => {
    const {STRING,INTEGER,TEXT,BIGINT} = app.Sequelize;
    const Module=app.model.define('Module', {
        author: {
            type:STRING(100),
            allowNull: false,
            comment: 'first maintainer name'
        },
        name: {
            type:STRING(100),
            allowNull: false,
            comment: 'module name'
        },
        version: {
            type:STRING(30),
            allowNull: false,
            comment: 'module version'
        },
        description: {
            type:TEXT('long'),
        },
        package: {
            type:TEXT('long'),
            comment: 'package.json',
        },
        dist_shasum: {
            type:STRING(100),
            allowNull: true,
        },
        dist_tarball: {
            type:STRING(2048),
            allowNull: true,
        },
        dist_size: {
            type:INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        publish_time: {
            type:BIGINT(20),
            allowNull: true,
        }
    }, {
        tableName: 'module',
        comment: 'module info',
        indexes: [
            {
                unique: true,
                fields: ['name', 'version']
            },
            {
                fields: ['gmt_modified']
            },
            {
                fields: ['publish_time']
            },
            {
                fields: ['author']
            }
        ]
    });
    Module.findByNameAndVersion=async function(name, version) {
        return await this.find({
            where: { name: name, version: version }
        });
    };
    return Module;
};

