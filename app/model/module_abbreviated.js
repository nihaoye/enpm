'use strict';
module.exports = app => {
    const {STRING, INTEGER, DATE,TEXT, BIGINT} = app.Sequelize;
    const ModuleAbbreviated = app.model.define('ModuleAbbreviated', {
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
        package: {
            type:TEXT('long'),
            comment: 'package.json',
        },
        publish_time: {
            type:BIGINT(20),
            allowNull: true,
        }
    }, {
        tableName: 'module_abbreviated',
        comment: 'module abbreviated info',
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
        ]
    });
    ModuleAbbreviated.findByNameAndVersion=async function (name, version) {
        return await this.find({
            where: {name: name, version: version}
        });
    };
    return ModuleAbbreviated
};
