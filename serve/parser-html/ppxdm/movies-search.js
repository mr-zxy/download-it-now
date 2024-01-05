const cheerio = require('cheerio');
const got = require("got");
const agent = require("../../tools/agent");

/**
 * 搜索
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    if (!website) { console.log("请填写网站路径"); return }
    const response = await got(url, { agent: agent.getGotAgent(),timeout: 5000 });
    const $ = cheerio.load(response.body);
    const children = $(".module-card-item")
    const list = [];
    children.each((_index, item) => {
        const pic = $(item).find(".module-item-pic img").attr("data-original");
        const href = website + $(item).find("a").attr("href");
        const title = $(item).find(".module-card-item-info a").text();
        const describe = "";
        const score = "";
        const renew = $(item).find(".module-item-note").text();
        list[list.length] = { pic, href, title, describe, score, renew };
    });
    return list
};