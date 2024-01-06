require("../global");
require("../common/logger");
const stream = require('stream');
const { promisify } = require('util');
const got = require('got');
const fs = require("fs");
const MovieM3u8Initialization = require("../initialization/movie-m3u8-initialization");
const MovieUniversalInitialization = require("../initialization/movie-universal-initialization");
const agent = require("../tools/agent")
const { downloadExistsCreateFolder } = require("../tools/fs-tool");
const path = require("path");

const pipeline = promisify(stream.pipeline);

async function downloadRange(data, param) {
    return new Promise((resolve, reject) => {
        let timer = null;
        try {
            const name = data.name;
            const url = data.url;
            const startByte = data.startByte;
            const endByte = data.endByte;
            const downloadPath = data.downloadPath;
            const timeout = data.timeout;

            const headers = param.videoInfo.headers || {};
            headers.range = `bytes=${startByte}-${endByte}`
            const stream = got.stream(url, {
                headers: headers,
                agent: agent.getGotAgent(),
                timeout
            }).on("error", (err) => {
                reject(err);
            });

            const outputPath = path.join(downloadPath, param.title, param.videoInfo.name, param.videoInfo.episodes, name)
            const outputStream = fs.createWriteStream(outputPath);
            stream.pipe(outputStream);

            outputStream.on('finish', () => {
                resolve();
            });

            outputStream.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        } finally {
            clearTimeout(timer)
        }
    });
}

async function universalRunDownload(data) {
    const param = JSON.parse(data.param);
    const downloadPath = data.downloadPath;
    const uuid = data.uuid;
    const index = data.index;

    downloadExistsCreateFolder(downloadPath, param);

    try {
        await downloadRange(data, param)
        process.send({ type: "success", index: index, uuid });
    } catch (e) {
        process.send({ type: "error", index: index, uuid });
    } finally {
        process.send({ type: "exit", index: index, uuid });
    }
}

async function m3u8RunDownload(data) {

    const param = JSON.parse(data.param);
    const uuid = data.uuid;
    const url = data.url;
    const index = data.index;
    const timeout = data.timeout;
    const downloadPath = data.downloadPath;

    const urlSplit = url.split("/");
    const name = index + "_" + (urlSplit[urlSplit.length - 1].replace(/\?|\&/g, ""));
    downloadExistsCreateFolder(downloadPath, param);

    const outputPath = path.join(downloadPath, param.title, param.videoInfo.name, param.videoInfo.episodes, name);

    try {
        await pipeline(
            got.stream(url, { headers: param.videoInfo.headers || {}, agent: agent.getGotAgent(), timeout }),
            fs.createWriteStream(outputPath)
        );
        process.send({ type: "success", index: index, uuid });
    } catch (e) {
        process.send({ type: "error", index: index, uuid });
    } finally {
        process.send({ type: "exit", index: index, uuid });
    }
}

async function universaSynthesis(data) {
    try {
        process.send({ type: "synthesisStart" });
        const param = JSON.parse(data.param);
        await MovieUniversalInitialization.synthesisSection(param);
    } catch (e) {
        console.log(e);
    } finally {
        process.send({ type: "synthesisEnd" });
        process.exit();
    }
}

async function m3u8Synthesis(data) {
    try {
        process.send({ type: "synthesisStart" });
        const param = JSON.parse(data.param);
        const m3u8Text = data.m3u8Text;
        await MovieM3u8Initialization.synthesisSection(param, m3u8Text);
    } catch (e) {
        console.log(e);
    } finally {
        process.send({ type: "synthesisEnd" });
        process.exit();
    }
}

process.on("message", (data) => {
    const type = data.type;

    // 通用 下载
    if (type === "universal_download") {
        universalRunDownload(data);
    }

    // m3u8 下载
    if (type === "m3u8_download") {
        m3u8RunDownload(data);
    }

    // 通用 合成
    if (type === "universa_synthesis") {
        universaSynthesis(data);
    }

    // m3u8 合成
    if (type === "m3u8_synthesis") {
        m3u8Synthesis(data);
    }
})