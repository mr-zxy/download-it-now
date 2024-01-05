const http = require('http');
const fs = require('fs');
module.exports = (port = 65000,path="") => {
    // 创建HTTP服务器  
    const server = http.createServer((req, res) => {
        const filePath = __dirname + req.url;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    });
    // 启动服务器并监听端口  
    server.listen(port, () => console.log(`启动成功：http://localhost:65000/${path}/index.html`));
}