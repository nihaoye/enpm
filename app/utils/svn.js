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
        svnUltimate.commands.update(svnConfig.registry,
            {	// optional options object - can be passed to any command not just update
                trustServerCert: true,	// same as --trust-server-cert
                username: svnConfig.username,	// same as --username
                password: svnConfig.password,	// same as --password
                shell: "sh", 			// override shell used to execute command
                cwd:svnConfig.cwd,		// override working directory command is executed
                force: true,			// provide --force to commands that accept it
            },
            function( err ) {
                if(!err){
                    console.log( "Update complete" );
                }
                resolve(err)
            } );
    })
}
function commit(){
    return  new Promise((resolve,reject)=>{
        svnUltimate.commands.commit(svnConfig.cwd,{
            trustServerCert: true,	// same as --trust-server-cert
            username: svnConfig.username,	// same as --username
            password: svnConfig.password,	// same as --password
            shell: "sh", 			// override shell used to execute command
        },(err)=>{
            if(!err){
                console.log('commit complete');
            }
            resolve(err);
        });
    })
}
module.exports = {checkout,update,commit}