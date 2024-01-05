require("../global/global");

const agent = require("../tools/agent");
const fetch = require('node-fetch');


(async () => {
    try {
        const agentHttp = agent.getGotAgent()
        const data = await agent.checkAgent(agentHttp);
    } catch (error) {
    }
})();

(async () => {
    try {
        fetch(global.$config.checkAgentUrl, {
            agent: agent.getFetchAgent()
        })
            .then(async (response) => {
                console.log(await response.json());
            })
            .catch((error) => {
                console.error(error);
            });

    } catch (error) {

    }
})();