const { exec } = require('child_process');
const { M3u8SynthesisFileName } = require("./m3u8-generate-connect");
const { getDownloadPath } = require("../tools/tool");
const numCPUs = require('os').cpus().length;

/**
 * m3u8 合成
 * @param {*} type 类型
 */
async function synthesisVideo(dirPath) {
    return new Promise((resolve, reject) => {
        const output = "/output.mp4"
        const shell = `ffmpeg -f concat -safe 0 -i ${dirPath + M3u8SynthesisFileName} -c copy -f mp4 ${dirPath + output} -y -threads ${numCPUs}`
        exec(shell, (error, _stdout) => {
            if (error) {
                reject(error)
            }
            resolve(dirPath + output)
        });

        // ffmpeg()
        // .input(dirPath + M3u8SynthesisFileName)
        // .inputOptions(['-f concat', '-safe 0'])
        // .outputOptions(['-c copy', '-f mp4', '-y', `-threads ${numCPUs}`])
        // .output(dirPath + output)
        // .on('end', () => {
        //     resolve(dirPath + output)
        // })
        // .on('error', (err) => {
        //     reject(err)
        // })
        // .run();
    })
}

async function universalSynthesis(dirPath, videoName, audioName) {
    return new Promise((resolve, reject) => {
        const output = "/output.mp4"
        const shell = `ffmpeg -i ${dirPath + "/" + videoName} -i ${dirPath + "/" + audioName} -c:v copy -c:a aac -strict experimental ${dirPath + output} -y -threads ${numCPUs}`;
        exec(shell, (error, _stdout) => {
            if (error) {
                reject(error)
            }
            resolve(dirPath + output)
        });

        // ffmpeg()
        //     .input(dirPath + "/" + videoName)
        //     .input(dirPath + "/" + audioName)
        //     .output(dirPath + output)
        //     .videoCodec('copy')
        //     .audioCodec('aac')
        //     .audioChannels(2)
        //     .audioBitrate('128k')
        //     .outputOptions('-strict experimental')
        //     .outputOptions(`-threads ${numCPUs}`)
        //     .on('end', function () {
        //         resolve(dirPath + output)
        //     })
        //     .on('error', function (err) {
        //         reject(err)
        //     })
        //     .run();
    })
}

module.exports = async (type = "m3u8", param = {}, videoName, audioName) => {

    const dirPath = getDownloadPath(param);

    if (type === "m3u8") {
        return await synthesisVideo(dirPath)
    }

    if (type === "file") {
        return await universalSynthesis(dirPath, videoName, audioName)
    }
}