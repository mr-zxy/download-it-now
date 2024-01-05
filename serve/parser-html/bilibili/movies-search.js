
const got = require("got");
const puppeteer = require('puppeteer');
const agent = require("../../tools/agent");
const { isValidUrl } = require("../../tools/tool");

let cacheCookies = [];
/**
 * 搜索
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (cacheCookies.length === 0) {
        const browser = await puppeteer.launch({
            headless: "new",
        });

        const page = await browser.newPage();
        await page.goto(website, { waitUntil: 'networkidle0' })
        const cookies = await page.cookies();
        cacheCookies = cookies;
        browser.close();
    }

    try {
        const cookieStr = cacheCookies.reduce((pre, cur) => {
            return pre += `${cur.name}=${cur.value};`
        }, "")

        const fetchUrl = (url + "&preload=true").replace(/\s+/g, "");
        const headers = {
            'cookie': cookieStr
        };
        
        const response = await got(fetchUrl, { headers, agent: agent.getGotAgent(), timeout: 5000 });
        const data = JSON.parse(response.body);
        const videos = data.data.result.find(v => v.result_type === "video")
        return videos.data.map(info => {
            return {
                pic: isValidUrl(info.pic) ? info.pic : "https:" + info.pic,
                href: info.arcurl,
                title: info.author,
                describe: info.title,
                score: info.video_review,
                renew: "时长：" + info.duration
            }
        })
    } catch (e) {
        cacheCookies = [];
        return []
    }

};