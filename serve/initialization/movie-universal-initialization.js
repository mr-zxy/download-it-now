const path = require("path");
const fs = require("fs");
const got = require("got");
const agent = require("../tools/agent");
const Cluster = require("../core/universal-cluster");
const { getDownloadPath } = require("../tools/tool");
const mergeCompleteFile = require("../tools/merge-complete-file");
const m3u8Synthesis = require("../tools/m3u8-synthesis");
const m3u8RmResidue = require("../tools/m3u8-rm-residue");

class MovieUniversalInitialization {
    constructor(param = {}) {
        this.param = param;
        this.ranges = [];
        this.sectionCluster = {};
    }

    /**
     * 生成下载列表
     * @param {*} url 
     * @param {*} size 
     * @param {*} number 生成多少切片
     * @param {*} type audio or video
     * @returns 
     */
    generateDownloadList(url, size, number, type, initialIdx = 0) {
        const sectionSize = Math.ceil(size / number);
        return Array.from(new Array(number)).map((_, index) => ({
            index: initialIdx + index,
            name: `${index}_${type}_${index * sectionSize}`,
            url: url,
            startByte: index * sectionSize,
            endByte: (index + 1) * sectionSize - 1
        }))
    }

    async setup() {
        const param = this.param;
        const { url, headers } = param.videoInfo;
        const { videoUrl, audioUrl } = url;
        console.log("开始获取资源！");
        if (audioUrl) {
            const fileInfo = await got.head(audioUrl, { headers, agent: agent.getGotAgent() });
            const totalBytes = fileInfo.headers['content-length'];
            console.log("音频Byte：" + totalBytes);
            const list = this.generateDownloadList(audioUrl, totalBytes, 20, "audio", 0)
            this.ranges = this.ranges.concat(list);
        }

        if (videoUrl) {
            const fileInfo = await got.head(videoUrl, { headers, agent: agent.getGotAgent() });
            const totalBytes = fileInfo.headers['content-length'];
            console.log("视频Byte：" + totalBytes);
            const list = this.generateDownloadList(videoUrl, totalBytes, 80, "video", this.ranges.length)
            this.ranges = this.ranges.concat(list);
        }
    }

    // 开始
    async start() {
        await this.setup();
        this.sectionCluster = new Cluster(this.ranges, this.param);
        this.sectionCluster.startCluster();
    }

    // 切片合成
    static async synthesisSection(param) {
        if (!param) {
            return
        }

        const dirPath = getDownloadPath(param);

        console.log("正在生成合成文件");
        const videoCompleName = "video";
        const audioCompleName = "audio";
        mergeCompleteFile(dirPath, "video", videoCompleName);
        const isAudio = mergeCompleteFile(dirPath, "audio", audioCompleName);

        // 合成视频
        console.log("正在合成视频");
        if (isAudio) {
            await m3u8Synthesis("file", param, videoCompleName, audioCompleName);
        } else {
            // 重命名为mp4
            fs.renameSync(path.join(dirPath, videoCompleName), path.join(dirPath, "output.mp4"))
        };
        console.log("合并完成");

        // 删除残余文件
        console.log("正在删除残余文件");
        m3u8RmResidue(param);
        console.log("视频存放路径：" + dirPath);
    }
}

module.exports = MovieUniversalInitialization;