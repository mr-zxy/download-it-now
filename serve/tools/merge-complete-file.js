const fs = require("fs");
const path = require("path");
/**
 * 合成完整的文件
 * @param {*} dirPath 
 * @param {*} type 类型 audio or video
 * @param {*} newFileName 生成的文件名称
 * @returns 
 */
module.exports = (dirPath, type, newFileName) => {
    const files = fs.readdirSync(dirPath);
    const filesPath = files.filter(v => /^\d/.test(v) && !!~v.indexOf(type)).sort((a, b) => {
        const aNumber = a.split("_")[0] * 1;
        const bNumber = b.split("_")[0] * 1;
        return aNumber - bNumber
    });
    if (filesPath.length > 0) {
        filesPath.forEach(value => fs.appendFileSync(path.join(dirPath, newFileName), fs.readFileSync(path.join(dirPath, value))))
    };
    return filesPath.length > 0 ? true : false;
}