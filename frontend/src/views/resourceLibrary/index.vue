<template>
  <div class="resourceLibrary">
    <div class="header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(i, index) in list"
          :key="index"
          @click="cacheClick(i, index)"
        >
          <a> {{ i.name }}</a></el-breadcrumb-item
        >
      </el-breadcrumb>
      <div class="operate">
        <el-button type="primary" size="large" class="refresh" @click="refreshHandle"
          >刷新</el-button
        >
      </div>
    </div>

    <div class="body">
      <div class="body-wrapper" v-if="data?.children?.length > 0">
        <el-card
          v-for="(i, index) in data.children"
          :key="index"
          @click="fileClick(i)"
          shadow="always"
          :class="[setPointerClass(i)]"
        >
          <div class="delete" @click.stop="deleteFile(i)">
            <img :src="deleteImg" />
          </div>
          <div class="image"><img :src="setImage(i)" /></div>
          <div class="label">{{ i.name }}</div>
        </el-card>
      </div>
      <div v-else>
        <el-empty description="这是空文件夹！" />
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :destroy-on-close="true" width="50%">
      <div class="video">
        <video :src="videoUrl" controls></video>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import folder from "@/assets/image/folder.png";
import video from "@/assets/image/video.png";
import file from "@/assets/image/file.png";
import deleteImg from "@/assets/image/delete.png";

const { ipcRenderer } = require("electron");

import { ref } from "vue";

let localPath = "";

const dialogVisible = ref(false);
const videoUrl = ref("");

const data = ref({});
const list = ref([]);

const cacheClick = (row, index) => {
  data.value = row;
  list.value.splice(index + 1, list.value.length);
};

const fileClick = (row) => {
  if (row.children) {
    data.value = row;
    list.value.push(row);
  }
  if (!!~row.name.indexOf(".mp4")) {
    if (import.meta.env.MODE === "development") {
      const url =
        "serve/download/" +
        list.value
          .map((v) => v.name)
          .splice(1)
          .join("/") +
        "/" +
        row.name;
      dialogVisible.value = true;
      videoUrl.value = url;
    } else {
      const suffix =
        "/" +
        list.value
          .map((v) => v.name)
          .splice(1)
          .join("/") +
        "/" +
        row.name;
      const url = localPath + suffix;
      dialogVisible.value = true;
      videoUrl.value = url;
    }
  }
};

const deleteFile = (row) => {
  const suffix =
    "/" +
    list.value
      .map((v) => v.name)
      .splice(1)
      .join("/") +
    "/" +
    row.name;
  const url = localPath + suffix;
  const type = row.type;
  ipcRenderer.send("remove-resource-library", { path: url, type });
  refreshHandle();
};

const setImage = (row) => {
  if (row.children) {
    return folder;
  } else if (!!~row.name.indexOf(".mp4")) {
    return video;
  } else {
    return file;
  }
};

const setPointerClass = (row) => {
  if (row.children) {
    return "pointer";
  } else if (!!~row.name.indexOf(".mp4")) {
    return "pointer";
  } else {
    return "";
  }
};

const refreshHandle = () => {
  list.value = [];
  ipcRenderer.send("send-resource-library", {});
};

function initialization() {
  ipcRenderer.send("send-resource-library", {});
  ipcRenderer.on("get-resource-library", (_event, options) => {
    const { tree, path } = options;
    localPath = path;
    data.value = tree;
    list.value.push(tree);
  });
}

initialization();
</script>
<style lang="less" scoped>
.resourceLibrary {
  padding: 10px;

  .el-breadcrumb {
    font-size: 30px;
  }

  .header {
    display: flex;
    align-items: center;
    .el-breadcrumb {
      flex: 1;
    }
    .operate {
      margin-right: 40px;
    }
  }

  .body {
    .body-wrapper {
      display: flex;
      gap: 20px 30px;
      flex-wrap: wrap;
      justify-content: center;
      .el-card {
        min-width: 160px;
        max-width: 160px;
        position: relative;
      }

      .delete {
        width: 30px;
        height: 30px;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .image {
        width: 80px;
        height: 80px;
        overflow: hidden;
        margin: 0 auto 10px auto;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .label {
        font-size: 20 px;
        color: black;
        text-align: center;
      }

      .pointer {
        cursor: pointer;
      }
    }
  }

  .video {
    width: 300px;
    margin: 0 auto;
    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>