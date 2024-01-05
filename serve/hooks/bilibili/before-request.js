module.exports = (param = {}) => {
    const { videoInfo } = param;
    const { url } = videoInfo;
    param.videoInfo.headers.referer = url.pageUrl;
}