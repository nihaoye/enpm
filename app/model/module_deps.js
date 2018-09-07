module.exports = app => {
    const {STRING, INTEGER, DATE,BIGINT} = app.Sequelize;
    const ModuleDependency = app.model.define('ModuleDependency', {
        name: {
            type: STRING(100),
            allowNull: false,
            comment: 'module name',
        },
        dependent: {
            field: 'deps',
            type: STRING(100),
            comment: '`name` is depended by `deps`. `deps` == depend => `name`'
        }
    }, {
        tableName: 'module_deps',
        comment: 'module deps',
        // no need update timestamp
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['name', 'deps']
            },
            {
                fields: ['deps']
            }
        ]
    });
    return ModuleDependency;
};