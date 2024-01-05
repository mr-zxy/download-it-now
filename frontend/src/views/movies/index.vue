<template>
  <div class="movies">
    <div class="pl-20 pr-20">
      <span class="header-remark">{{ videoInfo.title }}</span>
      <el-button color="#8d0cc9" @click="login" style="width: 100px"
        v-show="videoInfo.title === 'bilibili'">登录</el-button>
      <el-button color="#8d0cc9" @click="openWebsite" style="width: 100px">打开网站</el-button>
    </div>
    <search @searchHandle="searchHandle"></search>
    <el-row v-if="list.length > 0">
      <el-col v-for="(item, index) in list" :key="index" :span="4" @click="gotoPlay(item.href)">
        <el-card :body-style="{ padding: '0px' }">
          <div class="image">
            <img :src="item.pic" @error="item.pic = error" />
          </div>
          <div style="padding: 14px">
            <div class="mb-6">
              <el-text class="mx-1" truncated="true" :title="item.title">名称：<span v-html="item.title"></span></el-text>
            </div>
            <div class="mb-6">
              <el-text class="mx-1" truncated="true" :title="item.describe">描述：<span
                  v-html="item.describe"></span></el-text>
            </div>
            <div class="mb-6">
              <el-text class="mx-1" truncated="true" :title="item.renew">{{
                item.renew || "无"
              }}</el-text>
            </div>
            <div class="mb-6">
              <el-text class="mx-1" truncated="true" :title="item.score">
                评分：{{ item.score || "无" }}</el-text>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-else description="空数据" />
  </div>
</template>
<script setup>
const { ipcRenderer, shell } = require("electron");
import { cinemaList } from "~@/require-config.js";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import error from "@/assets/image/error.png";

const route = useRoute();
const router = useRouter();
const { id } = route.query;

const list = ref([]);
const videoInfo = ref({});

const gotoPlay = (href) => {
  router.push({
    path: "/player",
    query: {
      id,
      href,
    },
  });
};

const openWebsite = () => {
  shell.openPath(videoInfo.value.website);
}

const login = () => {
  const data = cinemaList.find((v) => v.id === id);
  const { website, analysis } = data;
  const { moviesLoginPath } = analysis;
  ipcRenderer.send("trigger-parse-procedure", {
    type: "moviesLogin",
    websiteUrl: website,
    website,
    triggerPath: moviesLoginPath,
  });
};

const searchHandle = (value) => {
  const data = cinemaList.find((v) => v.id === id);
  const { website, analysis } = data;
  const { websiteSearchPath, websiteSearchUrl } = analysis;
  if (value) {
    ipcRenderer.send("trigger-parse-procedure", {
      type: "getDefaultMovies",
      websiteUrl: websiteSearchUrl + value,
      website,
      triggerPath: websiteSearchPath,
    });
  } else {
    getList();
  }
};

const getList = () => {
  try {
    const data = cinemaList.find((v) => v.id === id);

    const { website, analysis } = data;
    const { getDefaultPath, websiteDefaultDataUrl } = analysis;
    ipcRenderer.send("trigger-parse-procedure", {
      type: "getDefaultMovies",
      websiteUrl: websiteDefaultDataUrl,
      website,
      triggerPath: getDefaultPath,
    });
  } catch (e) {
    console.log(e, "错误信息！");
  } finally {
  }
};

async function initialization() {
  const data = cinemaList.find((v) => v.id === id);
  videoInfo.value = data;
  getList();
}

defineExpose({
  list,
});

initialization();
</script>

<style lang="less" scoped>
.movies {
  .header-remark {
    font-size: 22px;
    margin-right: 4px;
    font-weight: bold;
  }

  .el-row {
    gap: 40px;
    justify-content: center;
    cursor: pointer;
  }

  .box-card {
    min-width: 100px;
  }

  .image {
    display: block;
    height: 260px;
    background: url("@/assets/image/loading.gif") no-repeat;
    background-size: 100% 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>