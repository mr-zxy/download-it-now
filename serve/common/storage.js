const fs = require("fs");
const path = require("path");

if (!fs.existsSync(`${global.$config.storagePath}`)) fs.mkdirSync(`${global.$config.storagePath}`);

// b站cookie储存
const BilibiliCookieFileName = "bilibili_cookies.json";

exports.writeBilibiliCookie = (cookies = []) => {
    if (Array.isArray(cookies)) {
        fs.writeFileSync(path.join(global.$config.storagePath, BilibiliCookieFileName), JSON.stringify(cookies))
    }
}

exports.readBilibiliCookie = () => {
    try {
        const data = fs.readFileSync(path.join(global.$config.storagePath, BilibiliCookieFileName), "utf-8");
        return JSON.parse(data)
    } catch (e) {
        return []
    }
}