module.exports = [
    {
        id: "31ffdbde-f723-7998-7173-9adea64a6b42",
        website: "https://www.bilibili.com",
        title: "bilibili",
        logo: "https://www.bilibili.com/favicon.ico?v=1",
        analysis: {
            websiteDefaultDataUrl: "https://www.bilibili.com/", // 主页面路径
            websiteSearchUrl: "https://api.bilibili.com/x/web-interface/search/all/v2?page=1&page_size=50&platform=pc&single_column=0&keyword=", // 搜索路径
            websiteSearchPath: "parser-html/bilibili/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/bilibili/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/bilibili/movies-detail", // 详情搜索方法
            moviesLoginPath: "parser-html/bilibili/movies-login", // 登录方法路径
        },
        hooks: {
            getRealVideoUrlHook: "hooks/bilibili/generate-url", // 获取真实的 视频地址。方法。
            beforeRequestInterceptor: "hooks/bilibili/before-request", // 请求前拦截器
        },
        videoInfo: {
            videoByte: 0,
            audioFormat: "file", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "referer": ""
            } // 请求头
        }
    },
    {
        id: "707aa375-17da-4871-b675-f01a37c27cef",
        website: "https://www.anfuns.cc",
        title: "anfuns",
        logo: "https://bj.bcebos.com/baidu-rmb-video-cover-1/8ff4a69e0bbbd5bb5d9cc2c0f8ddb37f.png",
        analysis: {
            websiteDefaultDataUrl: "https://www.anfuns.cc/label/rankweek.html", // 主页面路径
            websiteSearchUrl: "https://www.anfuns.cc/search.html?wd=", // 搜索路径
            websiteSearchPath: "parser-html/anfuns/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/anfuns/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/anfuns/movies-detail", // 详情搜索方法
        },
        hooks: {
            getRealVideoUrlHook: "hooks/anfuns/generate-url", // 获取真实的 视频地址。方法。
        },
        videoInfo: {
            audioFormat: "m3u8", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {} // 请求头
        }
    },
    {
        id: "0fa35caa-4406-4fd6-a895-4527a78ce8c1",
        website: "https://www.92gyw.com",
        title: "92工业网",
        logo: "https://www.92gyw.com/favicon.ico",
        analysis: {
            websiteDefaultDataUrl: "https://www.92gyw.com/shortVideo/list?pn=0", // 主页面路径
            websiteSearchUrl: "https://www.92gyw.com/shortVideo/list?pn=@&keywords=", // 搜索路径
            websiteSearchPath: "parser-html/92/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/92/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/92/movies-detail", // 详情方法
        },
        hooks: {
            getRealVideoUrlHook: "hooks/92/generate-url", // 获取真实的 视频地址。方法。
            afterDecryptTsPath: "hooks/92/after-key-decrypt", // 自定义 解密ts
        },
        videoInfo: {
            audioFormat: "m3u8", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {} // 请求头
        }
    },
    {
        id: "c6ee6471-d188-42f2-b24a-5e960ae23135",
        website: "https://www.ppxdm.com/",
        title: "ppxdm",
        logo: "https://www.ppxdm.com/template/yinghuadm/image/favicon.ico",
        analysis: {
            websiteDefaultDataUrl: "https://www.ppxdm.com/label/week.html", // 主页面路径
            websiteSearchUrl: "https://www.ppxdm.com/search/-------------.html?wd=", // 搜索路径
            websiteSearchPath: "parser-html/ppxdm/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/ppxdm/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/ppxdm/movies-detail", // 详情搜索方法
        },
        hooks: {
            getRealVideoUrlHook: "hooks/ppxdm/generate-url", // 获取真实的 视频地址。方法。
            beforeDecryptTsPath: "hooks/ppxdm/before-key-decrypt", // 自定义 解密ts
        },
        videoInfo: {
            audioFormat: "m3u8", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {
                'authority': 'm3u814.shenyum3u8.top',
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'origin': 'https://plays.hddm.cc',
                'referer': 'https://plays.hddm.cc/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 Edg/120.0.0.0',
            }
        }
    },
    {
        id: "8d5f0e9f-abdd-fc9b-ab9b-63989cb1bb15",
        website: "https://www.freeok.vip/",
        title: "freeok",
        logo: "https://www.freeok.vip/mxtheme/images/favicon.png",
        analysis: {
            websiteDefaultDataUrl: "https://www.freeok.vip/", // 主页面路径
            websiteSearchUrl: "https://www.freeok.vip/v-so/-------------.html?wd=", // 搜索路径
            websiteSearchPath: "parser-html/freeok/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/freeok/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/freeok/movies-detail", // 详情搜索方法
        },
        hooks: {
            beforeRequestInterceptor: "hooks/freeok/before-request", // 请求前拦截器
            getRealVideoUrlHook: "hooks/freeok/generate-url", // 获取真实的 视频地址。方法。
            tsSectionSupplement: "hooks/freeok/ts-section-supplement", // ts 切片路径补充/修改
        },
        videoInfo: {
            audioFormat: "m3u8", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {} // 请求头
        }
    },
    {
        id: "33a1e711-2d8e-4774-a9c0-2b125e70e8f7",
        website: "https://www.suoshen.cc/",
        title: "美剧网",
        logo: "https://static.028hkxx.com/static/images/m8/search.png",
        analysis: {
            websiteDefaultDataUrl: "https://www.suoshen.cc/", // 主页面路径
            websiteSearchUrl: "https://www.suoshen.cc/se-54caq/", // 搜索路径
            websiteSearchPath: "parser-html/suoshen/movies-search", // 搜索 方法
            getDefaultPath: "parser-html/suoshen/movies-default",   // 主页面，初始化，方法。
            getMovieDetailPath: "parser-html/suoshen/movies-detail", // 详情搜索方法
        },
        hooks: {
            getRealVideoUrlHook: "hooks/suoshen/generate-url", // 获取真实的 视频地址。方法。
            tsSectionSupplement: "hooks/suoshen/ts-section-supplement", // ts 切片路径补充/修改
        },
        videoInfo: {
            audioFormat: "m3u8", // 视频格式
            name: "",  // 名称
            episodes: "", // 集数
            url: { label: "", audioUrl: "", videoUrl: "" }, // 视频地址
            headers: {} // 请求头
        }
    },
]