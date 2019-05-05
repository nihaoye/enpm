const svnUltimate  = require('node-svn-ultimate');
const svnConfig = require('../../config/svn')
function checkout(){
    return new Promise((resolve,reject)=>{
        svnUltimate.commands.checkout(svnConfig.registry, svnConfig.cwd, function( err ) {
            if(!err){
                console.log( "Checkout complete" );
            }
            resolve(err)
        } );
    })
}
function update(){
    return new Promise((resolve,reject)=>{
        svnUltimate.commands.update(svnConfig.cwd,
            {	// optional options object - can be passed to any command not just update
                trustServerCert: true,	// same as --trust-server-cert
                username: svnConfig.username,	// same as --username
                password: svnConfig.password,	// same as --password
                cwd:svnConfig.cwd,		// override working directory command is executed
                force: true
            },
            function( err ) {
                if(!err){
                    console.log( "Update complete" );
                }else{
                    console.log(err);
                }
                resolve(err)
            } );
    })
}
function commit(){
    return  new Promise((resolve,reject)=>{
        svnUltimate.commands.add(svnConfig.cwd+"\\*",{
            trustServerCert: true,	// same as --trust-server-cert
            username: svnConfig.username,	// same as --username
            password: svnConfig.password,	// same as --password
            cwd:svnConfig.cwd,
            force: true
        },(err)=>{
            svnUltimate.commands.commit(svnConfig.cwd,{
                trustServerCert: true,	// same as --trust-server-cert
                username: svnConfig.username,	// same as --username
                password: svnConfig.password,	// same as --password
                params: [ '-m "提交npm"' ],
                force: true
            },(err)=>{
                if(!err){
                    console.log('commit complete');
                }else{
                    console.log(err);
                }
                resolve(err);
            });
        })
        
    })
}
module.exports = {checkout,update,commit}