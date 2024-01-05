const fs = require('fs');
const path = require('path');

// 删除文件夹下所有文件
const deleteFolderRecursive = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // 如果是文件夹，递归删除  
                deleteFolderRecursive(curPath);
            } else {
                // 如果是文件，直接删除  
                fs.unlinkSync(curPath);
            }
        });
        // 删除空文件夹  
        fs.rmdirSync(folderPath);
    }
}

// 验证文件夹是否存在 .mp4
const verifyDirMp4 = (directoryPath) => {
    if (fs.existsSync(directoryPath) === false) {
        return false;
    }
    const files = fs.readdirSync(directoryPath);
    const flag = files.some((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && path.extname(filePath) === '.mp4') {
            return true
        }
        return false
    });
    return flag;
}

// 获取文件夹下所有 文件 返回 tree
const getDirFilesTree = (dir) => {
    const tree = { name: path.basename(dir), children: [] };
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const childTree = getDirFilesTree(filePath);
            tree.children.push(childTree);
        } else {
            tree.children.push({ name: file, type: 'file' });
        }
    }
    return tree;
};

// 获取文件夹下所有 文件
const getDirFiles = (dir) => {
    const fileList = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const list = getDirFiles(filePath);
            fileList.push(...list)

        } else {
            if (path.extname(file) === ".js") {
                fileList.push(filePath)
            }
        }
    }
    return fileList;
};

// 删除文件夹下，不包含的文件，返回删除文件的大小
const deleteFolderRecursiveInclude = (folderPath, include = [".mp4"]) => {
    let size = 0;
    folderRecursiveInclude(folderPath);
    return size;

    function folderRecursiveInclude(folderPath) {
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file) => {
                const curPath = path.join(folderPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    // 如果是文件夹，递归删除  
                    folderRecursiveInclude(curPath);
                } else {
                    if (include.indexOf(path.extname(curPath)) === -1) {
                        // 删除
                        size += fs.statSync(curPath).size;
                        fs.unlinkSync(curPath);
                    }
                }
            });
        }
    }
}

// 文件下载，检测文件夹。
const downloadExistsCreateFolder = (downloadPath, param) => {
    try {
        if (!fs.existsSync(`${downloadPath}`)) fs.mkdirSync(`${downloadPath}`);
        if (!fs.existsSync(`${downloadPath}/${param.title}`)) fs.mkdirSync(`${downloadPath}/${param.title}`);
        if (!fs.existsSync(`${downloadPath}/${param.title}/${param.videoInfo.name}`)) fs.mkdirSync(`${downloadPath}/${param.title}/${param.videoInfo.name}`);
        if (!fs.existsSync(`${downloadPath}/${param.title}/${param.videoInfo.name}/${param.videoInfo.episodes}`)) fs.mkdirSync(`${downloadPath}/${param.title}/${param.videoInfo.name}/${param.videoInfo.episodes}`);
    } catch (e) {
        // 多线程创建重复
    }

}

module.exports = { deleteFolderRecursive, verifyDirMp4, getDirFilesTree, getDirFiles, deleteFolderRecursiveInclude, downloadExistsCreateFolder };