const got = require('got');
const fs = require("fs");
const path = require("path");

const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "referer": "https://www.bilibili.com/video/BV1B64y1J7s6/?spm_id_from=333.1007.tianma.3-3-9.click&vd_source=ca0c65e99a2d3ae3751eab02c8ebb184"
}

// 生成下载列表
function generateDownloadList(url, size, number) {
    const sectionSize = Math.ceil(size / number);
    return Array.from(new Array(number)).map((_, index) => ({
        index: index,
        url: url,
        startByte: index * sectionSize,
        endByte: (index + 1) * sectionSize - 1
    }))
}

async function downloadMP4Range(url, startByte, endByte, outputPath) {

    headers.range = `bytes=${startByte}-${endByte}`

    const stream = got.stream(url, {
        headers: headers,
    })

    const outputStream = fs.createWriteStream(outputPath);
    stream.pipe(outputStream);

    return new Promise((resolve, reject) => {
        outputStream.on('finish', () => {
            resolve();
        });

        outputStream.on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadAndMergeMP4(url, outputPath) {
    // 获取视频文件的大小和总字节数  
    const fileInfo = await got.head(url, { headers });
    const totalBytes = fileInfo.headers['content-length'];

    // 生成下载列表
    const ranges = generateDownloadList(url, totalBytes, 80);
    console.log(ranges.length)
    // ranges.length = 1

    // 下载每个范围并合并到新文件中  
    for (const range of ranges) {
        const tempFilePath = path.join(__dirname, `./temp/${range.index}_temp_video_${range.startByte}.mp4`); // 在临时目录中保存每个范围的文件  
        await downloadMP4Range(range.url, range.startByte, range.endByte, tempFilePath); // 下载每个范围的文件  
        fs.appendFileSync(outputPath, fs.readFileSync(tempFilePath)); // 将每个范围的文件追加到目标文件中  
    }
}

console.time("executionTime");
// 使用方法：下载并合并MP4文件到新文件  
downloadAndMergeMP4('https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/o0PO5bshFBs2VENErAfyE9WzQjm6pgtnt3xqRE?filename=1.mp4', './down/merged_video.mp4')
    .then(() => {
        console.timeLog("executionTime")
        console.log('视频下载并合并完成')
    }
    )
    .catch((err) => console.error('视频下载或合并出错:', err));