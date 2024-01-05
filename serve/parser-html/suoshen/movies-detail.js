const cheerio = require('cheerio');
const got = require("got");
const agent = require("../../tools/agent");

/**
 * 影视详情数据
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    if (!website) { console.log("请填写网站路径"); return }
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const elementDetail = $(".stui-content__detail")

    const pic = "";
    const title = elementDetail.find(".title").eq(0).text().trim();
    const describe = "";
    const children = elementDetail.find("p");

    const otherList = [];
    children.each((_index, item) => otherList.push($(item).text()));

    // 集数
    const tabs = $(".tab li");
    const episodesList = [];

    tabs.each((index, item) => {
        const playText = $(item).text().trim();
        episodesList.push({
            label: playText,
            episodes: getEpisodes(index)
        })
    });


    function getEpisodes(index) {
        const box = $("body > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(5) div");
        const children = box.eq(index).find(".btn-primary-ph");
        const list = [];
        children.each((_index, item) => {
            const a = $(item);
            list.push({
                href: website + a.attr("href"),
                label: a.text()
            })
        })
        return list;
    }

    return { pic, title, describe, otherList, episodesList }
};