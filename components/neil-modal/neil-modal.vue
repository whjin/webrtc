<template>
  <view class="neil-modal" @touchmove.stop.prevent="bindTouchmove" :class="{ 'neil-modal--show': isOpen }">
    <view class="neil-modal__mask" @click="clickMask"></view>
    <view class="neil-modal__container">
      <view class="neil-modal__header" v-if="title.length > 0">{{
        title
      }}</view>
      <view class="neil-modal__content" :class="content ? 'neil-modal--padding' : ''" :style="{ textAlign: align }">
        <template v-if="content">
          <text class="modal-content">{{ content }}</text>
        </template>
        <template v-else>
          <slot />
        </template>
      </view>
      <view class="neil-modal__footer">
        <view v-if="showCancel" class="neil-modal__footer-left" @click="clickLeft" :style="{ color: cancelColor }" hover-class="neil-modal__footer-hover" :hover-start-time="20" :hover-stay-time="70">
          {{ cancelText }}
        </view>
        <view v-if="showConfirm" class="neil-modal__footer-right" @click="clickRight" :style="{ color: confirmColor }" hover-class="neil-modal__footer-hover" :hover-start-time="20" :hover-stay-time="70">
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "neil-modal",
  props: {
    title: {
      //标题
      type: String,
      default: "",
    },
    content: String, //提示的内容
    align: {
      //content 的对齐方式left/center/right
      type: String,
      default: "left",
    },
    cancelText: {
      //取消按钮的文字，默认为"取消"
      type: String,
      default: "取消",
    },
    cancelColor: {
      //取消按钮颜色
      type: String,
      default: "#333333",
    },
    confirmText: {
      //确定按钮的文字，默认为"确定"
      type: String,
      default: "确定",
    },
    confirmColor: {
      //确认按钮颜色
      type: String,
      default: "#007aff",
    },
    showCancel: {
      //是否显示取消按钮，默认为 false
      type: [Boolean, String],
      default: false,
    },
    showConfirm: {
      //是否显示确认按钮，默认为 false
      type: [Boolean, String],
      default: false,
    },
    show: {
      //是否显示模态框
      type: [Boolean, String],
      default: false,
    },
    autoClose: {
      //点击遮罩是否自动关闭弹窗
      type: [Boolean, String],
      default: false,
    },
  },
  data () {
    return {
      isOpen: false,
    };
  },
  created () {
    this.isOpen = this.show;
  },
  watch: {
    show (val) {
      this.isOpen = val;
    },
  },
  methods: {
    bindTouchmove () { },
    clickLeft () {
      setTimeout(() => {
        this.$emit("cancel");
      }, 200);
      this.closeModal();
    },
    clickRight () {
      setTimeout(() => {
        this.$emit("confirm");
      }, 200);
      this.closeModal();
    },
    clickMask () {
      if (this.autoClose) {
        this.closeModal();
      }
    },
    closeModal () {
      this.showAnimation = false;
      this.isOpen = false;
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
$bg-color-mask: rgba(0, 0, 0, 0.5); //遮罩颜色
$bg-color-hover: #f1f1f1; //点击状态颜色

.neil-modal {
  position: fixed;
  visibility: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  transition: visibility 200ms ease-in;
  &.neil-modal--show {
    visibility: visible;
  }

  &__header {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 18upx 24upx;
    line-height: 1.5;
    color: #333;
    font-size: 32upx;
    text-align: center;

    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
    }
  }

  &__content {
    color: #333;
    font-size: 28upx;
    box-sizing: border-box;
    line-height: 1.5;

    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: -1px;
      right: 0;
      height: 1px;
      transform-origin: 0 0;
      transform: scaleY(0.5);
    }
  }

  &__footer {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
    font-size: 32upx;
    display: flex;
    flex-direction: row;

    &-left,
    &-right {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 88upx;
      font-size: 28upx;
      line-height: 88upx;
      text-align: center;
      background-color: #fff;
      color: #333;
    }

    &-right {
      color: #007aff;
    }

    &-left::after {
      content: ' ';
      position: absolute;
      right: -1px;
      top: 0;
      width: 1px;
      bottom: 0;
      border-right: 1px solid #e5e5e5;
      transform-origin: 0 0;
      transform: scaleX(0.5);
    }

    &-hover {
      background-color: $bg-color-hover;
    }
  }

  &__mask {
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $bg-color-mask;
    opacity: 0;
    transition: opacity 200ms ease-in;
    &.neil-modal--show {
      opacity: 1;
    }
  }

  &--padding {
    padding: 32upx 24upx;
    min-height: 90upx;
  }
  &--show {
    .neil-modal__container,
    .neil-modal__mask {
      opacity: 1;
    }
  }
}
</style>
