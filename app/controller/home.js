'use strict';

const Controller = require('egg').Controller;
const fse=require("fs-extra")
class HomeController extends Controller {
  index() {
    this.ctx.body =fse.readFileSync('app/public/index.html','utf8');
  }
}

module.exports = HomeController;
