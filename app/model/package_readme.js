module.exports = app => {
    const {STRING, TEXT} = app.Sequelize;
    const PackageReadme=app.model.define('PackageReadme', {
        name: {
            type:STRING(100),
            allowNull: false,
            comment: 'module name'
        },
        version: {
            type:STRING(30),
            allowNull: false,
            comment: 'module latest version'
        },
        readme: {
            type:TEXT('long'),
            comment: 'latest version readme',
        },
    }, {
        tableName: 'package_readme',
        comment: 'package latest readme',
        indexes: [
            {
                unique: true,
                fields: ['name']
            },
            {
                fields: ['gmt_modified']
            },
        ]
    });
    PackageReadme.findByName=async function(name) {
        return await this.find({
            where: { name: name },
        });
    };
    return PackageReadme;
};
