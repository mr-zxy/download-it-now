const m3u8Parser = require('m3u8-parser');
const { getM3u8ByUrl } = require("../../tools/m3u8-url");
const got = require("got");
const cheerio = require('cheerio');
const agent = require("../../tools/agent");

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
    const key = $("#myVideo #source").attr("src")?.trim();
    return key
}

module.exports = async (url) => {
    const playerData = await getplayerData(url);
    const newUrl = await vaildPlaylists(playerData);
    const result = newUrl ? newUrl : playerData;
    return [
        {
            label: result,
            audioUrl: "",
            videoUrl: result,
        }
    ]
}