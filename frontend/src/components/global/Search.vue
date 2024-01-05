<template>
  <div class="moviesSearch">
    <div class="shell">
      <input
        type="text"
        placeholder="Search"
        v-model="value"
        @keyup.enter.native="change"
      />
      <a @click="change"></a>
      <img class="fa-search" :src="search" />
    </div>
  </div>
</template>
<script setup>
import search from "@/assets/image/search.png";
import { ref } from "vue";
const value = ref("");

const $emit = defineEmits(["searchHandle"]);
const change = () => {
  $emit("searchHandle",value.value)
};
</script>

 <style lang="less" scoped>
.moviesSearch {
  margin: 40px 0;
  .shell {
    margin: 0 auto;
    position: relative;
    width: 600px;
    padding: 10px 20px;
    background-color: #ff7575;
    border-radius: 20px;
    box-shadow: 0 10px 50px #ff7575, 0 0 0 20px #fff;
    position: relative;
  }

  .shell input {
    width: 80%;
    height: 40px;
    color: #fff;
    font: 20 24px "优设标题黑";
    border: 0;
    background-color: transparent;
  }

  .shell input::placeholder {
    color: #8f36367e;
  }

  .shell a {
    display: flex;
    font-size: 120px;
    position: absolute;
    right: 40px;
    top: 10px;
    color: #fff;
    width: 250px;
    height: 150px;
    cursor: pointer;
  }

  .shell a .fa {
    margin: 10px 28px;
    transition: 0.3s;
  }

  .shell .fa-search {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .shell a::before {
    content: "GO!";
    position: absolute;
    display: block;
    font-size: 50px;
    background-color: #ff7575;
    padding: 5px 30px;
    top: 50px;
    right: -25px;
    border-radius: 10px;
    transition: 0.3s;
    opacity: 0;
    animation: box 1s infinite ease;
  }

  .shell a:hover::before {
    top: -115px;
    opacity: 1;
  }

  @keyframes box {
    0% {
      transform: rotate(0deg);
    }
    33% {
      transform: rotate(8deg);
    }
    66% {
      transform: rotate(-8deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}
</style>