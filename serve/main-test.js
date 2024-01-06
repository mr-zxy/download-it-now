require("./global");
require("./common");
const TaskQueue = require("./core/task-queue")

process.env.NODE_ENV = "development";

const param = {
    id: "707aa375-17da-4871-b675-f01a37c27cef",
    website: "https://www.anfuns.cc",
    title: "anfuns",
    logo: "https://bj.bcebos.com/baidu-rmb-video-cover-1/8ff4a69e0bbbd5bb5d9cc2c0f8ddb37f.png",
    analysis: {
        websiteDefaultDataUrl: "https://www.anfuns.cc/label/rankweek.html", // 主页面路径
        websiteSearchUrl: "https://www.anfuns.cc/search.html?wd=", // 搜索路径
        websiteSearchPath: "parser-html/anfuns/movies-search", // 搜索 方法
        getDefaultPath: "parser-html/anfuns/movies-default",   // 主页面，初始化，方法。
        getMovieDetailPath: "parser-html/anfuns/movies-detail", // 详情搜索方法
    },
    hooks: {
        getRealVideoUrlHook: "hooks/anfuns/generate-url", // 获取真实的 视频地址。方法。
    },
    videoInfo: {
        audioFormat: "m3u8", // 视频格式
        name: "1",  // 名称
        episodes: "2", // 集数
        url: { label: "1", audioUrl: "", videoUrl: "https://v91.whweitao.com/202311/10/1EUqZ7d0gk2/video/8000k_0X2160_64k_25/hls/index.m3u8" }, // 视频地址
        headers: {} // 请求头
    }
}

async function main() {
    const taskQueue = new TaskQueue();
    taskQueue.addition(param);
}

main();