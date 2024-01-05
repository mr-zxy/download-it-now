const bilibiliLogin = require("./movies-login")

module.exports = async (url = "", website = "") => {
    const { page } = bilibiliLogin.bilibiliConfig.browser;
    await page.goto(url, { waitUntil: 'networkidle2' });
    const __INITIAL_STATE__ = await page.evaluate(() => {
        return window.__INITIAL_STATE__
    });
    const { videoData } = __INITIAL_STATE__;

    // 一线路
    let lineOne = [];
    try {
        videoData.pages.map((v, index) => {
            lineOne.push({
                href: `${website}/video/${videoData.bvid}?p=${index + 1}`,
                label: v.part
            })
        })
    } catch (e) {
        lineOne = []
    }

    // 二线路
    let lineTwo = [];
    try {
        videoData?.ugc_season?.sections?.forEach((element, index) => {
            element?.episodes?.forEach(vv => {
                lineTwo.push({
                    href: `${website}/video/${vv.bvid}?p=${index + 1}`,
                    label: vv.title
                })
            })
        });
    } catch (e) {
        lineTwo = [];
    }

    return {
        pic: videoData.pic,
        title: videoData.title,
        describe: videoData.desc,
        otherList: [],
        episodesList: [
            {
                label: "线路一",
                episodes: lineOne
            },
            {
                label: "集合列表",
                episodes: lineTwo
            }
        ]
    }
}