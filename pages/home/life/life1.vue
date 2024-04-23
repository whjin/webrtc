<template>
  <view :class="longPress == '1' ? 'record-layer' : 'record-layer1'">
    <view :class="longPress == '1' ? 'record-box' : 'record-box1'">
      <view class="record-btn-layer">
        <button class="record-btn" :class="longPress == '1' ? 'record-btn-1' : 'record-btn-2'"
          :style="VoiceTitle != '松开手指,取消发送' && longPress != '1' ? 'background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);' : 'background-color: rgba(0, 0, 0, .5);color:white'"
          @longtap="longpressBtn" @touchend="touchendBtn()" @touchmove="handleTouchMove" @touchstart="longpressBtn">
          <text>{{ VoiceText }}</text>
        </button>
      </view>
      <view :class="VoiceTitle != '松开手指,取消发送' ? 'prompt-layer prompt-layer-1' : 'prompt-layer1 prompt-layer-1'"
        v-if="longPress == '2'">
        <view class="prompt-loader">
          <view class="em" v-for="(item, index) in 15" :key="index"></view>
        </view>
        <text class="span">{{ VoiceTitle }}</text>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      longPress: '1', // 1显示 按住 说话 2显示 说话中
      delShow: false, // 删除提示框显示隐藏
      time: 0, //录音时长
      duration: 60000, //录音最大值ms 60000/1分钟
      tempFilePath: '', //音频路径
      startPoint: {}, //记录长按录音开始点信息,用于后面计算滑动距离。
      sendLock: true, //发送锁，当为true时上锁，false时解锁发送
      VoiceTitle: '松手结束录音',
      VoiceText: '按住 说话',
      types: ''
    };
  },
  methods: {
    // 长按录音事件
    longpressBtn(e) {
      this.startPoint = e.touches[0];//记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
      this.longPress = '2';
      this.VoiceText = '说话中...';
      // 监听音频开始事件
      this.sendLock = false;//长按时是不上锁的。
    },
    // 长按松开录音事件
    touchendBtn() {
      this.longPress = '1';
      this.VoiceText = '按住 说话';
      this.VoiceTitle = '松手结束录音';
    },
    // 删除录音
    handleTouchMove(e) {
      //touchmove时触发
      var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY; //移动距离
      if (Math.abs(moveLenght) > 70) {
        this.VoiceTitle = "松开手指,取消发送";
        this.VoiceText = '松开手指,取消发送';
        this.delBtn();
        this.sendLock = true; //触发了上滑取消发送，上锁
      } else {
        this.VoiceTitle = "松手结束录音";
        this.VoiceText = '松手结束录音';
        this.sendLock = false;//上划距离不足，依然可以发送，不上锁
      }
    },
    delBtn() {
      this.delShow = false;
      this.time = 0;
      this.tempFilePath = '';
    },
  }
};
</script>

<style lang="less" scoped>
.record-layer {
  width: 91vw;
  box-sizing: border-box;
  height: 15vw;
  position: fixed;
  margin-left: 4vw;
  z-index: 10;
  bottom: 3vh;
}

.record-layer1 {
  width: 100vw;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, .6);
  z-index: 10;
  bottom: 0vh;
}

.record-box {
  width: 100%;
  position: relative;
}

.record-box1 {
  width: 100%;
  position: relative;
  bottom: -83vh;
  height: 17vh;
}

.record-btn-layer {
  width: 100%;
}

.record-btn-layer button::after {
  border: none;
  transition: all 0.1s;
}

.record-btn-layer button {
  font-size: 14px;
  line-height: 50px;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  text-align: center;
  background: #FFD300;
  transition: all 0.1s;
}

.record-btn-layer button image {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
  transition: all 0.3s;
}

.record-btn-layer .record-btn-1 {
  background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
  color: #000000 !important;
}

.record-btn-layer .record-btn-2 {
  border-radius: 168rpx 168rpx 0 0;
  height: 17vh;
  line-height: 17vh;
  transition: all 0.3s;
}

/* 提示小弹窗 */
.prompt-layer {
  border-radius: 15px;
  background: #95EB6C;
  padding: 8px 16px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  height: 11vh;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.prompt-layer::after {
  content: '';
  display: block;
  border: 12px solid rgba(0, 0, 0, 0);
  border-radius: 10rpx;
  border-top-color: #95EB6C;
  position: absolute;
  bottom: -46rpx;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s;
}

//取消动画
.prompt-layer1 {
  border-radius: 15px;
  background: #FB5353;
  padding: 8px 16px;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  height: 11vh;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.prompt-layer1::after {
  content: '';
  display: block;
  border: 12px solid rgba(0, 0, 0, 0);
  border-radius: 10rpx;
  border-top-color: #FB5353;
  position: absolute;
  bottom: -46rpx;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.prompt-layer-1 {
  font-size: 12px;
  width: 150px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: -400rpx;
}

.prompt-layer-1 .p {
  color: #000000;
}

.prompt-layer-1 .span {
  color: rgba(0, 0, 0, .6);
}

/* 语音音阶------------- */
.prompt-loader {
  width: 96px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.prompt-loader .em {
  display: block;
  background: #333333;
  width: 1px;
  height: 10%;
  margin-right: 2.5px;
  float: left;
}

.prompt-loader .em:last-child {
  margin-right: 0px;
}

.prompt-loader .em:nth-child(1) {
  animation: load 2.5s 1.4s infinite linear;
}

.prompt-loader .em:nth-child(2) {
  animation: load 2.5s 1.2s infinite linear;
}

.prompt-loader .em:nth-child(3) {
  animation: load 2.5s 1s infinite linear;
}

.prompt-loader .em:nth-child(4) {
  animation: load 2.5s 0.8s infinite linear;
}

.prompt-loader .em:nth-child(5) {
  animation: load 2.5s 0.6s infinite linear;
}

.prompt-loader .em:nth-child(6) {
  animation: load 2.5s 0.4s infinite linear;
}

.prompt-loader .em:nth-child(7) {
  animation: load 2.5s 0.2s infinite linear;
}

.prompt-loader .em:nth-child(8) {
  animation: load 2.5s 0s infinite linear;
}

.prompt-loader .em:nth-child(9) {
  animation: load 2.5s 0.2s infinite linear;
}

.prompt-loader .em:nth-child(10) {
  animation: load 2.5s 0.4s infinite linear;
}

.prompt-loader .em:nth-child(11) {
  animation: load 2.5s 0.6s infinite linear;
}

.prompt-loader .em:nth-child(12) {
  animation: load 2.5s 0.8s infinite linear;
}

.prompt-loader .em:nth-child(13) {
  animation: load 2.5s 1s infinite linear;
}

.prompt-loader .em:nth-child(14) {
  animation: load 2.5s 1.2s infinite linear;
}

.prompt-loader .em:nth-child(15) {
  animation: load 2.5s 1.4s infinite linear;
}

@keyframes load {
  0% {
    height: 10%;
  }

  50% {
    height: 100%;
  }

  100% {
    height: 10%;
  }
}

.prompt-layer-2 {
  top: -40px;
}

.prompt-layer-2 .text {
  color: rgba(0, 0, 0, 1);
  font-size: 12px;
}
</style>

