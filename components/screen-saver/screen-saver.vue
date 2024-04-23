<template>
  <div class="screenSaver-container" v-if="show" @click="closeScreenSaver">
    <div class="screenSaver-wrapper">
      <div class="screenSaver-clock">{{ time }}</div>
    </div>
  </div>
</template>

<script>
import { timing } from "@/common/utils/util.js";

export default {
  name: "screen-saver",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      time: "",
      clockTimer: null,
    };
  },
  watch: {
    show() {
      if (this.show) {
        this.screenSaverClock();
      } else {
        clearInterval(this.clockTimer);
      }
    },
  },
  methods: {
    // 屏保时钟
    screenSaverClock() {
      this.clockTimer = setInterval(() => {
        this.time = timing();
      }, 1000);
    },
    // 关闭屏保
    closeScreenSaver() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less">
.screenSaver-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  .screenSaver-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .screenSaver-clock {
      color: #fff;
      font-size: 132upx;
    }
  }
}
</style>
