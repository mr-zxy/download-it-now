var a=`var player_aaaa={"flag":"play","encrypt":2,"trysee":0,"points":0,"link":"\/play\/1826-1-1.html","link_next":"\/play\/1826-1-2.html","link_pre":"","vod_data":{"vod_name":"\u5492\u672f\u56de\u6218 \u7b2c\u4e8c\u5b63","vod_actor":"\u4e2d\u6751\u60a0\u4e00,\u6a31\u4e95\u5b5d\u5b8f,\u8fdc\u85e4\u7eeb,\u6c38\u6fd1\u5b89\u5a1c,\u5b50\u5b89\u6b66\u4eba","vod_director":"\u5fa1\u6240\u56ed\u7fd4\u592a","vod_class":"\u5947\u5e7b,\u70ed\u8840,\u6218\u6597,\u6f2b\u753b\u6539"},"url":"JTY4JTc0JTc0JTcwJTczJTNBJTJGJTJGJTZEJTY1JTY0JTY5JTYxJTJEJTZGJTczJTczJTJFJTcwJTZDJTYxJTczJTc0JTY5JTYzJTZEJTY1JTZEJTZGJTcyJTc5JTJFJTZFJTY1JTc0JTJGJTZEJTMzJTc1JTM4JTJGJTMxJTM3JTMwJTMxJTM1JTMxJTMyJTM2JTMyJTM1JTM4JTM3JTMxJTJFJTZEJTMzJTc1JTM4","url_next":"JTY4JTc0JTc0JTcwJTczJTNBJTJGJTJGJTZEJTY1JTY0JTY5JTYxJTJEJTZGJTczJTczJTJFJTcwJTZDJTYxJTczJTc0JTY5JTYzJTZEJTY1JTZEJTZGJTcyJTc5JTJFJTZFJTY1JTc0JTJGJTZEJTMzJTc1JTM4JTJGJTMxJTM3JTMwJTMxJTM1JTMxJTMyJTM5JTMwJTM2JTM0JTM1JTM0JTJFJTZEJTMzJTc1JTM4","from":"ckplayer","server":"no","note":"","id":"1826","sid":1,"nid":1}`;


var jsonRegex = /var player_aaaa=/;  
a=a.replace(jsonRegex,"")  
console.log(JSON.parse(a)); // 输出提取的JSON对象

const numCPUs = require('os').cpus().length;
console.log(numCPUs)

