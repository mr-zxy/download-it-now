const config = require("../config");

// 全局导入 hooks，子线程会打包这个文件。
global.$require = {
    // bilibili

    // anfuns
    
    // 92
    "hooks_92_after-key-decrypt": require("../hooks/92/after-key-decrypt"),

    // ppxdm
    "hooks_ppxdm_before-key-decrypt": require("../hooks/ppxdm/before-key-decrypt"),

    // freeok 

    // suoshen
};
// 配置
global.$config = config;