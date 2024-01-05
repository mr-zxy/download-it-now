// m3u8加密混淆png，更改头部。

const fs = require('fs');
const { getDownloadPath } = require("../tools/tool")
const { exec } = require('child_process');

// 使用ffprobe获取文件信息
function isFFmpegTSFile(filePath) {
  return new Promise((resolve, reject) => {
    exec(`ffprobe -v error -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, (error, stdout) => {
      // 检查codec_name是否为常见的TS流编码，如h264, aac等
      if (error) {
        reject(error);
      }
      const codecs = stdout.trim().split('\n');
      const isTS = codecs.some(codec => ['h264', 'aac', 'mpegts'].includes(codec));
      resolve(isTS)
    });
  })
}

module.exports = async (param = {}) => {
  const dirPath = getDownloadPath(param);
  const dirs = fs.readdirSync(dirPath);
  const fileNames = dirs.filter(v => /^\d/.test(v));

  await Promise.all(fileNames.map(async v => {
    const path = `${dirPath}/${v}`;
    if (await isFFmpegTSFile(path)) {
      return
    }

    const modifiedData = Buffer.concat([Buffer.from([0xFF], 'hex'), fs.readFileSync(path)]);
    fs.writeFileSync(addSuffix(path), modifiedData)
    fs.rmSync(path)

  }))

  function addSuffix(value) {
    if (!!~value.indexOf(".ts")) {
      return value
    }
    return value + ".ts"
  };
}