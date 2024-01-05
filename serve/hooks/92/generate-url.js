const got = require("got");
const cheerio = require('cheerio');
const agent = require("../../tools/agent");

const getplayerData = async (url) => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const key = $(".player").attr("nt-main-skey").trim();
    return key
}

module.exports = async (url) => {
    const key = await getplayerData(url);
    const result = `https://www.92gyw.com/shortVideo/${key}.m3u8`;
    return [
        {
            label: result,
            audioUrl: "",
            videoUrl: result,
        }
    ]
}