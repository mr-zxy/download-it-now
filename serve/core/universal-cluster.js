const childFork = require('child_process').fork;
const path = require('path');
const numCPUs = require('os').cpus().length;
const uuid = require("uuid");
const { getDownPath } = require("../tools/tool");
const { MAIN_STATUS } = require("../constants");

const RequestTimeout = {
    0: 10000,
    1: 20000,
    2: 30000,
}

// 失败了 几次之后暂停
const suspendErrorNumber = 3;

const Status = {
    NotStarted: "not_started", // 未开始
    InProgress: "in_progress",// 进行中
    Completed: "completed", // 已完成
}

const downloadPath = getDownPath()

class Cluster {
    constructor(rangeList = [], param = {}, callback = null) {
        this.suspendSwitch = false;  // 暂停开关
        this.param = param;
        this.rangeList = this.rangesInit(rangeList);
        this.progres = 0;
        this.statusCode = 10013;
        this.callback = callback;
        this.workers = []; // 子进程
        this.proxyStatus();
    }

    rangesInit(ranges) {
        // downList.length = 1;
        ranges.forEach((v, index) => {
            v.index = index;
            v.timeout = RequestTimeout[0];
            v.status = Status.NotStarted;
            v.errorNumber = 0;
            v.size = 0;
        });
        return ranges;
    }

    /**
     * 监听状态 日志收集
     */
    proxyStatus() {
        Object.defineProperties(this, {
            'statusCode': {
                value: true,
                writable: true,
                enumerable: true,
                configurable: true
            },
            'statusCode': {
                get: function () {
                    return this._statusCode;
                },
                set: function (value) {
                    const { title, videoInfo } = this.param;
                    const numWorkers = this.workers.length;
                    console.log(`${title}：${videoInfo.name}：${videoInfo.episodes}：${videoInfo.url.audioUrl}：${MAIN_STATUS[value]}：线程数量：${numWorkers}`)
                    this._statusCode = value;
                }
            }
        });
    }

    /**
     * 消息监听
     */
    clusterHandle(child) {

        child.on('exit', (message) => {

        });

        child.on('message', (message) => {
            const { type, index, uuid } = message;
            const downList = this.rangeList;
            const param = this.param;

            if (type === "error") {
                const second = RequestTimeout[downList[index].errorNumber]

                if (second) {
                    downList[index].timeout = second
                };
                // console.log("失败次数", downList[index].errorNumber, suspendErrorNumber)
                if (downList[index].errorNumber >= suspendErrorNumber) {
                    this.suspendCluster();
                    this.statusCode = 10012;
                }

                downList[index].errorNumber += 1;
                downList[index].status = Status.NotStarted;
            }

            if (type === "success") {
                downList[index].status = Status.Completed
            }

            if (type === "exit") {

                const progres = this.progressFn();
                this.progres = progres;

                if (process.env.NODE_ENV === "development") {
                    console.log(`当前线程：${this.workers.length}，当前完成进度：${param.videoInfo.name}第${param.videoInfo.episodes}集：${progres}%`)
                }

                const workIndex = this.workers.findIndex(v => v?.id === uuid);
                this.workers.splice(workIndex, 1)[0]?.kill("SIGTERM");

                if (this.workers.length === 0) {
                    this.statusCode = 10015;
                    this.progres = 100;
                    if (this.callback) {
                        this.callback();
                        this.callback = null;
                    }
                    return
                }

                this.fork()
            }
        });
    }

    /**
     * 进度条
     * @returns 
     */
    progressFn() {
        const downList = this.rangeList;
        const startLen = downList.filter(v => v.status === Status.Completed).length;
        return (startLen / downList.length * 100).toFixed(2)
    }

    /**
     * 分发器
     * @param {*} worker 
     * @returns 
     */
    fork() {
        const downList = this.rangeList;

        if (this.suspendSwitch) {
            this.statusCode = 10011;
            return
        }

        const data = downList.find((v) => {
            if (v.status === Status.NotStarted) {
                v.status = Status.InProgress
                return v
            }
            return null
        });

        if (!data) return;

        const worker = childFork(
            process.env.NODE_ENV === "production" ? path.join(process.resourcesPath, 'app.asar.unpacked/core/section-download.js') : path.resolve(__dirname, "./section-download.js")
        );
        worker.id = uuid.v1()
        this.clusterHandle(worker);
        this.workers[this.workers.length] = worker;

        const { videoInfo } = this.param;
        if (videoInfo.audioFormat === "m3u8") {
            this.m3u8Fork(worker, data)
        } else {
            this.universalFork(worker, data)
        }
    }

    universalFork(worker, data) {
        worker.send(
            {
                type: "universal_download",
                uuid: worker.id,
                name: data.name,
                url: data.url,
                index: data.index,
                timeout: data.timeout,
                startByte: data.startByte,
                endByte: data.endByte,
                downloadPath: downloadPath,
                param: JSON.stringify(this.param)
            }
        );
    }

    m3u8Fork(worker, data) {
        worker.send(
            {
                type: "m3u8_download",
                uuid: worker.id,
                name: data.name,
                url: data.uri,
                index: data.index,
                timeout: data.timeout,
                downloadPath: downloadPath,
                param: JSON.stringify(this.param)
            }
        );
    }

    /**
     * 多线程下载
     * @param {*} completedNumber 已经下载完成的数量，继续下载 传入。
     * @returns 
     */
    startCluster() {
        this.statusCode = 10014;
        this.suspendSwitch = false;
        for (let i = 0; i < numCPUs; i++) {
            this.fork()
        }
    };

    // 下载暂停
    suspendCluster() {
        // 清除全部子任务
        this.workers.forEach((worker) => {
            worker.kill('SIGTERM');
        })
        this.workers = [];

        // 把进行中切换成未开始
        this.rangeList.forEach((v) => {
            if (v.status === Status.InProgress) v.status = Status.NotStarted;
        });

        this.suspendSwitch = true;
        this.statusCode = 10011;
        return { code: this.statusCode };
    };

    // 继续下载
    async reDownloadCluster() {
        this.startCluster();
    }
};

module.exports = Cluster;