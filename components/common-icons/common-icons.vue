<template>
  <div :class="iconType" :style="iconFontStyle" class="iconfont" @click="_onClick" ></div>
</template>

<script>
export default {
  name: 'CommonIcons',
  props: {
    iconType: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#333'
    },
    size: {
      type: [Number, String],
      default: 16
    },
    iconStyle: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  computed: {
    iconFontStyle() {
      let style = {
        color: this.color,
        fontSize: this.size + 'upx'
      }
      if(this.iconStyle) {
        style = Object.assign({}, style, this.iconStyle)
      }
      return style;
    }
  },
  methods: {
    _onClick () {
      this.$emit('click');
    }
  }
}
</script>

<style>
</style>
