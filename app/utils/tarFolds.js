const tar = require('tar');
const fse=require('fs-extra');
const path=require('path');
var zipper = require('zip-local');
module.exports.c = function (source) {
    return new Promise(function(resolve,reject){
        let targetPath=path.resolve(source,"../","pkgs_"+new Date().getTime()+".zip");
        zipper.zip(source, function(error, zipped) {
            if(!error) {
                zipped.compress(); // compress before exporting
                // or save the zipped file to disk
                zipped.save(targetPath, function(err) {
                    if(err){
                        reject(err)
                    }else{
                        try{
                           // fse.emptyDirSync(source);
                        }catch(e){
                            reject(e)
                        }
                        resolve(targetPath)
                    }
                });
            }
        });
    })
};
module.exports.x=async function(source,target){

    
};