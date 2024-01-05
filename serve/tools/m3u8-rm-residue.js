const fs = require("fs");
const { getDownloadPath } = require("../tools/tool")

// 删除残余文件 同步
module.exports = (param = {}) => {
    const dirPath = getDownloadPath(param);
    const files = fs.readdirSync(dirPath).filter(v => !/.mp4/.test(v));
    files.forEach(v => fs.rmSync(dirPath + "/" + v));
}