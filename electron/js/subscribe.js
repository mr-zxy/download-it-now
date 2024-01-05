require("../../serve/global");
require("../../serve/common");
const { ipcMain, dialog, shell } = require('electron');
const fs = require("fs");
const TaskQueue = require("../../serve/core/task-queue");
const { getDownloadPath, filterString, getDownPath, sizeConvert } = require("../../serve/tools/tool");
const { verifyDirMp4, deleteFolderRecursive, getDirFilesTree, deleteFolderRecursiveInclude } = require("../../serve/tools/fs-tool");
const { checkOpenssl, checkFfmpeg } = require("../../serve/tools/check");
const { setHttpsProxy, checkAgent } = require("../../serve/tools/agent");

module.exports = (win) => {
    const taskQueue = new TaskQueue((taskRunQueue = [], taskWaitQueue = []) => {

        const format = (list) => {
            return list.map((v = { videoInfo: {}, movies: {} }) => ({
                uuid: v.uuid,
                title: v.option.title,
                name: v.option.videoInfo.name,
                episodes: v.option.videoInfo.episodes,
                progres: v.movies?.sectionCluster?.progres,
                statusCode: v.movies?.sectionCluster?.statusCode
            }))
        };

        win.webContents.send('listenin-task', JSON.stringify({ runQueue: format(taskRunQueue), taskWaitQueue: format(taskWaitQueue) }));
    });

    // 程序执行，用于解析 html，hooks
    ipcMain.on("trigger-parse-procedure", async (_event, data) => {
        win.webContents.send('change-parse-procedure-loading');
        const { type, websiteUrl, website, triggerPath } = data;
        const requireName = triggerPath.replace(/\//g, "_");
        const param = await global.$require[requireName](websiteUrl, website)
        win.webContents.send('change-parse-procedure', { param, type });
    });

    // 下载
    ipcMain.on('additon-task', (_event, data) => {
        const parse = JSON.parse(data)

        parse.videoInfo.name = filterString(parse.videoInfo.name);
        parse.videoInfo.episodes = filterString(parse.videoInfo.episodes);

        const downloadPath = getDownloadPath(parse);
        if (!checkOpenssl()) {
            dialog.showErrorBox('错误', '请安装 openssl');
            return
        }

        if (!checkFfmpeg()) {
            dialog.showErrorBox('错误', '请安装 ffmpeg');
            return
        }

        if (verifyDirMp4(downloadPath)) {
            dialog.showMessageBox({
                type: 'warning',
                title: '警告',
                message: '以存在视频是否重新下载',
                buttons: ['取消', '确定']
            }).then((result) => {
                // 是1 否0
                const code = result.response;
                if (code === 1) {
                    deleteFolderRecursive(downloadPath);
                    continueHandle();
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            continueHandle()
        }

        function continueHandle() {
            const isExist = taskQueue.verifyRunQueueExist(parse);
            if (isExist) {
                dialog.showErrorBox('错误', '此内容正在下载中！');
                return;
            }

            const tip = taskQueue.addition(parse);
            if (tip) {
                dialog.showErrorBox('错误', tip);
                return;
            }
        }
    });

    ipcMain.on('suspend-task', (_event, uuid) => {
        taskQueue.suspend(uuid);
    });

    ipcMain.on('retry-task', (_event, uuid) => {
        taskQueue.retry(uuid);
    });

    ipcMain.on('continue-task', (_event, uuid) => {
        taskQueue.continue(uuid);
    });

    ipcMain.on('start-await-task', (_event, uuid) => {
        taskQueue.startAwait(uuid);
    });

    ipcMain.on('cancellation-task', (_event, uuid) => {
        taskQueue.cancellation(uuid);
    });

    // 设置代理
    ipcMain.on('set-proxy-agent', (_event, host) => {
        setHttpsProxy(host)
    });

    // 查看代理
    ipcMain.on('check-proxy-Agent', async (_event, host) => {
        const data = await checkAgent(host);
        const text = `${data.ip}——${data.country}——${data.area}——${data.province}——${data.city}——${data.isp}`;
        dialog.showMessageBox({
            type: 'warning',
            title: '代理地址',
            message: text,
        });
    });

    // 资源库
    ipcMain.on('send-resource-library', (_event) => {
        const path = getDownPath();
        const tree = getDirFilesTree(path);
        win.webContents.send('get-resource-library', { tree, path });
    });

    // 删除资源库 文件 文件夹
    ipcMain.on('remove-resource-library', (_event, { path, type }) => {
        try {
            const stat = fs.statSync(path);
            if (stat.uid) {
                if (type === "file") {
                    // 删除文件
                    fs.rmSync(path);
                    return
                }

                // 删除文件夹所有内容
                deleteFolderRecursive(path);
            }
        } catch (e) {
            console.log(e)
        }
    });

    // 打开日志 
    ipcMain.on('open-log', (_event) => {
        if (global.$config?.loggerPath) {
            shell.openPath(global.$config.loggerPath);
        }
    });

    // 清除残余文件
    ipcMain.on('remove-residue-file', (_event) => {
        const downloadSize = deleteFolderRecursiveInclude(global.$config.downloadPath);
        // const logSize = deleteFolderRecursiveInclude(global.$config.loggerPath);
        const size = sizeConvert(downloadSize);
        dialog.showMessageBox({
            type: 'info',
            title: '消息',
            message: '清除完成，共计清除' + size.MB
        })
    });
}