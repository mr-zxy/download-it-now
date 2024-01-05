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
    const response = await got(url ,{agent:agent.getGotAgent(),timeout: 5000} );
    const $ = cheerio.load(response.body);
    const children = $(".short-item")
    const list = [];
    children.each((_index, item) => {
        const regex = /background-image:\s*url\((.*?)\)/;
        const pic = "https:"+$(item).find(".bg-2").attr("style").match(regex)[1];;
        const href = website + $(item).find(".info").attr("href");
        const title = $(item).find(".info .title").text().trim();
        const describe = $(item).find(".info .other .time").text().trim();
        const score = "";
        const renew = "播放时长："+$(item).find(".tm").text();
        list[list.length] = { pic, href, title, describe, score, renew };
    });
    return list
}