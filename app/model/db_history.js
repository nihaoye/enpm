module.exports = app => {
    const {TEXT,STRING} = app.Sequelize;
    const DbHistory = app.model.define('DbHistory', {
        id:{
            type:STRING(32),
            defaultValue:app.Sequelize.UUIDV4,
            primaryKey: true
        },
        sqlstr:{
            type:TEXT('long'),
            allowNull:true,
            comment:"sql语句",
        }
    }, {
        tableName: 'db_history',
        comment: '数据库增量同步数据记录',
        updatedAt: false,
    });
    return DbHistory;
};
