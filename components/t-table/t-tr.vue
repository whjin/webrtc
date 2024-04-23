<template>
  <view :class="['t-tr', {'t-tr-index': trIndex == 1}]">
    <view v-if="isCheck" class="t-check-box" :style="{ 'border-width': thBorder + 'upx' ,'border-color':borderColor}">
      <checkbox-group @change="checkboxChange">
        <checkbox :value="checkboxData.value + ''" :checked="checkboxData.checked" />
      </checkbox-group>
    </view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    fontSize: String,
    color: String,
    align: String,
    trIndex: {
      type: Number,
      default: 0
    },
  },
  inject: ['table'],
  provide () {
    return {
      tr: this
    };
  },
  data () {
    return {
      isCheck: false,
      checkboxData: {
        value: 0,
        checked: false
      },
      thBorder: '1',
      borderColor: '#DCDCDC',
    };
  },
  created () {
    this.isCheck = this.table.isCheck;
    this.thBorder = this.table.border;
    this.borderColor = this.table.borderColor;
    this.table.childrens.push(this);
    this.checkboxData.value = this.table.index++;
  },
  methods: {
    checkboxChange (e) {
      this.checkboxData.checked = !this.checkboxData.checked;
      this.table.childrens[this.checkboxData.value] = this;
      this.table.fire(e.detail.value[0] ? true : false, this.checkboxData.value, this.table.index);
    },
  }
};
</script>

<style>
.t-tr {
  width: 100%;
  display: flex;
}
.t-tr-index {
  background: url(../../static/images/table/title-tr.png);
  background-size: 100% 100%;
}
.t-tr t-th,
.t-tr t-td {
  display: flex;
  flex: 1;
}

.t-tr .t-check-box {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50upx;
  padding-left: 8upx;
  color: #fff;
}

.t-tr .t-check-box checkbox {
  padding: 1upx 1upx 10upx 10upx;
  transform: scale(0.9);
}
</style>
