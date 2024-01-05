//  m3u8 解析url

const got = require("got");
const fs = require('fs');
const m3u8Parser = require('m3u8-parser');

// 获取m3u8数据 通过url
exports.getM3u8ByUrl = async (url = "", headers = {}) => {
    if (!url) {
        console.log("请填写url！");
        return;
    }
    try {
        const response = await got(url, { headers });
        const manifest = response?.body || null;
        return manifest
    } catch (e) {
        console.log(e)
        return null
    }
}

// 获取m3u8数据 通过文件
exports.getM3u8ByPath = async (path = "") => {
    if (!path) {
        console.log("路径不能为空！");
        return;
    }
    try {
        return fs.readFileSync(path, 'utf-8') || null;  // 读取 m3u8 文件内容  
    } catch (e) {
        return null
    }
}

// 解析m3u8
exports.m3u8Parser = async (manifest = "") => {
    if (!manifest) {
        console.log("m3u8内容为空");
        return;
    }
    try {
        const parser = new m3u8Parser.Parser();
        parser.push(manifest);
        parser.end();
        const parsedManifest = parser.manifest;
        return parsedManifest?.segments || []
    } catch (e) {
        return []
    }
}