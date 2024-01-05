require("./logger");
require("./storage");

// 不会打包子线程
(() => {
    Object.assign(global.$require, {
        // bilibili
        "parser-html_bilibili_movies-search": require("../parser-html/bilibili/movies-search"),
        "parser-html_bilibili_movies-default": require("../parser-html/bilibili/movies-default"),
        "parser-html_bilibili_movies-detail": require("../parser-html/bilibili/movies-detail"),
        "parser-html_bilibili_movies-login": require("../parser-html/bilibili/movies-login"),

        "hooks_bilibili_generate-url": require("../hooks/bilibili/generate-url"),
        "hooks_bilibili_before-request": require("../hooks/bilibili/before-request"),

        // anfuns
        "parser-html_anfuns_movies-search": require("../parser-html/anfuns/movies-search"),
        "parser-html_anfuns_movies-default": require("../parser-html/anfuns/movies-default"),
        "parser-html_anfuns_movies-detail": require("../parser-html/anfuns/movies-detail"),

        "hooks_anfuns_generate-url": require("../hooks/anfuns/generate-url"),

        // 92
        "parser-html_92_movies-search": require("../parser-html/92/movies-search"),
        "parser-html_92_movies-default": require("../parser-html/92/movies-default"),
        "parser-html_92_movies-detail": require("../parser-html/92/movies-detail"),

        "hooks_92_generate-url": require("../hooks/92/generate-url"),

        // ppxdm
        "parser-html_ppxdm_movies-search": require("../parser-html/ppxdm/movies-search"),
        "parser-html_ppxdm_movies-default": require("../parser-html/ppxdm/movies-default"),
        "parser-html_ppxdm_movies-detail": require("../parser-html/ppxdm/movies-detail"),

        "hooks_ppxdm_generate-url": require("../hooks/ppxdm/generate-url"),

        // freeok 
        "parser-html_freeok_movies-search": require("../parser-html/freeok/movies-search"),
        "parser-html_freeok_movies-default": require("../parser-html/freeok/movies-default"),
        "parser-html_freeok_movies-detail": require("../parser-html/freeok/movies-detail"),

        "hooks_freeok_generate-url": require("../hooks/freeok/generate-url"),
        "hooks_freeok_before-request": require("../hooks/freeok/before-request"),
        "hooks_freeok_ts-section-supplement": require("../hooks/freeok/ts-section-supplement"),

        // suoshen 
        "parser-html_suoshen_movies-search": require("../parser-html/suoshen/movies-search"),
        "parser-html_suoshen_movies-default": require("../parser-html/suoshen/movies-default"),
        "parser-html_suoshen_movies-detail": require("../parser-html/suoshen/movies-detail"),

        "hooks_suoshen_generate-url": require("../hooks/suoshen/generate-url"),
        "hooks_suoshen_ts-section-supplement": require("../hooks/suoshen/ts-section-supplement"),
    })
})()