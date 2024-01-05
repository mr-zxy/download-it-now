const fetch = require('node-fetch');
const agent = require("../../tools/agent");
const { radixNum } = require("../../tools/tool");

// 92 工业网 获取真实的key
const getRealKey = async (url = "") => {
  return new Promise((resolve, reject) => {
    fetch(url, { agent: agent.getFetchAgent() })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        // 在这里处理ArrayBuffer数据  
        const y = arrayBuffer;
        const $ = new DataView(y);
        // 补充：位置：<div id="app-key" data-keys="3854078970,2917115795,3887476043,3350876132"></div>
        var z = {};
        z._revise = [3854078970, 2917115795, 3887476043, 3350876132]
        if (z._revise) {
          // 位置：https://www.92gyw.com/statics/vite/assets/play-utils-508447cf.js
          const b = z._revise;
          $.setInt32(0, $.getInt32(0) ^ b[0]),
            $.setInt32(4, $.getInt32(4) ^ b[1]),
            $.setInt32(8, $.getInt32(8) ^ b[2]),
            $.setInt32(12, $.getInt32(12) ^ b[3]),
            resolve(new Int8Array($.buffer))
        }
      })
      .catch(error => {
        reject(error)
      });
  })
};

module.exports = async (keys, param = {}) => {
  const { ivHex, keyHex, method, uri } = keys;
  const realKeyIntArray = await getRealKey(uri, { agent: agent.getGotAgent() })
  let hex = "";
  realKeyIntArray.forEach(v => hex += radixNum(v, 10, 16).padStart(2, 0))
  keys.keyHex = hex;
}