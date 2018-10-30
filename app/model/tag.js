module.exports = app => {
    const {STRING, BIGINT} = app.Sequelize;
    const Tag = app.model.define('Tag', {
        id:{
            type:STRING(32),
            defaultValue:app.Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type:STRING(100),
            allowNull: false,
            comment: 'module name',
        },
        tag: {
            type:STRING(30),
            allowNull: false,
            comment: 'tag name',
        },
        version: {
            type:STRING(30),
            allowNull: false,
            comment: 'module version',
        },
        module_id: {
            type:BIGINT(20),
            allowNull: false,
            comment: 'module id'
        }
    }, {
        tableName: 'tag',
        comment: 'module tag',
        indexes: [
            {
                unique: true,
                fields: ['name', 'tag']
            },
            {
                fields: ['gmt_modified']
            }
        ]
    });
    Tag.findByNameAndTag=async function(name, tag) {
        return await this.find({ where: { name: name, tag: tag } });
    };
    return Tag;
};
