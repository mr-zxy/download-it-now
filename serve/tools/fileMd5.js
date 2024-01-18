const fs = require('fs');  
const crypto = require('crypto');  
  
const stream = fs.createReadStream('C:/Users/19894/Desktop/tools/download-it-now/download-it-now.exe');  
  
const hash = crypto.createHash('md5');  
  
stream.on('data', chunk => {  
  hash.update(chunk);  
});  
  
stream.on('end', () => {  
  const md5 = hash.digest('hex');  
  console.log('MD5:', md5);  
});