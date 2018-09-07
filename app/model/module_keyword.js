
module.exports = app => {
    const {STRING,TEXT} =app.Sequelize;
    const ModuleKeyword=app.model.define('ModuleKeyword', {
        keyword: {
            type:STRING(100),
            allowNull: false,
        },
        name: {
            type:STRING(100),
            allowNull: false,
            comment: 'module name',
        },
        description: {
            type:TEXT('long'),
            allowNull: true,
        }
    }, {
        tableName: 'module_keyword',
        comment: 'module keyword',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['keyword', 'name']
            },
            {
                fields: ['name']
            }
        ]
    });
    ModuleKeyword.findByKeywordAndName=async function(keyword, name) {
        return await this.find({
            where: {
                keyword: keyword,
                name: name
            }
        });
    };
    return ModuleKeyword;
};
