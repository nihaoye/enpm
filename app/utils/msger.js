
const path = require('path');
const dayjs = require('dayjs');
const charset = require('superagent-charset');
const request = charset(require('superagent'));
const CryptoJS = require('crypto-js');
const url = 'http://192.168.0.249/';
const FormData = require('formdata');
const axios = require('axios');
var qs = require('qs');
const fs = require('fs');
const UserAgent="Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36";
const user={
    name:"zhangyuhao",
    pwd:"123456"
};
let cookie=null;
const keyword="npm_packages_";
function Msger(){
    this.login=function(){
        return  new Promise(function(resolve,reject){
            request.get(url+'Home/Login').end((err,res)=>{
                cookie = res.header['set-cookie'];
                let token=getToken(res.text);
                let params={
                    __RequestVerificationToken:token,
                    UserId:"zhangyuhao",
                    Password:"GzhJicT/x9NbEttw25vX923xE73x+q0NIc1Ge2OVZskbU8krUoAKGDeNlK7H8bN3TAGAFpVSWbUYRRxz5/v967i3JZfjxd8QMvsCBMlm9X32Fhxl3OWIDBfVaihoR5PzSmyo2soKUnHE7zJBmcgVPw4iDmPh9bX/bCmffEjjqQg=",
                    rememberMe:true,
                    loginType:"CA",
                    CAPassword:undefined
                };
                request.post(url+"MvcPages/Home/LoginPost")
                    .type('form')
                    .send(params)
                    .charset("gbk")
                    .end((err,res)=>{
                        cookie = res.header['set-cookie'];
                        setTimeout(function(){
                            request
                                .get(url+"/Default.aspx")
                                .set("Cookie",cookie)
                                .end((err,res)=>{
                                    resolve(res);
                                })
                            ;
                        },500)
                    });

            });
        });
    };
    this.getMsg=function(type){
        return new Promise((resolve,reject)=>{
            type=type||'file';
            request
                .get(url+"Users/usermessage/GetMessages")
                .send({
                    messageCategory:'Inbox',
                    orderBy:'SendTime',
                    searchStr:keyword+(type==='file'?'files':'sync'),
                    page:1,
                    rows:20
                })
                .set("Cookie",cookie)
                .end((err,res)=>{
                    let json=JSON.parse(res.text);
                    if(json.total==0){
                        resolve(null)
                    }else{
                        let msg=json.rows[0];
                        request
                        .get(url+"Users/usermessage/GetMessageById")
                        .send({
                            messageId:msg.Id
                        })
                        .set("Cookie",cookie)
                        .end((err,res)=>{
                            let detail=JSON.parse(res.text);
                            let result={
                                id:msg.Id,
                                title:detail.Subject,
                                content:detail.Body,
                                file:null,
                                type:"file"
                            };
                            if(new RegExp(keyword+'files_.*').test(msg.Subject)){
                                result.type="file";
                                result.content=detail.body;
                                // MvcUserControl/Document/MessageDocument?
                                request
                                .get(url+"MvcUserControl/Document/MessageDocument")
                                .send({
                                    systemMessageId:msg.Id,
                                    CanDelete:false
                                })
                                .set("Cookie",cookie)
                                .end((err,res)=>{
                                    let execResult=/_lnkDownload".+(\/Ajax\/WebUploader\/DownloadFile\?DocumentIds=[A-z|0-9|-]+)'.+"/g.exec(res.text);
                                    if(execResult){
                                        result.file=execResult[1];
                                    }
                                    resolve(result);
                                })
                            }else if(new RegExp(keyword+'sync_.*').test(msg.Subject)){
                                result.type="sync";
                                result.content=/.+<p>(.+)<\/p>.*/g.exec(detail.Body)[1];
                                resolve(result);
                            }
                        })        
                    }
                })
        })
    };
    this.downloadFile=function(file,targetPath){
        let fileName=path.basename(file);
        const stream = fs.createWriteStream(targetPath);
        return new Promise(function(resolve,reject){
            console.log(url.substring(-1)+file);
            axios({
                url:url.substring(0,url.length-1)+file,
                headers:{'Cookie':cookie},
                responseType: 'stream'
             }).then(res=>{
                res.data.pipe(stream);
                res.data.on('end',function(){
                    setTimeout(()=>{
                        console.log("下载完成")
                        resolve(true);
                    },2000); 
                })
             })
        })
        // const req = request.get(path.resolve(url,file))
        // .set("Cookie",cookie)
        // req.pipe(stream);
    }
    this.delMsg=function(id){
        console.log(id+"|"+"还是不要删邮件了，太危险!")
    };
    this.sendMsg=function({title,content,file,type}){
        if(type==='sync'){
            return new Promise((resolve,reject)=>{
                let params={
                    ReceiverNames:undefined,
                    ReceiversDisplay:user.name,
                    ccIds:undefined,
                    Subject:keyword+"sync_"+title||"",
                    IsImportant:false,
                    Body:encodeURIComponent(`<b>sync</b><p>${content||""}</p>`),
                    sendType:'send'
                };
                request
                    .post(url+'Users/usermessage/PostUserMessage')
                    .send(params)
                    .type('form')
                    .set('cookie',cookie)
                    .end((err,res)=>{
                        console.log("邮件发送完成:");
                        console.log(res.text);
                        resolve(params);
                    })
            })
        }else{
            return new Promise((resolve,reject)=>{
                this.uploadFile(file).then((fileInfo)=>{
                    let params={
                        ReceiverNames:undefined,
                        ReceiversDisplay:user.name,
                        ccIds:undefined,
                        Subject:keyword+"files_"+title||"",
                        IsImportant:false,
                        Body:encodeURIComponent(`<b>file</b><p>${content||""}</p>`),
                        file:undefined,
                        fileInfo:JSON.stringify({fileList:[fileInfo]}),
                        sendType:'send'
                    };
                    setTimeout(()=>{
                        request
                            .post(url+'Users/usermessage/PostUserMessage')
                            .send(params)
                            .type('form')
                            .set('cookie',cookie)
                            .end((err,res)=>{
                                console.log("邮件发送完成:");
                                console.log(res.text);
                                resolve(params);
                            })
                    },1000)
                })
                
            })
        }
        
    };
    this.uploadFile=function(file){
        let fileId="WU_FILE_2";
        return new Promise((resolve,reject)=>{
            if(file){
                let fs = require('fs');
                let info=fs.statSync(file);
                let fileInfo={
                    queueId:fileId,
                    name:path.basename(file),
                    size:info.size,
                    type:path.extname(file),
                    extension:path.extname(file),
                    mimetype:"application/octet-stream",
                    filePath:null
                };
                fs.readFile(file, function (err, data) {
                    if (err){
                        return null;
                    }
                    let form = new FormData();
                    form.append('file',data,path.basename(file));
                    /*------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="id"

                    WU_FILE_1
                    ------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="name"

                    MDB-Vue-Free-npm.zip
                    ------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="type"

                    application/octet-stream
                    ------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="lastModifiedDate"

                    Tue Sep 04 2018 11:19:54 GMT+0800 (中国标准时间)
                    ------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="size"

                    233386
                    ------WebKitFormBoundary42eIOJT1E9Hwvefd
                    Content-Disposition: form-data; name="file"; filename="MDB-Vue-Free-npm.zip"
                    Content-Type: application/octet-stream


                    ------WebKitFormBoundary42eIOJT1E9Hwvefd--*/
                    request
                        .post(url+'ajax/WebUploader/Process')
                        .field('id',fileId)
                        .field('name',path.basename(file))
                        .field('type',"application/octet-stream")
                        .field('size',info.size)
                        .attach("file",file)
                        .set('cookie',cookie)
                        .end((err,res)=>{
                            let json=JSON.parse(res.text);
                            fileInfo.filePath=json.filePath;
                            console.log("上传文件完成:");
                            console.log(json);
                            resolve(fileInfo)
                        });
                })
            }
        })
    }
}
function getToken(loginPage){
    let reg=/input\s+name="__RequestVerificationToken"\s+type="hidden"\s+value="(.+)"/g;
    return reg.exec(loginPage)[1];
}
// async function encrpyPwd(pwd){
//     let res=await http({
//         method:"get",
//         url:"Scripts/lib/login.js?v="+dayjs().format("YYYYMMDD"),
//     });
//     let pubkey=/"(.+)"/g.exec(res.text)[1];
// /*    let encrypt =null;// new encrypter(pubkey);
//     encrypt.setPublicKey(pubkey);*/
//     let en=CryptoJS.AES.encrypt(pwd+"", pubkey).toString();
//     console.log(en);
//     return en;
// }
let str="rVJYQ/ClJthhSO4Gyd3h0dX2vS4NrhHHHCTb036VZbxuJSV4ZTFKwn1B9o9FoZpZvDRK1H2sDmkUeZAb1Jw6FrbjVzRXFPSNygzBN8NGXqwnApUO+hkoxFy3avK3heJznhjoLsw553JQI8Q4vXpzgXIUlTlMe5sDzPdJr1jbPEw=";

// (async()=>{
//     var msger=new Msger();
//     await msger.login();
//     await msger.sendMsg({
//         title:"sendfiletest",
//         file:'e:/work/enpm/.enpm/sync_packages/tmp/mock.zip',
//         type:'file'
//     })
// })();
module.exports=new Msger()