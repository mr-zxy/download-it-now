const got = require("got");
const HttpsProxyAgent = require("https-proxy-agent");

// http 代理
const agent = {
    checkAgent: async () => {
        try {
            const response = await got(global.$config.checkAgentUrl, {
                agent: agent.getGotAgent()
            });
            return JSON.parse(response.body) || {};
        } catch (error) {
            console.log(error.response);
        }
    },

    getGotAgent: () => {
        const agent = {};
        if (global.$config.httpsAgent) {
            agent.https = new HttpsProxyAgent(global.$config.httpsAgent)
        }
        return agent
    },

    getFetchAgent: () => {
        if (global.$config.httpsAgent) {
            return new HttpsProxyAgent(global.$config.httpsAgent)
        }
        return ""
    },

    setHttpsProxy: (host) => {
        global.$config.httpsAgent = host;
    }
}

module.exports = agent;