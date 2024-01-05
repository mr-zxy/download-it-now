const bilibiliLogin = require("../../parser-html/bilibili/movies-login")
const { randomNumber } = require("../../tools/tool")

function getContentRange(page) {
    return new Promise((resolve) => {
        page.on('response', async response => {
            if (response.url().indexOf(".m4s")) {
                const responseHeaders = response.headers();
                const contentRange = responseHeaders["content-range"];
                if (!!~contentRange?.indexOf("bytes")) {
                    if (contentRange) {
                        const [_, range] = contentRange.split("/");
                        if (range) {
                            page.off('response');
                            resolve(range)
                        }
                    }
                }
            }
        });
    })
}

module.exports = async (url) => {
    const { page } = bilibiliLogin.bilibiliConfig.browser;
    const __playinfo__ = await page.evaluate(() => {
        return window.__playinfo__
    });

    // const videoByte = await getContentRange(page);

    const { video, audio } = __playinfo__.data.dash;

    function getRatioById(id) {
        switch (id) {
            case 16:
                return "360p"
            case 32:
                return "480p"
            case 64:
                return "720p"
            case 80:
                return "1080p"
            case 112:
                return "1080p+"
            default:
                return "unknown"
        }
    }

    const pageUrl = page.url();

    const audioList = audio.map(v => v.baseUrl);

    return video.map((v, index) => {
        return {
            pageUrl,
            label: getRatioById(v.id) + "_" + index,
            audioUrl: audioList[randomNumber(0, audioList.length - 1)],
            videoUrl: v.baseUrl,
        }
    })
}