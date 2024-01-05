module.exports = async (keys, param = {}) => {
  const { ivHex, keyHex, method, uri } = keys;
  const url = param.videoInfo.url.videoUrl;
  keys.uri=url.replace("index.m3u8", "enc.key");
}