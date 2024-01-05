const { isValidUrl } = require("../../tools/tool")

// url 处理
const format = (url) => {
    const urlSplit = url.split("/");
    urlSplit.splice(urlSplit.length - 1, 1)
    return urlSplit.join("/") + "/"
}

/**
 * ts 切片链接补充
 * @param {*} param 
 * @param {*} m3u8List 
 */
module.exports = (param, m3u8List) => {
    const formatHref = format(param.videoInfo.url.videoUrl);
    m3u8List.forEach(element => {
        // 验证是否是 http
        if (!isValidUrl(element.uri)) {
            element.uri = formatHref + element.uri;
        }
    });
}