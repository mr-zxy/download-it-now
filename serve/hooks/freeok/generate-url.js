const m3u8Parser = require('m3u8-parser');
const { getM3u8ByUrl } = require("../../tools/m3u8-url");
const got = require("got");
const cheerio = require('cheerio');
const agent = require("../../tools/agent");
const mp4Decrypt = require("./mp4-decrypt");

// url 处理
const format = (url) => {
    const urlSplit = url.split("/");
    urlSplit.splice(urlSplit.length - 1, 1)
    return urlSplit.join("/") + "/"
}

// 检测是否存在 #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=85,RESOLUTION=600x450
const vaildPlaylists = async (url) => {
    const manifest = await getM3u8ByUrl(url);

    const parser = new m3u8Parser.Parser();
    parser.push(manifest);
    parser.end();

    const parsedManifest = parser.manifest;
    const playlists = parsedManifest.playlists || [];
    if (playlists.length > 0) {
        const playZero = playlists[0];
        return format(url) + playZero.uri
    }
    return null;
}

const getplayerData = async (url) => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const element = $(".player-box-main")
    const scripts = element.find("script")
    const playerText = scripts.eq(0).text();
    var jsonRegex = /var player_aaaa=/;
    const player_aaaa = JSON.parse(playerText.replace(jsonRegex, ""));
    return player_aaaa
}

const getplayerMp4Data = async (url) => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    const response = await got(url, { agent: agent.getGotAgent(), timeout: 5000 });
    const $ = cheerio.load(response.body);
    const metas = $("meta");

    let charsetId = null;
    let viewportId = null;
    metas.each((_, item) => {
        if ($(item).attr("charset") === "UTF-8") {
            charsetId = $(item).attr("id").replace(/now_/, "");
        }

        if ($(item).attr("name") === "viewport") {
            viewportId = $(item).attr("id").replace(/now_/, "");
        }
    })

    const scripts = $("script");
    let scriptText = "";
    scripts.each((_, item) => {
        if ($(item).attr("type") === "text/javascript") {
            scriptText = $(item).text();
        }
    });

    const regex = /var\s+config\s+=\s+({[\s\S]+?})/;
    const match = scriptText.match(regex);
    const configString = match[1];

    const regexUrl = /"url":\s*"([^"]+)"/g;
    const matches = configString.match(regexUrl);
    const urls = matches.map(match => match.replace(/"url":\s*"/, "").replace(/"$/, ""))?.[0];
    const result = mp4Decrypt({ url: urls, viewportId, charsetId })
    return result;
}

async function getM3u8Result(decryptUrl) {
    const newUrl = await vaildPlaylists(decryptUrl);
    const result = newUrl ? newUrl : decryptUrl;
    return [
        {
            label: result,
            audioUrl: "",
            videoUrl: result,
        }
    ]
}

async function getMp4Result(key) {
    const pageUrl = `https://www.freeok.vip/okplayer/?url=${key}`;
    const result = await getplayerMp4Data(pageUrl)
    return [
        {
            label: result,
            audioUrl: "",
            videoUrl: result,
        }
    ]
}

module.exports = async (url) => {
    const data = await getplayerData(url);
    const decryptUrl = unescape(data.url);
    
    if (decryptUrl) {
        if (!!~decryptUrl.indexOf(".m3u8")) {
            return await getM3u8Result(decryptUrl)
        } else {
            return await getMp4Result(decryptUrl);
        }
    }

}