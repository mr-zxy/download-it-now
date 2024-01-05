<template>
  <div>
    <div class="operate">
      <div class="goback">
        <img :src="back" @click="goback" />
      </div>
      <div class="opentask">
        <el-button color="#626aef">
          <router-link to="/">首页</router-link>
        </el-button>
        <el-button color="#626aef" @click="openResourceLibrary"
          >资源库</el-button
        >
        <proxy-component></proxy-component>
        <el-button color="#626aef" @click="opentaskBool = !opentaskBool"
          >任务列表</el-button
        >
        <el-button color="#626aef" @click="openLog">查看日志</el-button>
        <el-button color="#626aef" @click="removeResidueFile"
          >清除残余文件</el-button
        >
      </div>
    </div>

    <player-controller v-show="opentaskBool"></player-controller>

    <router-view v-slot="{ Component }">
      <component :is="Component" ref="componentRef" />
    </router-view>
  </div>
</template>
<script setup>
import { ElLoading } from "element-plus";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const { ipcRenderer } = require("electron");
import back from "../assets/image/back.png";

const router = useRouter();
const opentaskBool = ref(true);
const componentRef = ref("");

onMounted(() => {
  let loading = null;

  ipcRenderer.on("change-parse-procedure-loading", () => {
    loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });

    setTimeout(() => {
      loading?.close();
    }, 5000);
  });

  ipcRenderer.on("change-parse-procedure", (_event, { param, type = "" }) => {
    loading?.close();

    // movies/index.vue
    if (type === "getDefaultMovies") {
      componentRef.value.list = param || [];
    }

    // player/index.vue
    if (type === "getDetailMovies") {
      const { episodesIndex } = componentRef.value;
      const row = param.episodesList[episodesIndex].episodes[0];
      componentRef.value.episodesParam = row;
      componentRef.value.movies = param || {};
    }

    // player/index.vue
    if (type === "parseHookUrl") {
      if (Array.isArray(param) && param.length > 0) {
        componentRef.value.moviesDownList = param;
        componentRef.value.downloadRow = param[0];
      }
    }

    // movies/index.vue
    if (type === "moviesLogin") {
      location.reload();
    }
  });
});

const goback = () => {
  router.back();
};

/**
 * 打开日志
 */
const openLog = () => {
  ipcRenderer.send("open-log");
};

/**
 * 清除残余文件
 */
const removeResidueFile = () => {
  ipcRenderer.send("remove-residue-file");
};

/**
 * 跳转
 */
const openResourceLibrary = () => {
  router.push({ path: "/resourceLibrary" });
};
</script>

<style lang="less" scoped>
.operate {
  display: flex;
  padding: 10px 10px;
  align-items: center;
  .goback {
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .opentask {
    display: flex;
    justify-content: end;
    flex: 1;
    a {
      color: #fff;
      text-decoration: none;
    }
    button {
      margin-left: 12px;
    }
  }
}
</style>