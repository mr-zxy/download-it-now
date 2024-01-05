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
    const response = await got(url,{ agent: agent.getGotAgent() ,timeout: 5000});
    const $ = cheerio.load(response.body);
    const elementDetail = $(".module-main")

    const pic = elementDetail.find(".module-item-pic img").attr("data-original");
    const title = elementDetail.find(".module-info-heading h1").text();
    // const describe = elementDetail.find(".module-info-introduction-content p").text();
    const describe = "";
    const children = elementDetail.find(".module-info-item");

    const otherList = [];
    children.each((_index, item) => otherList.push($(item).text()));

    // 集数
    const elementPlay = $(".player-heading");
    const tabs = elementPlay.find(".module-tab .tab-item");
    const episodesList = [];

    tabs.each((index, item) => {
        const playText = $(item).text().trim();
        episodesList.push({
            label: playText,
            episodes: getEpisodes(index)
        })
    });


    function getEpisodes(index) {
        const box = $("#panel1");
        const children = box.eq(index).find("a");
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