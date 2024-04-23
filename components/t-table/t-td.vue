<template>
  <view class="t-td" :style="{ 'border-width': thBorder + 'px','border-color':borderColor ,'font-size':fontSize+'upx' ,'color':color,'justify-content':tdAlignCpd}">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    align: String
  },
  data () {
    return {
      thBorder: '1',
      borderColor: '#d0dee5',
      fontSize: '14',
      color: '#555c60',
      tdAlign: 'center'
    };
  },
  inject: ['table', 'tr'],

  created () {
    this.thBorder = this.table.border;
    this.borderColor = this.table.borderColor;
    this.fontSize = this.tr.fontSize;
    this.color = this.tr.color;
    if (this.align) {
      this.tdAlign = this.align;
    } else {
      this.tdAlign = this.tr.align;
    }
  },
  computed: {
    tdAlignCpd () {
      let nameAlign = '';
      switch (this.tdAlign) {
        case 'left':
          nameAlign = 'flex-start';
          break;
        case 'center':
          nameAlign = 'center';
          break;
        case 'right':
          nameAlign = 'flex-end';
          break;
        default:
          nameAlign = 'center';
          break;
      }
      return nameAlign;
    }
  }
};
</script>

<style>
.t-td {
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  padding: 8upx;
  color: #555c60;
  font-size: 18upx;
}
</style>
