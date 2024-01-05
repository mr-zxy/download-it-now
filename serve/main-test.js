require("./global");
require("./common");
const TaskQueue = require("./core/task-queue")

process.env.NODE_ENV = "development";

const param = {
    "id": "31ffdbde-f723-7998-7173-9adea64a6b42",
    "website": "https://www.bilibili.com",
    "title": "bilibili",
    "logo": "https://www.bilibili.com/favicon.ico?v=1",
    "analysis": {
        "websiteDefaultDataUrl": "https://www.bilibili.com/",
        "websiteSearchUrl": "https://api.bilibili.com/x/web-interface/search/all/v2?page=1&page_size=50&platform=pc&single_column=0&keyword=",
        "websiteSearchPath": "parser-html/bilibili/movies-search",
        "getDefaultPath": "parser-html/bilibili/movies-default",
        "getMovieDetailPath": "parser-html/bilibili/movies-detail",
        "moviesLoginPath": "parser-html/bilibili/movies-login"
    },
    "hooks": {
        "getRealVideoUrlHook": "hooks/bilibili/generate-url",
        "setRequestHeader": "hooks/bilibili/request-header"
    },
    "videoInfo": {
        "videoByte": 0,
        "audioFormat": "file",
        "name": "【2023王者世冠】12月27日淘汰赛中国成都AG超玩会vs中国南京Hero久竞",
        "episodes": "1080p",
        "url": {
            "pageUrl": "https://www.bilibili.com/video/BV1B64y1J7s6/?spm_id_from=333.1007.tianma.3-3-9.click&vd_source=ca0c65e99a2d3ae3751eab02c8ebb184",
            "label": "1080p_0",
            "audioUrl": "https://cn-xj-cm-02-02.bilivideo.com/upgcxcode/37/08/1391550837/1391550837-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1704270785&gen=playurlv2&os=bcache&oi=1865104298&trid=0000152f37c79d574764a0a5e1d3e0855bcdu&mid=432329331&platform=pc&upsig=48930ff3f5c3ecfef7dbb66532556eed&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&cdnid=61902&bvc=vod&nettype=0&orderid=0,3&buvid=4E3EA7D4-0DCC-56B7-FE1F-A44678DBD1F072531infoc&build=0&f=u_0_0&agrr=1&bw=18351&logo=80000000",
            "videoUrl": 'https://cn-xj-cm-02-02.bilivideo.com/upgcxcode/37/08/1391550837/1391550837-1-100113.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1704270785&gen=playurlv2&os=bcache&oi=1865104298&trid=0000152f37c79d574764a0a5e1d3e0855bcdu&mid=432329331&platform=pc&upsig=3ab6bf033bc77526d90168b580b59965&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&cdnid=61902&bvc=vod&nettype=0&orderid=0,3&buvid=4E3EA7D4-0DCC-56B7-FE1F-A44678DBD1F072531infoc&build=0&f=u_0_0&agrr=1&bw=48433&logo=80000000'
        },
        "headers": {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            "referer": "https://www.bilibili.com/video/BV1B64y1J7s6/?spm_id_from=333.1007.tianma.3-3-9.click&vd_source=ca0c65e99a2d3ae3751eab02c8ebb184"
        }
    }
}

async function main() {
    const taskQueue = new TaskQueue();
    taskQueue.addition(param);
}

main();