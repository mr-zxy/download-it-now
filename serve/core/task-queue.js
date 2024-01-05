const { app } = require('electron')
const childFork = require('child_process').fork;
const path = require("path");
const uuid = require("uuid");
const Task = require("./task");
const MovieM3u8Initialization = require("../initialization/movie-m3u8-initialization");
const MovieUniversalInitialization = require("../initialization/movie-universal-initialization");
const { deleteFolderRecursive } = require("../tools/fs-tool");
const { sleep, filterString, getUrlSuffix } = require("../tools/tool");

class TaskQueue {
    constructor(callback) {
        this.callback = callback || (() => { });
        // 最大可存放任务数量
        this.maxTask = 5;
        // 最大并发任务数量
        this.maxRun = 2;
        // 执行队列
        this.taskRunQueue = [];
        // 等待队列
        this.taskWaitQueue = [];
        this.finishListenin();
    }

    finishListenin() {
        const timer = setInterval(() => {
            this.callback && this.callback?.(this.taskRunQueue, this.taskWaitQueue)
            this.finishSave();
        }, 500);

        process.on('exit', (_code) => {
            clearTimeout(timer);
            app.quit();
            app.exit();
            process.exit();
        });
    }

    // 完成
    async finishSave() {
        const finishIndex = this.taskRunQueue.findIndex(v => v.movies?.sectionCluster?.statusCode === 10015);
        if (finishIndex !== -1) {
            const finish = this.taskRunQueue[finishIndex];

            // 视频合成 采用线程方式，不要阻塞主线程;
            finish.movies.sectionCluster.statusCode = 10016;

            const worker = childFork(
                process.env.NODE_ENV === "production" ? path.join(process.resourcesPath, 'app.asar.unpacked/core/section-download.js') : path.resolve(__dirname, "./section-download.js")
            );
            const { param } = finish.movies;
            const { videoInfo } = param;
            if (videoInfo.audioFormat === "m3u8") {
                this.m3u8SynthesisSend(worker, {
                    m3u8Text: finish.movies.m3u8Text,
                    param: JSON.stringify(param)
                })
            } else {
                this.universalSynthesisSend(worker, {
                    param: JSON.stringify(param)
                })
            }

            worker.on('message', (message) => {
                const { type } = message;
                if (type === "synthesisStart") {
                    console.log("开始合成")
                }

                if (type === "synthesisEnd") {
                    console.log("合成结束")
                    finish.movies.sectionCluster.statusCode = 10017;
                    const finishIndex = this.taskRunQueue.findIndex(v => v.movies.sectionCluster.statusCode === 10017);
                    // 任务下载完成，检测等待队列，如果有，去下载;
                    this.taskRunQueue.splice(finishIndex, 1);
                    if (this.taskWaitQueue.length > 0) {
                        const task = this.taskWaitQueue[0] || {};
                        if (task.movies) {
                            this.continue(task.uuid);
                        } else {
                            const task = this.taskWaitQueue.splice(0, 1)[0] || {};
                            this.taskQueue(task);
                        }
                    }
                }
            })
        }
    }

    // m3u8 合成
    m3u8SynthesisSend(worker, data) {
        worker.send(
            {
                type: "m3u8_synthesis",
                m3u8Text: data.m3u8Text,
                param: data.param
            }
        )
    }

    // 通用 合成
    universalSynthesisSend(worker, data) {
        worker.send(
            {
                type: "universa_synthesis",
                param: data.param
            }
        )
    }

    // 暂停
    suspend(uuid) {
        const taskIndex = this.taskRunQueue.findIndex(v => v.uuid === uuid);
        const tasks = this.taskRunQueue.splice(taskIndex, 1);
        tasks.forEach(task => task.suspend());
        this.taskWaitQueue.push(...tasks);
    }

    // 重试
    retry(uuid) {
        const task = this.taskRunQueue.find(v => v.uuid === uuid);
        task.retry(task)
    }

    // 继续
    continue(uuid) {
        if (this.taskRunQueue.length < this.maxRun) {
            const taskIndex = this.taskWaitQueue.findIndex(v => v.uuid === uuid);
            const tasks = this.taskWaitQueue.splice(taskIndex, 1);
            tasks.forEach(task => task.continue(task));
            this.taskRunQueue.push(...tasks);
        }
    }

    // 执行队列是否存在，防止任务重复添加
    verifyRunQueueExist(data = {}) {
        const tasks = [...this.taskRunQueue, ...this.taskWaitQueue]
        return tasks.some(v => {
            const { name, episodes } = v.option.videoInfo;
            const { name: name2, episodes: episodes2 } = data.videoInfo;
            if (name === name2 && episodes === episodes2) {
                return true;
            }
            return false
        })
    }

    // 执行等待队列
    startAwait(uuid) {
        if (this.taskRunQueue.length === this.maxRun) {
            return
        }
        const taskIndex = this.taskWaitQueue.findIndex(v => v.uuid === uuid);
        const tasks = this.taskWaitQueue.splice(taskIndex, 1);
        tasks.forEach(task => this.taskQueue(task));
    }

    // 取消
    cancellation(uuid) {
        const runTaskIndex = this.taskRunQueue.findIndex(v => v.uuid === uuid);
        if (runTaskIndex != -1) {
            const tasks = this.taskRunQueue.splice(runTaskIndex, 1);
            tasks.forEach(async task => {
                task.suspend();
                const { option } = task;
                await sleep(2000);
                const dirPath = path.resolve(__dirname, `../download/${option.title}/${option.videoInfo.name}/${option.videoInfo.episodes}`);
                deleteFolderRecursive(dirPath);
            });
            return
        }

        const awaitTaskIndex = this.taskWaitQueue.findIndex(v => v.uuid === uuid);
        if (awaitTaskIndex != -1) {
            this.taskWaitQueue.splice(awaitTaskIndex, 1);
            return
        }
    }

    // 主入口 添加队列
    addition(param = {}) {
        param.videoInfo.name = filterString(param.videoInfo.name);
        param.videoInfo.episodes = filterString(param.videoInfo.episodes);
        const taskRunQueueLength = this.taskRunQueue.length;
        const taskWaitQueueLength = this.taskWaitQueue.length;
        if (taskRunQueueLength + taskWaitQueueLength >= this.maxTask) {
            return `已达到队列最大限制`
        }

        const option = {
            uuid: uuid.v1(),
            option: param
        };
        this.taskQueue(option);

        return null;
    }

    // 队列分组
    taskQueue(option = {}) {
        const taskRunQueueLength = this.taskRunQueue.length;
        if (taskRunQueueLength < this.maxRun) {
            this.additionRun(option);
        } else {
            this.additionWait(option)
        }
    }

    // 等待队列
    additionWait(option = {}) {
        this.taskWaitQueue.push(option)
    }

    // 运行队列
    async additionRun(option = {}) {

        // 请求前拦截器
        const { beforeRequestInterceptor } = option.option.hooks;
        if (beforeRequestInterceptor) {
            const requireName = beforeRequestInterceptor.replace(/\//g, "_");
            await global.$require[requireName](option.option)
        }

        const { audioFormat } = option.option.videoInfo;

        let task = null;
        if (audioFormat === "m3u8") {
            task = new Task(MovieM3u8Initialization, option)
        } else {
            task = new Task(MovieUniversalInitialization, option)
        }

        this.taskRunQueue.push(task);
        task.runTask();
    }
}

module.exports = TaskQueue;