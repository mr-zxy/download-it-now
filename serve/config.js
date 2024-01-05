const path = require("path");

const distinguishPath = (name = "") => {
    // 子线程
    if (process.env.NODE_ENV === "production" && process.resourcesPath == undefined) {
        return name ? path.resolve(__dirname, `../../${name}/`) : path.resolve(__dirname, "../../")
    }
    // exe 运行主线程
    else if (process.env.NODE_ENV === "production" && process.resourcesPath) {
        return name ? path.join(process.resourcesPath, `./${name}/`) : path.join(process.resourcesPath)
    }
    else {
        return name ? path.resolve(__dirname, `./${name}/`) : path.resolve(__dirname)
    }
}

module.exports = {
    name: "下载吧～",
    // 根路径
    basePath: distinguishPath(),
    // 视频下载路径
    downloadPath: distinguishPath("download"),
    // 日志路径
    loggerPath: distinguishPath("log"),
    // 储存
    storagePath: distinguishPath("storage"),
    // 代理 ip+端口
    httpsAgent: "", // http://127.0.0.1:7890
    // 检查代理
    checkAgentUrl: "https://myip.top",
}