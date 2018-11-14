const fs = require('fs');
const axios = require('axios');

async function getImage() {
  const response = await axios({
      url:'https://www.baidu.com/img/baidu_jgylogo3.gif',
      responseType: 'stream'
   })
  response.data.pipe(fs.createWriteStream('./someimage.gif'))
}
getImage();