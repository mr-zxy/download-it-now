const puppeteer = require('puppeteer');

// 缓存cookie; 
let cacheCookies = [];

// 解析html
const parserHtml = async (page, website) => {
    await page.waitForSelector("body > div.page.list > div.main > div > div > div.module-main.module-page > div.module-items.module-card-items .module-item");
    const contentList = await page.evaluate(({ website }) => {
        const _elements = document.querySelectorAll("body > div.page.list > div.main > div > div > div.module-main.module-page > div.module-items.module-card-items .module-item");
        const elements = Array.from(_elements);
        const list = elements.map(element => {
            const pic = element.querySelector("img").getAttribute("data-original");
            const href = website + element.querySelector("a").getAttribute("href");
            const title = element.querySelector(".module-card-item-title").innerText;
            const describe = "";
            const score = "";
            const renew = element.querySelector(".module-item-note").innerText;

            return { pic, href, title, describe, score, renew };
        })

        return list;
    }, { website });

    return contentList
}

// 验证码
const parserCode = async (page) => {
    await page.waitForSelector("body > div > div.form > div.item1 > input[type=text]");
}

// 手动解析
const handMovementParser = async (url, website, headless = false) => {
    try {
        let timer = [];
        return new Promise(async (resolve) => {
            const browser = await puppeteer.launch({
                headless: headless ? "env" : false,
            });

            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'networkidle0' })
            if (Array.isArray(cacheCookies) && cacheCookies.length > 0) {
                cacheCookies.forEach(async cookie => {
                    await page.setCookie(cookie);
                })

                await page.evaluate(() => {
                    setTimeout(() => {
                        location.reload();
                    }, 3000)
                })

            }

            const isCache = Array.isArray(cacheCookies) && cacheCookies.length > 0 && headless === true;
            timer[timer.length] = setTimeout(async () => {
                await parserCode(page);

                timer.forEach(time => clearTimeout(time));

                if (isCache === false) return;
                resolve({ list: [], page, browser, flag: false })
            }, isCache ? 50000 : 0)

            timer[timer.length] = setTimeout(async () => {
                const list = await parserHtml(page, website);

                const cookies = await page.cookies();
                cacheCookies = cookies;

                timer.forEach(time => clearTimeout(time));
                resolve({ list, page, browser, flag: true })
            }, 0);
        })
    } catch (e) {
        cacheCookies = [];
        return false
    }
}


/**
 * 搜索
 * @param {*} url 
 * @param {*} website 
 * @returns
 */

module.exports = async (url = "", website = "") => {
    try {
        const isCache = Array.isArray(cacheCookies) && cacheCookies.length > 0;
        const { list, page, browser, _flag } = await handMovementParser(url, website, isCache ? true : false);

        await page.close();
        await browser.close();

        return list

    } catch (e) {
        console.log("err")
        return []
    }
};