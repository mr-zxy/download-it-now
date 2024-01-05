const cheerio = require('cheerio');
const got = require("got");
const agent = require("../../tools/agent");

const parserHtml = async (url, website) => {
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const children = $(".search__media_li")
    const list = [];
    children.each((_index, item) => {
        const pic = $(item).find(".searchList_thumb a").attr("data-original");
        const href = website + $(item).find(".searchList_thumb a").attr("href");
        const title = $(item).find(".title a").attr("title");
        const describe = "";
        const score = "";
        const renew = $(item).find(".flo_lft").text().trim();
        list[list.length] = { pic, href, title, describe, score, renew };
    });
    return list
}

/**
 * 搜索
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    if (!website) { console.log("请填写网站路径"); return }
    const response = await got(getUrl(1), { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);

    const children = $(".stui-page li");
    const page = [];
    children.each((_index, item) => {
        const mat = $(item).text().match(/\d+/g);
        if (mat) {
            page.push(...mat)
        }
    });

    const list = [];
    const max = Math.max(...page);
    const results = Array.from(new Array(max)).map(async (_v, index) => {
        const result = await parserHtml(getUrl(index + 1), website);
        return result
    })

    const result = await Promise.all(results);
    result.forEach(v => list.push(...v));

    return list;

    function getUrl(pageIndex = 1) {
        return `${url}-${pageIndex}`;
    }
};