<template>
  <view>
    <view :class="['content', { show: show }]">
      <view class="bottom keyboard-img" @click.stop="donothing">
        <view class="cell-header">
          <view class="cell-title">密码验证</view>
          <view class="cell-close" @click="hide">
            <image src="/static/images/common/close.png"></image>
          </view>
        </view>
        <view :class="['flexCC',{'fail': failIf}]">
          <view :class="['circle', { blackC: password.length >= 1 }]"></view>
          <view :class="['circle', { blackC: password.length >= 2 }]"></view>
          <view :class="['circle', { blackC: password.length >= 3 }]"></view>
          <view :class="['circle', { blackC: password.length >= 4 }]"></view>
          <view :class="['circle', { blackC: password.length >= 5 }]"></view>
          <view :class="['circle', { blackC: password.length >= 6 }]"></view>
        </view>
        <view class="bottom-row">
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('1')">1</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('2')">2</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('3')">3</Button>
        </view>
        <view class="bottom-row">
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('4')">4</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('5')">5</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('6')">6</Button>
        </view>
        <view class="bottom-row">
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('7')">7</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('8')">8</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('9')">9</Button>
        </view>
        <view class="bottom-row">
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('clear')">
            <text>清空</text>
          </Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('0')">0</Button>
          <Button :color="'#fff'" class="btn-class" @touchend.native="handleKey('backspace')">
            <text>删除</text>
          </Button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Button from './dt-button.vue';
export default {
  name: 'keyBoard',
  components: { Button },
  props: {
    show: {
      type: Boolean,
      default: false,

    },
    failIf: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      password: ''
    };
  },
  methods: {
    handleKey (e) {
      if (Number(e) >= 0 && this.password.length <= 6) {
        this.password += e.toString();
        if (this.password.length == 6) {
          this.$emit('getPassword', this.password);
        }
      }
      if (e == 'clear') {
        this.clear();
      }
      if (e == 'backspace') {
        if (this.password == '') return;
        let arr = this.password.split('');
        arr.pop();
        this.password = arr.join('');
      }
    },
    hide () {
      this.$emit('hideKey', false);
    },
    donothing () { },
    clear () {
      this.password = '';
    }
  },
  watch: {
    'show' (newVal, oldVal) {
      if (!newVal) this.password = '';
    },
  }
};
</script>

<style lang="less">
.content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s linear;
  display: none;
}
.content.show {
  pointer-events: auto;
  opacity: 1;
  transition: all 0.25s linear;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom {
  z-index: 12000;
  width: 500upx;
  height: 400upx;
  box-sizing: border-box;
  transition: all 0.2s linear;
}
.show .bottom {
  transform: translateY(0%);
  transition: all 0.2s linear;
}
.btn-class {
  height: 52px;
  width: 33.33%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18px;
  font-size: 24upx;
  text {
    font-size: 20upx;
  }
}
.icon {
  width: 24px;
  height: 24px;
}
.circle {
  width: 24px;
  height: 24px;
  border: 1px solid #666;
  border-radius: 50%;
  margin: 8upx;
}
.blackC {
  width: 24px;
  height: 24px;
  background-color: #fff;
}
.flexCC {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16upx;
}
.bottom-row {
  display: flex;
}
.cell-header {
  display: flex;
  align-items: center;
  font-size: 24upx;
  font-weight: 400;
  margin: 24upx 0 16upx 0;
  position: relative;
  .cell-title {
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .cell-close {
    position: absolute;
    right: 24upx;
    image {
      width: 22upx;
      height: 22upx;
    }
  }
}
.fail {
  animation: shake 600ms ease-in-out;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(+2px, 0, 0);
  }
  30%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(+4px, 0, 0);
  }
  50% {
    transform: translate3d(-5px, 0, 0);
  }
}
</style>
