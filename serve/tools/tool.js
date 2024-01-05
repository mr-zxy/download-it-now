const path = require("path");
/**
 * @params {num,m,n}
 *	num: 转换进制的数值
 *	m: M进制 →
 *	n: N进制 ←
 */
exports.radixNum = (num, m, n) => {
    num = typeof num === "string" ? num : String(num);
    const _DEFAULT_ = {
        initNum: 10,
    };
    // 处理 m,n为0时转成10
    m = m === 0 ? _DEFAULT_.initNum : m;
    n = n === 0 ? _DEFAULT_.initNum : n;
    // 处理第三个参数n不传时, 转成10
    n = m && !n ? _DEFAULT_.initNum : n;
    // 判断radix区间
    let result = parseInt(num, m).toString(n);
    if (typeof result !== "string" && isNaN(result)) {
        return null;
    }
    return result;
};

/**
 * 验证是否是 http https
 * @param {*} url 
 * @returns 
 */
exports.isValidUrl = (url) => {
    const pattern = /^(https?:\/\/)/;
    return pattern.test(url);
}

/**
 * 验证是否有域名
 */
exports.isValidDomain = (link) => {
    // 正则表达式匹配域名  
    const domainRegex = /\.(?:[a-z]{2,}(?:\-(?:[a-z]{2}|xn--[a-z0-9]{4})){0,})$/i;
    return domainRegex.test(link);
}

/**
 * 本地文件转换16进制
 * @param {*} path 
 * @returns 
 */
exports.getFileHex = (path = './encrypt.key') => {
    const data = fs.readFileSync(path);
    const hex = data.toString('hex');
    return hex
}

/**
 * 延迟
 * @param {*} millisecond 
 */
exports.sleep = (millisecond = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}

/**
 * 获取根路径
 */
exports.getBasePath = () => {
    const dirPath = global.$config.basePath;
    return dirPath
}

/**
 * 获取下载文件存放地址
 */
exports.getDownPath = () => {
    const dirPath = global.$config.downloadPath;
    return dirPath
}

/**
 * 获取 download 文件下载位置
 */
exports.getDownloadPath = (param) => {
    const dirPath = path.join(global.$config.downloadPath, param.title, param.videoInfo.name, param.videoInfo.episodes);
    return dirPath;
}

// 过滤特殊字符 符号
exports.filterString = (input) => {
    // 去除空格  
    let result = input.replace(/\s+/g, '');
    // 去除括号  
    result = result.replace(/[\(\)]/g, '');
    // 去除空值  
    result = result.replace(/^\s*|\s*$/g, '');
    // 去除 #
    result = result.replace(/#/g, '');
    // 去除 ！
    result = result.replace(/！/g, '');
    return result;
}

// 尺寸转换
exports.sizeConvert = (size = 0) => {
    return {
        B: size + "B",
        KB: (size / 1024).toFixed(2) + "KB",
        MB: (size / (1024 * 1024)).toFixed(2) + "MB",
        GB: (size / (1024 * 1024 * 1024)).toFixed(2) + "GB",
    }
}

// 范围随机数
exports.randomNumber = (min = 1, max = 3) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 获取url 后缀
exports.getUrlSuffix = (url) => {
    var parts = url.split('/');
    var suffix = parts.pop();
    return suffix;
}

// object递归 清除function
exports.clearNonFunction = (obj = {}) => {
    // 如果输入不是对象，直接返回  
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    // 循环遍历对象的所有属性  
    for (let key in obj) {
        if (obj[key] instanceof Function) {
            obj[key] = '';
        }

        if (obj[key] instanceof Object) {
            exports.clearNonFunction(obj[key]);
            continue
        }
    }

    return obj;
}