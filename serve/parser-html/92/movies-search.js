const cheerio = require('cheerio');
const got = require("got");
const agent = require("../../tools/agent");
const moviesDefault = require("./movies-default");
/**
 * 搜索
 * @param {*} url 
 * @param {*} website 
 * @returns
 */
module.exports = async (url = "", website = "") => {
    if (!url) { console.log("请填写网站全路径.html"); return }
    if (!website) { console.log("请填写网站路径"); return }
    const response = await got(url,{agent:agent.getGotAgent(),timeout: 5000});
    const $ = cheerio.load(response.body);
    const children = $(".page-list ul li")

    const page = [];
    children.each((_index, item) => {
        page.push($(item).text().trim() * 1)
    });
    
    if(page.length===0){
        page.push(1)
    }

    // const min = Math.min(...page);
    const max = Math.max(...page);
    const list = [];
   
    const results=Array.from(new Array(max)).map(async (_v, index) => {
        const newUrl = url.replace(/\@/g, index);
        const result = await moviesDefault(newUrl, website);
        return result
    })
    const result=await Promise.all(results);
    result.forEach(v=>list.push(...v));

    return list
}
