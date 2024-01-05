// 解密 解密路径 /video/m3u8/*.ts
const { getM3u8ByPath, m3u8Parser } = require("../../tools/m3u8-url");
const getM3u8DecryptParam = require("../../tools/m3u8-decrypt");
const { Prefix, Generate_M3u8_Name } = require("./encryp");
const { execSync } = require('child_process');

const Generate_M3u8_Decrypt_Name = "/m3u8-decrypt";
const Part_M3u8 = "/part.m3u8";

// 生成解密的 .ts
const generateDencryptTs = (list, { ivHex, keyHex }) => {
    list.forEach(v => {
        const exec = `openssl aes-128-cbc -d -in ${Prefix + Generate_M3u8_Name + "/" + v.uri} -out ${Prefix + Generate_M3u8_Decrypt_Name + "/" + v.uri} -iv ${ivHex} -K ${keyHex}`
        execSync(exec);
    });
    console.log(`解密完成：输出路径为：${Prefix + Generate_M3u8_Decrypt_Name}/.ts`)
}

(async () => {
    const manifest = await getM3u8ByPath(Prefix + Generate_M3u8_Name + Part_M3u8);
    const parserList = await m3u8Parser(manifest)
    console.log("解密路径：" + Prefix + Generate_M3u8_Name + "/*.ts");
    const { ivHex, keyHex } = await getM3u8DecryptParam(manifest);
    generateDencryptTs(parserList, { ivHex, keyHex });
})()