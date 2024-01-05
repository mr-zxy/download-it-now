// 自动生成 加密的 m3u8
const { execSync } = require('child_process');
const path = require('path');
const fs = require("fs");
const { checkOpenssl } = require("../../tools/check");
const server = require("./video/serve");

const Prefix = path.resolve(__dirname, "./video");
const Encrypt_Key = "/encrypt.key";
const Video_Keyinfo = "/video.keyinfo";
const Video_Name = "/input.mp4";
const Generate_M3u8_Name = "/m3u8-encryp"

exports.Prefix=Prefix;
exports.Generate_M3u8_Name=Generate_M3u8_Name;

const Port = 65000
const Host_Port = `http://localhost:${Port}`;

// 生成加密 key
const generateEncrypt = () => {
    try {
        execSync('openssl rand 16 > ' + Prefix + Encrypt_Key);
        return true
    } catch (e) {
        return false
    }
}

// 加密 iv
const generateIv = () => {
    try {
        const hex = execSync('openssl rand -hex 16');
        return hex
    } catch (e) {
        return ""
    }
}

// 生成 加密的 .keyinfo
const generateVideoKeyinfo = () => {
    const encrypt = Host_Port + Encrypt_Key;
    const absolutePath = Prefix + Encrypt_Key
    const ivBuffer = generateIv();
    const iv = ivBuffer.toString();

    const connect = [
        encrypt,
        absolutePath,
        iv
    ]
    fs.writeFileSync(`${Prefix}${Video_Keyinfo}`, connect.join('\n'))
}

// 生成加密ts
const generateEncrypTs = () => {
    const exec = `ffmpeg -y -i ${Prefix + Video_Name} -c:v libx264 -c:a copy -f hls -hls_time 5 -hls_list_size 0 -hls_key_info_file ${Prefix + Video_Keyinfo} -hls_playlist_type vod -hls_segment_filename ${Prefix + Generate_M3u8_Name}/part%d.ts ${Prefix + Generate_M3u8_Name}/part.m3u8`
    execSync(exec);
}

// 开启本地服务 生成预览文件
const runServer = () => {
    server(Port,Generate_M3u8_Name)
}

// 初始化 删除以前生成的
const initRemove = () => {
    if (fs.existsSync(Prefix + Encrypt_Key)) fs.rmSync(Prefix + Encrypt_Key);
    if (fs.existsSync(Prefix + Video_Keyinfo)) fs.rmSync(Prefix + Video_Keyinfo);

    // 删除 m3u8 残留文件
    const files = fs.readdirSync(Prefix + Generate_M3u8_Name);
    files.forEach(v => {
        if (/part/.test(v)) {
            const path = Prefix + Generate_M3u8_Name + "/" + v;
            if (path) fs.rmSync(path);
        }
    })
};

(async () => {
    const openssl = checkOpenssl();
    if (!openssl) {
        console.log("请先安装openssl")
        return false;
    };
    initRemove();
    generateEncrypt();
    generateVideoKeyinfo();
    generateEncrypTs();
    runServer();
})();