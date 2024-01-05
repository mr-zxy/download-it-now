const bilibiliLogin = require("./movies-login")

/**
 * 默认数据
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", _website = "") => {
    const { page } = bilibiliLogin.bilibiliConfig.browser;
    await page.goto(url, { waitUntil: 'networkidle2' });
    const __pinia = await page.evaluate(() => {
        return window.__pinia
    });
    
    return __pinia.feed.data.recommend.item.map(v => {
        return {
            pic: v.pic,
            href: v.uri,
            title: v.title,
            describe: v.owner?.name,
            score: v.rcmd_reason?.content,
            renew: 0
        }
    });
};
