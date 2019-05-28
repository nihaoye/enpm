'use strict';

const Controller = require('egg').Controller;
const fse=require("fs-extra");
const path = require('path');
const svnSetting = require('../../config/svn');
const commonConfig = require('../../config/common')
const jsbtf = require('js-beautify')
class SvnSettingController extends Controller {
    index(){
        this.ctx.body = {
            registry:svnSetting.registry,
            username:svnSetting.username
        }
    }
    async view(){
        this.ctx.body = await fse.readFileSync(path.join(__dirname,'../public/svn.html'),'utf8');
    }
    async edit(){
        let params = this.ctx.request.body;
        if(!params.username){
            this.ctx.body = {
                code:0,
                msg:'用户名不能为空'
            };
            return;
        }
        if(!params.password){
            this.ctx.body = {
                code:0,
                msg:'密码不能为空'
            };
            return;
        }
        if(!params.registry){
            this.ctx.body = {
                code:0,
                msg:'svn仓库地址不能为空'
            };
            return;
        }
        let svnJson = await fse.readJSON(path.join(__dirname,'../../config/svn.json'));
        svnJson.username = params.username;
        svnJson.password = params.password;
        svnJson.registry = params.registry;
        let str = jsbtf(JSON.stringify(svnJson),{ indent_size: 2, space_in_empty_paren: true });
        await fse.writeFile(path.join(__dirname,'../../config/svn.json'),str);
        svnSetting.username = params.username;
        svnSetting.password = params.password;
        svnSetting.registry = params.registry;
        this.ctx.body = {
            code:1,
            msg:'修改成功'
        };
        if(await fse.pathExists(path.join(commonConfig.resourcePath, ".svn"))){
            await fse.rmdir(path.join(commonConfig.resourcePath, ".svn"))
        }
        try{
            console.log('svn连接测试...')
            svn.checkout().then(()=>{
              console.log('svn连接测试:成功')
            });
          }catch(e){
            console.log('svn连接测试:失败')
          }
    }
}

module.exports = SvnSettingController;
