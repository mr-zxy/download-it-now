const { execSync } = require('child_process');

// 验证 openssl
exports.checkOpenssl = () => {
    try {
        execSync('openssl version');
        return true
    } catch (e) {
        return false
    }
};

// 验证 ffmpeg
exports.checkFfmpeg = () => {
    try {
        execSync('ffmpeg -version');
        return true
    } catch (e) {
        return false
    }
};