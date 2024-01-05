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
    const response = await got(url, { agent: agent.getGotAgent(),timeout: 5000 });
    const $ = cheerio.load(response.body);
    const elementDetail = $(".hl-detail-content")

    const pic = elementDetail.find(".hl-dc-pic span").attr("data-original");
    const title = elementDetail.find(".hl-dc-content .hl-dc-headwrap .hl-dc-title").text();
    const describe = elementDetail.find(".hl-dc-content .hl-dc-headwrap .hl-dc-sub").text();
    const children = elementDetail.find(".hl-dc-content .hl-vod-data .hl-data-sm .hl-full-box ul").children();

    const otherList = [];
    children.each((_index, item) => otherList.push($(item).text()));

    // 集数
    const elementPlay = $(".hl-rb-playlist");
    const tabs = elementPlay.find(".hl-plays-wrap .hl-plays-from").children();
    const episodesList = [];

    tabs.each((index, item) => {
        const playText = $(item).text().trim();
        episodesList.push({
            label: playText,
            episodes: getEpisodes(index)
        })
    });


    function getEpisodes(index) {
        const box = elementPlay.find(".hl-tabs-box");
        const children = box.eq(index).find("li");
        const list = [];
        children.each((_index, item) => {
            const a = $(item).find("a");
            list.push({
                href: website + a.attr("href"),
                label: a.text()
            })
        })
        return list;
    }

    return { pic, title, describe, otherList, episodesList }
};