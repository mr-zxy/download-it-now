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
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const children = $(".stui-pannel_bd li")
    const list = [];
    children.each((_index, item) => {
        const pic = $(item).find("a").attr("data-original");
        const href = website + $(item).find("a").attr("href");
        const title = $(item).find(".title .text-overflow").text();
        const describe = "";
        const score = "";
        const renew = $(item).find(".flo_rig").text().trim();
        list[list.length] = { pic, href, title, describe, score, renew };
    });
    return list
}