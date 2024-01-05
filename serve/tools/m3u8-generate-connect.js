const fs = require("fs");
const { getDownloadPath } = require("../tools/tool")

const M3u8SynthesisFileName = "/list.txt";

// m3u8 生成 list.txt 方便使用ffmpeg合成
const fn = (param = {}) => {
    const dirPath = getDownloadPath(param);
    const files = fs.readdirSync(dirPath);
    const result = files.filter(v => /^\d/.test(v)).sort((a, b) => {
        const aNumber = a.split("_")[0] * 1;
        const bNumber = b.split("_")[0] * 1;
        return aNumber - bNumber
    }).map(v => {
        return `file '${dirPath + "/" + v}'`
    });
    fs.writeFileSync(dirPath + M3u8SynthesisFileName, result.join('\n'))
};
fn.M3u8SynthesisFileName = M3u8SynthesisFileName;
module.exports = fn

