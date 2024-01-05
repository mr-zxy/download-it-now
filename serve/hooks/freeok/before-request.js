module.exports = (param = {}) => {
    const { videoInfo } = param;
    if (!!~videoInfo.url.videoUrl.indexOf(".m3u8")) {
    } else {
        videoInfo.audioFormat = "file";
    }
}