module.exports = app => {
    const {STRING,TEXT,INTEGER} = app.Sequelize;
    const SyncTask = app.model.define('SyncTask', {
        name: {
            type: STRING(100),
            allowNull: false,
            comment: 'SyncTask name',
        },
        version: {
            type: STRING(100),
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
            comment: '同步状态,0:未同步|1:同步中|2:同步成功|3:同步失败',
            defaultValue:0,
        }
    }, {
        tableName: 'sync_task',
        comment: '数据库同步任务记录',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['name', 'version']
            }
        ]
    });
    return SyncTask;
};
