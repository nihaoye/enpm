'use strict';

const Controller = require('egg').Controller;
const fse=require("fs-extra");
class HomeController extends Controller {
  index() {
    if(this.ctx.app.config.isInternet){
      this.ctx.body =fse.readFileSync('app/public/index_out.html','utf8');
    }else{
      this.ctx.body =fse.readFileSync('app/public/index_in.html','utf8');
    }
  }
}

module.exports = HomeController;
