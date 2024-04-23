<template>
  <div class="nav-bar-container nav-bar-img">
    <div class="nav-bar-title">
      <text @click="onClickInit">{{ title }}</text>
    </div>
    <div class="nav-bar-home">
      <div v-if="homeState" class="operating" @touchstart.stop="onClickHome">
        <common-icons iconType="iconhome" size="45" color="#fff" />
      </div>
      <div v-if="backState" class="operating" @touchstart.stop="onClickBack">
        <common-icons iconType="iconback" size="38" color="#fff" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    currentTab: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: "监室智能交互终端系统",
    },
    homeState: {
      type: Boolean,
      default: true,
    },
    backState: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClickInit () {
      this.$emit("click-init");
    },
    // 返回首页
    onClickHome () {
      this.$emit("click-home");
    },
    // 页面回退
    onClickBack () {
      this.$emit("click-back");
    },
  },
};
</script>

<style lang="less">
.nav-bar-container {
  width: 100%;
  height: 81.25upx;
  box-sizing: border-box;
  .nav-bar-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav-bar-home {
    display: flex;
    align-items: center;
    position: absolute;
    top: 32upx;
    right: 32upx;
    .operating {
      padding-left: 20upx;
    }
  }
}
</style>
