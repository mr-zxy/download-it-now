const m3u8Parser = require('m3u8-parser');
const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');
const { radixNum, getDownloadPath } = require("./tool");
const agent = require("./agent")

// 获取文件16进制通过网络
const getHexByNavicat = async (fileUrl) => {
    if (!fileUrl) {
        console.log("链接不能为空！")
        return false;
    }
    return new Promise((resolve, reject) => {
        try {
            fetch(fileUrl, { agent: agent.getFetchAgent() })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    let hex = "";
                    new Uint8Array(arrayBuffer).forEach(v => hex += (radixNum(v, 10, 16).padStart(2, 0)))
                    resolve(hex);
                })

        } catch (err) {
            reject(err);
            return null;
        }
    })
}

// 解密 ts
const generateDencryptTs = (key, iv, param) => {
    const dirPath = getDownloadPath(param);
    const files = fs.readdirSync(dirPath).filter(v => /^\d/.test(v));

    files.forEach(v => {
        const filePath = dirPath + "/" + v;
        const [prefix, suffix] = path.basename(filePath).split(".");

        const newPath = prefix + "_g" + "." + suffix;
        const exec = `openssl aes-128-cbc -d -in ${filePath} -out ${dirPath + "/" + newPath} -iv ${iv} -K ${key}`
        execSync(exec);
        fs.rmSync(filePath);
    })

}

// 获取m3u8加密参数
module.exports = async (manifest = "", param = {}) => {
    if (!manifest) {
        console.log("m3u8内容为空");
        return;
    }

    const parser = new m3u8Parser.Parser();
    parser.push(manifest);
    parser.end();
    const parsedManifest = parser.manifest;

    parsedManifest.segments.length = 1;

    parsedManifest?.segments.forEach((segment) => {
        if (segment.key) {
            let hex = "";
            const iv = segment.key.iv || new Uint32Array(["00000000", "00000000", "00000000", "00000000"]);
            iv.forEach(v => hex += radixNum(v, 10, 16).padStart(8, 0))
            segment.key.ivHex = hex;
        }
    });
  
    const result = parsedManifest.segments[0].key;
    // 没有加密密参数 不需要解密
    if(!result){
        return 
    }

    if (param.hooks.beforeDecryptTsPath) {
        const requireName = param.hooks.beforeDecryptTsPath.replace(/\//g, "_");
        await global.$require[requireName](result, param)
    }

    result.keyHex = await getHexByNavicat(result.uri);

    if (param.hooks.afterDecryptTsPath) {
        const requireName = param.hooks.afterDecryptTsPath.replace(/\//g, "_");
        await global.$require[requireName](result, param)
    }

    generateDencryptTs(result.keyHex, result.ivHex, param)

    return result;
};

// `openssl aes-128-cbc -d -in ./1.ts -out ./0_g_001.ts -iv 27dcb3134d9976e028237d4b9f431da7 -K 4f677032647746736653445a51315a53`