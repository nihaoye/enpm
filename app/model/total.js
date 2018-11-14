
module.exports = app => {
    const {STRING, BIGINT,INTEGER} = app.Sequelize;
    let Total=app.model.define('Total', {
        name: {
          type:STRING(100),
          primaryKey: true,
          comment: 'total name'
        },
        module_delete: {
          type:BIGINT(20),
          allowNull: false,
          defaultValue: 0,
          comment: 'module delete count',
        },
        last_sync_time: {
          type:BIGINT(20),
          allowNull: false,
          defaultValue: 0,
          comment: 'last timestamp sync from official registry',
        },
        last_exist_sync_time: {
          type:BIGINT(20),
          allowNull: false,
          defaultValue: 0,
          comment: 'last timestamp sync exist packages from official registry',
        },
        sync_status: {
          type:INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'system sync from official registry status',
        },
        need_sync_num: {
          type:INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'how many packages need to be sync',
        },
        success_sync_num: {
          type:INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'how many packages sync success at this time',
        },
        fail_sync_num: {
          type:INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'how many packages sync fail at this time',
        },
        left_sync_num: {
          type:INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'how many packages left to be sync',
        },
        last_sync_module: {
          type:STRING(100),
          allowNull: true,
          comment: 'last sync success module name',
        },
      }, {
        tableName: 'total',
        comment: 'total info',
        createdAt: false,
      });
      return Total;
}
 
