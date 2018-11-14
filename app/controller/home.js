'use strict';

const Controller = require('egg').Controller;
const fse=require("fs-extra")
class HomeController extends Controller {
  index() {
    if(this.ctx.app.config.isInternet){
      this.ctx.body =fse.readFileSync('app/public/addTask.html','utf8');
    }else{
      this.ctx.body =fse.readFileSync('app/public/index.html','utf8');
    }
  }
}

module.exports = HomeController;
