<template>
  <div class="home-container">
    <h1>WebRTC</h1>
    <nav>
      <RouterLink v-for="(item, index) in routes" :key="index" :to="item.path" target="_blank">
        <el-button type="primary">{{ item.name }}</el-button>
      </RouterLink>
    </nav>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { ElButton } from 'element-plus';

export default {
  name: "Home",
  components: { RouterLink, ElButton },
  data() {
    return {
      routes: [
        {
          path: "/web-control",
          name: "管控主机"
        },
        {
          path: "/web-terminal",
          name: "仓内分机"
        },
        {
          path: "/web-test",
          name: "测试页"
        }
      ]
    };
  },
};
</script>

<style lang="less">
@import "../assets/less/index.less";
</style>