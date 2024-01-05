class Task {
    constructor(task, options) {
        this.task = task
        this.uuid = options.uuid;
        this.option = options.option;
        this.movies = {};
    }
    // 执行任务
    async runTask() {
        this.movies = new this.task(this.option);
        this.movies.start();
    }

    // 暂停
    suspend() {
        this.movies.sectionCluster.suspendCluster()
    }
    
    // 重试
    retry(task){
        this.movies.sectionCluster.reDownloadCluster(task)
    }

    // 继续
    continue(task){
        this.movies.sectionCluster.reDownloadCluster(task)
    }
}

module.exports = Task;