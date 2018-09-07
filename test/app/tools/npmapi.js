const npm=require("../../../app/utils/npm");
npm.request("/gulp/^3.9.0").then(function(res){
    console.log(res.data.dist);
});