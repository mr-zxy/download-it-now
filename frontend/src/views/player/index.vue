<template>
  <div class="player">
    <div>
      <el-button
        v-for="(i, index) in moviesDownList"
        :key="index"
        @click="moviesDownHandle(i)"
        :color="downloadRow.label === i.label ? '#626aef' : ''"
        >{{ i.label }}</el-button
      >
      <el-button @click="download">下载</el-button
      ><el-button @click="openWindow">在线播放</el-button>
    </div>
    <div class="episodes">
      <el-tabs v-model="episodesIndex" class="demo-tabs">
        <el-tab-pane
          v-for="(i, index) in movies.episodesList"
          :key="index"
          :label="i.label"
          :name="index"
        >
          <el-button
            v-for="(j, idx) in i.episodes"
            :key="idx"
            :color="episodesParam.href === j.href ? '#626aef' : ''"
            @click="episodesChange(j)"
            >{{idx}}_{{ j.label }}</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="image">
      <img :src="movies.pic" @error="movies.pic = error" />
    </div>
    <div class="title">名称：{{ movies.title }}</div>
    <div class="describe">描述：{{ movies.describe }}</div>
    <div class="other" v-for="(i, index) in movies.otherList" :key="index">
      <el-text class="mx-1" type="warning">{{ i }}</el-text>
    </div>
  </div>
</template>
<script setup>
const { ipcRenderer } = require("electron");
const { shell } = require("electron");
import { cinemaList } from "~@/require-config.js";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { ElLoading, ElMessage } from "element-plus";

import error from "@/assets/image/error.png";

const route = useRoute();
const router = useRouter();

const movies = ref({});
const episodesIndex = ref(0);
const episodesParam = ref({});

// 下载
const moviesDownList = ref([]);
const downloadRow = ref({});

const { id, href } = route.query;
const data = cinemaList.find((v) => v.id === id);

watch(
  () => episodesParam.value.href,
  async (newValue, _oldValue) => {
    if (newValue) {
      try {
        const { website, hooks } = data;
        const { getRealVideoUrlHook } = hooks;

        moviesDownList.value = [];
        downloadRow.value = {};

        ipcRenderer.send("trigger-parse-procedure", {
          type: "parseHookUrl",
          websiteUrl: newValue,
          website,
          triggerPath: getRealVideoUrlHook,
        });
      } catch (e) {
        console.log(e, "错误信息！");
      } finally {
      }
    }
  }
);

const moviesDownHandle = (row) => {
  downloadRow.value = row;
};

const openWindow = () => {
  shell.openExternal(episodesParam.value.href);
};

const episodesChange = (row) => {
  episodesParam.value = row;
};

const download = () => {
  if (JSON.stringify(downloadRow.value) === "{}") {
    ElMessage.error("等待链接加载完");
    return;
  }

  data.videoInfo.name = movies.value.title;
  data.videoInfo.url = downloadRow.value;

  if (downloadRow.value.label.length > 10) {
    data.videoInfo.episodes = episodesParam.value.label;
  } else {
    data.videoInfo.episodes =
      downloadRow.value.label + "_" + episodesParam.value.label;
  }

  // console.log(episodesParam.value);
  // console.log(downloadRow.value);
  // console.log(data.videoInfo.episodes);

  ipcRenderer.send("additon-task", JSON.stringify(data));
};

const getMovieInfo = async () => {
  try {
    const { website, analysis } = data;
    const { getMovieDetailPath } = analysis;

    ipcRenderer.send("trigger-parse-procedure", {
      type: "getDetailMovies",
      websiteUrl: href,
      website,
      triggerPath: getMovieDetailPath,
    });
  } catch (e) {
    console.log(e, "错误信息！");
  } finally {
  }
};

async function initialization() {
  getMovieInfo();
}

defineExpose({
  movies,
  episodesParam,
  moviesDownList,
  episodesIndex,
  downloadRow,
});

initialization();
</script>
<style lang="less" scoped>
.player {
  padding: 20px;
  .el-button {
    margin-left: 0px;
    margin: 10px;
  }
  .image {
    width: 200px;
    margin-bottom: 10px;
    background: #d7d3d3;
    border-radius: 10px;
    overflow: hidden;
    img {
      width: 100%;
      max-height: 200px;
      min-height: 200px;
      display: block;
    }
  }
  .title {
    font-size: 22px;
    margin-bottom: 10px;
    color: #ed5415;
    font-weight: bold;
  }
  .describe {
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>