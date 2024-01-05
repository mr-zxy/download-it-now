<template>
  <div class="playerController">
    <div class="body">
      <div class="task">
        <ul>
          <li v-for="(i, index) in runQueue" :key="index">
            <div class="website">
              <span>{{ i.title }}</span>
            </div>
            <div class="title">
              名称：<el-text
                class="mx-1"
                truncated="true"
                :title="i.name + ',' + i.episodes"
                >{{ i.name }}，{{ i.episodes }}集</el-text
              >
            </div>
            <div class="progres">进度：{{ i.progres }}%</div>
            <div class="status">
              {{ IMPORT_MAIN_STATUS[i.statusCode || 10013] }}
            </div>
            <div class="operate">
              <div v-for="(j, idx) in Status[i.statusCode]" :key="idx">
                <el-button size="small" v-if="j === 1" @click="cancellation(i)"
                  >取消</el-button
                >
                <el-button size="small" v-if="j === 2" @click="retryTask(i)"
                  >重试</el-button
                >
                <el-button size="small" v-if="j === 4" @click="suspend(i)"
                  >暂停</el-button
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="task">
        <ul>
          <li v-for="(i, index) in taskWaitQueue" :key="index">
            <div class="website">
              <span>{{ i.title }}</span>
            </div>
            <div class="title">
              名称：<el-text
                class="mx-1"
                truncated="true"
                :title="i.name + ',' + i.episodes"
                >{{ i.name }}，{{ i.episodes }}集</el-text
              >
            </div>
            <div class="progres" v-if="i.progres">进度：{{ i.progres }}%</div>
            <div class="status">
              {{ IMPORT_MAIN_STATUS[i.statusCode || 10013] }}
            </div>
            <div class="operate">
              <div v-if="i.progres">
                <el-button size="small" @click="continueTask(i)"
                  >继续</el-button
                >
              </div>
              <div v-else>
                <el-button size="small" @click="startAwaitTask(i)"
                  >开始</el-button
                >
              </div>
              <div>
                <el-button size="small" @click="cancellation(i)"
                  >取消</el-button
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { IMPORT_MAIN_STATUS } from "~@/require-config.js";

const { ipcRenderer } = require("electron");

const ButtonStatus = {
  cancellation: 1, // 取消
  retry: 2, // 重试
  suspend: 4, // 暂停
};

const Status = {
  10011: [ButtonStatus.retry, ButtonStatus.cancellation],
  10013: [ButtonStatus.cancellation],
  10014: [ButtonStatus.suspend, ButtonStatus.cancellation],
  10018: [ButtonStatus.suspend, ButtonStatus.cancellation],
  10019: [ButtonStatus.suspend, ButtonStatus.cancellation],
};

const runQueue = ref();
const taskWaitQueue = ref();

const suspend = ({ uuid }) => {
  ipcRenderer.send("suspend-task", uuid);
};

const retryTask = ({ uuid }) => {
  ipcRenderer.send("retry-task", uuid);
};

const continueTask = ({ uuid }) => {
  ipcRenderer.send("continue-task", uuid);
};

const startAwaitTask = ({ uuid }) => {
  ipcRenderer.send("start-await-task", uuid);
};

const cancellation = ({ uuid }) => {
  ipcRenderer.send("cancellation-task", uuid);
};

onMounted(() => {
  ipcRenderer.on("listenin-task", (_event, msg) => {
    const data = JSON.parse(msg);

    const runQueues = (data.runQueue || []).map((v) => {
      if (!v.statusCode) {
        v.statusCode = 10013;
      }
      return v
    });
    runQueue.value = runQueues;

    const taskWaitQueues = (data.taskWaitQueue || []).map((v) => {
      if (!v.statusCode) {
        v.statusCode = 10013;
      }
      return v
    });
    taskWaitQueue.value = taskWaitQueues;
  });
});

function initialization() {}

initialization();
</script>
<style lang="less" scoped>
.playerController {
  min-width: 300px;
  position: absolute;
  z-index: 10;
  right: 10px;
  background: #f7f7f7;
  padding: 0px 14px;
  .body {
    .task {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      li {
        background: #fff;
        padding: 10px;
        margin: 10px 0;
        margin-bottom: 10px;
        position: relative;
      }
      .website {
        color: black;
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .title {
        max-width: 330px;
        color: #2c2a2a;
        font-size: 16px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        span {
          width: 80%;
          padding: 4px 0;
        }
      }
      .progres {
        color: #2c2a2a;
        font-size: 16px;
        margin-bottom: 6px;
      }
      .status {
        position: absolute;
        top: 6px;
        right: 6px;
        min-width: 60px;
        padding: 6px 0;
        text-align: center;
        background: yellowgreen;
        border-radius: 10px;
        font-size: 12px;
        color: #e50808;
        font-weight: bold;
      }
      .operate {
        display: flex;
        justify-content: end;
        gap: 0 10px;
      }
    }
  }
}
</style>