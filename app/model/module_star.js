module.exports = app => {
    const {STRING} = app.Sequelize;
    const ModuleStar = app.model.define('ModuleStar', {
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
        tableName: 'module_star',
        comment: 'module star',
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
    return ModuleStar;
};
