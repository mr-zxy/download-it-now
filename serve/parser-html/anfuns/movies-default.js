const cheerio = require('cheerio');
const got = require("got");
const agent = require("../../tools/agent");

/**
 * 首页 默认数据
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    if (!website) { console.log("请填写网站路径"); return }
    const response = await got(url, { agent: agent.getGotAgent(),timeout: 5000 });
    const $ = cheerio.load(response.body);
    const children = $(".hl-list-item")
    const list = [];
    children.each((_index, item) => {
        const pic = $(item).find(".hl-item-pic a").attr("data-original");
        const href = website + $(item).find(".hl-item-pic a").attr("href");
        const title = $(item).find(".hl-item-content a").attr("title");
        const describe = $(item).find(".hl-item-content .hl-item-sub").text();
        const score = $(item).find(".hl-item-content .hl-item-remarks .score").text();
        const renew = $(item).find(".hl-item-content .hl-item-remarks").html()?.replace(/<span[^>]*>(.*?)<\/span>/g, '');
        list[list.length] = { pic, href, title, describe, score, renew };
    });
    return list
}