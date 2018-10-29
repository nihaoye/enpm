module.exports = app => {
    const {STRING,TEXT,INTEGER} = app.Sequelize;
    const SyncTask = app.model.define('SyncTask', {
        taskId: {
            type: STRING(32),
            allowNull: false,
            comment: '任务的id',
        },
        sync_type:{
            type:STRING(8),
            allowNull:true,
            comment:"任务的同步类型:pkg|pkg_dp|devDep|dep",
            defaultValue:"pkg"
        },
        sync_dev:{
            type:INTEGER,
            allowNull:true,
            comment:"是否同步开发依赖包",
            defaultValue:0
        },
        name: {
            type: STRING(32),
            allowNull: false,
            comment: 'SyncTask name',
        },
        version: {
            type: STRING(32),
            allowNull: false,
            comment: 'SyncTask version',
        },
        description: {
            type: TEXT('long'),
            allowNull: true,
            comment: 'SyncTask description',
        },
        result: {
            type:STRING('255'),
            allowNull: true,
            comment: 'SyncTask result',
        },
        state:{
            type:INTEGER,
            allowNull: false,
            comment: '同步状态,0:未同步|1:同步中|2:同步成功|3:同步失败|4:已忽略',
            defaultValue:0,
        },
        trace_id:{
            type:INTEGER,
            allowNull: true,
            comment: '追踪id，可以根据这个查到是哪个包创建的任务',
        }
    }, {
        tableName: 'sync_task',
        comment: '数据库同步任务记录',
        updatedAt: false,
    });
    return SyncTask;
};
