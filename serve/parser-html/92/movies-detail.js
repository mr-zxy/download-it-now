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
    const elementDetail = $(".video-container")

    const pic = "";
    const title = elementDetail.find(".title-wrap").text().trim();
    const describe = "没有添加描述";
    const otherList = [];

    // 集数
    const episodesList = [{
        label: "线路1",
        episodes: [
            {
                href: url,
                label: "1集"
            }
        ]
    }];

    return { pic, title, describe, otherList, episodesList }
};