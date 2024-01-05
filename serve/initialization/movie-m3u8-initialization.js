const { getM3u8ByUrl, getM3u8ByPath, m3u8Parser } = require("../tools/m3u8-url");
const Cluster = require("../core/universal-cluster");
const generateConnect = require("../tools/m3u8-generate-connect");
const m3u8Synthesis = require("../tools/m3u8-synthesis");
const m3u8RmResidue = require("../tools/m3u8-rm-residue");
const m3u8Header = require("../tools/m3u8-header");
const getM3u8DecryptParam = require("../tools/m3u8-decrypt");

class MovieM3u8Initialization {
    constructor(param = {}) {
        this.m3u8Text = "";
        this.m3u8List = [];
        this.param = param;
        this.sectionCluster = {};
    }

    async setup() {
        const param = this.param;
        const m3u8Text = await getM3u8ByUrl(param.videoInfo.url.videoUrl, param.videoInfo.headers);
        const m3u8List = await m3u8Parser(m3u8Text);

        if (param.hooks.tsSectionSupplement) {
            const tsSectionPath = param.hooks.tsSectionSupplement.replace(/\//g, "_");
            await global.$require[tsSectionPath](param, m3u8List)
        }

        this.m3u8Text = m3u8Text;
        this.m3u8List = m3u8List;
    }

    // 开始
    async start() {
        await this.setup();
        this.sectionCluster = new Cluster(this.m3u8List, this.param);
        this.sectionCluster.startCluster();
    }

    // 合成
    async synthesis() {
        const param = this.param;
        const m3u8Text = this.m3u8Text;
        await MovieM3u8Initialization.synthesisSection(param, m3u8Text);
    }

    // 切片合成
    static async synthesisSection(param, m3u8Text) {

        if (!param) {
            return
        }

        console.log("正在解密");
        await getM3u8DecryptParam(m3u8Text, param);

        // 检测头部是否存在异常，进行修复。
        console.log("正在校验头部！")
        await m3u8Header(param);

        // 生成 .txt ffmpg 合成文件
        console.log("正在生成合成文件")
        generateConnect(param);

        // 合成视频
        console.log("正在合成视频");
        const synthesisPath = await m3u8Synthesis("m3u8", param);
        console.log("合并完成");

        // 删除残余文件
        console.log("正在删除残余文件")
        m3u8RmResidue(param);
        console.log("视频存放路径：" + synthesisPath);
    }
}

module.exports = MovieM3u8Initialization;