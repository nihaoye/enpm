module.exports = app => {
    const {TEXT} = app.Sequelize;
    const DbHistory = app.model.define('DbHistory', {
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
