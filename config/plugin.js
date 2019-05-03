'use strict';
const path=require('path');
// had enabled by egg
// exports.static = true;
module.exports.sequelize = {
    enable: true,
    path :path.resolve(process.cwd(),"plugins/egg-sequelize"),
};
module.exports.cors = {
    enable: true,
    package: 'egg-cors',
}
