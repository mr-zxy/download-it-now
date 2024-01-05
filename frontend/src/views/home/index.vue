<template>
  <div class="home">
    <el-card
      class="box-card"
      shadow="always"
      v-for="i in list"
      :key="i.id"
      @click="gotoInfo(i.id)"
    >
      <div class="image">
        <img :src="i.logo" />
      </div>
      <div class="label">{{ i.title }}</div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, defineOptions } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { cinemaList } from "~@/require-config.js";

const list = ref(cinemaList);

defineOptions({
  name: "home",
});

const gotoInfo = (id) => {
  router.push({ path: "/movies", query: { id } });
};

function initialization() {}

initialization();
</script>
<style lang="less" scoped>
.home {
  display: flex;
  gap: 20px;
  padding: 0 20px;
  .box-card {
    min-width: 100px;
    cursor: pointer;
    border-radius: 10px;
    .image {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .label {
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>