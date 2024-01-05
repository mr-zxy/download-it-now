// b 站登录
const puppeteer = require('puppeteer');
const { writeBilibiliCookie, readBilibiliCookie } = require("../../common/storage")

const bilibiliConfig = {
    browser: {
        page: null,
        browser: null
    },
    cookies: readBilibiliCookie()
};

const createBrowser = async (cookies) => {
    const browser = await puppeteer.launch({
        headless: "new",
    });

    const page = await browser.newPage();
    // 存在 cookie 刷新页面
    if (cookies.length) {
        cookies?.forEach(async cookie => {
            await page.setCookie(cookie);
        })
    }
    return { browser, page }
}

const bilibiliLogin = async (url) => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' })

    // 存在 cookie 刷新页面
    if (bilibiliConfig.cookies.length > 0) {
        bilibiliConfig.cookies?.forEach(async cookie => {
            await page.setCookie(cookie);
        })

        await page.reload();
    }

    // await page.evaluate(() => {
    //     // 验证是否登录
    //     if (window.UserStatus?.userInfo?.isLogin === false) {
    //         return false
    //     }
    //     return true
    // })

    page.on('response', async response => {
        if (response.url() === "https://api.bilibili.com/x/web-interface/nav") {
            const text = await response.text()
            const data = JSON.parse(text);
            if (data.data.isLogin) {
                const cookie = await page.cookies();
                writeBilibiliCookie(cookie);
                bilibiliConfig.cookies = cookie;

                // 关闭旧的无头浏览器
                bilibiliConfig.browser.page?.close();
                bilibiliConfig.browser.browser?.close();

                // 创建带有登录的无头浏览器
                bilibiliConfig.browser = await createBrowser(bilibiliConfig.cookies || []);

                // 关闭有头浏览器
                page.close();
                browser.close();
            }
        }
    });

    // 登录时间为60秒
    setTimeout(() => {
        page.close();
        browser.close();
    }, 60 * 1000)
}

(async () => {
    // 返回无头浏览器。
    bilibiliConfig.browser = await createBrowser(bilibiliConfig.cookies)
})();

bilibiliLogin.bilibiliConfig = bilibiliConfig;
module.exports = bilibiliLogin