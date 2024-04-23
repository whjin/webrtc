<template>
  <view class="v-alarm-container">
    <image class="v-alarm-cycle-image" src="/static/images/index/spjb.png"></image>
    <view class="v-alarm-cape">
      <image class="v-alarm-cape-image" src="/static/images/index/spjbj.png"></image>
    </view>
    <view class="v-alarm-box" @click="closeAlarm">
      <common-icons type="iconalarm" size="76" color="#fff"></common-icons>
      <view class="v-alarm-content">
        <text>{{ alarmName }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import commonIcons from "@/components/common-icons/common-icons.vue";
import { mapState } from "vuex";

export default {
  name: "v-alarm",
  components: {
    commonIcons,
  },
  computed: {
    ...mapState({
      // 报警监室名
      alarmName: (state) => state.app.alarmName,
    })
  },
  methods: {
    closeAlarm () {
      this.$emit("close-alarm", false);
    },
  },
};
</script>

<style lang="less">
.v-alarm-container {
  width: 600upx;
  height: 600upx;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .v-alarm-cycle-image {
    width: 600upx;
    height: 600upx;
  }
  .v-alarm-cape {
    position: absolute;
    left: 50%;
    top: 0;
    transform-origin: left bottom;
    animation: rotate 5s linear infinite;
    .v-alarm-cape-image {
      width: 244.82upx;
      height: 288.96upx;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0%);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  .v-alarm-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    .v-alarm-content {
      display: flex;
      flex-direction: column;
      text {
        font-family: Microsoft YaHei;
        font-size: 16upx;
        font-weight: 400;
        text-align: center;
        line-height: 28upx;
      }
    }
  }
}
</style>
