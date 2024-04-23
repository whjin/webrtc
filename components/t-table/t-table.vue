<template>
  <view class="t-table" :style="{ 'border-width': border + 'px', 'border-color': borderColor }">
    <slot />
  </view>
</template>

<script>
export default {
  props: {
    border: {
      type: String,
      default: ''
    },
    borderColor: {
      type: String,
      default: ''
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  provide () {
    return {
      table: this
    };
  },
  data () {
    return {
      // 点击表头复选框
      checkAll: false
    };
  },
  created () {
    this.childrens = [];
    this.index = 0;
  },
  methods: {
    fire (e, index, len) {
      let childrens = this.childrens;
      if (index == 0) {
        this.checkAll = true;
        childrens.map((vm, index) => {
          vm.checkboxData.checked = e;
          return vm;
        });
      } else {
        this.checkAll = false;
        let isAll = childrens.find((n, ids) => ids != 0 && !n.checkboxData.checked);
        childrens[0].checkboxData.checked = isAll ? false : true;
      }

      let fireArr = [];
      for (let i = 0; i < childrens.length; i++) {
        if (childrens[i].checkboxData.checked && i != 0) {
          fireArr.push(childrens[i].checkboxData.value - 1);
        }
      }
      this.$emit('change', {
        detail: fireArr
      });
    }
  }
};
</script>

<style scoped>
.t-table {
  width: 100%;
  border-left: none;
  border-top: none;
  box-sizing: border-box;
}

.t-table >>> t-tr {
  display: flex;
}

.t-table >>> t-tr:nth-child(2n) {
  /* background: #f5f5f5; */
}

/* #ifdef H5 */
.t-table >>> .t-tr:nth-child(2n) {
  /* background: #f5f5f5; */
}
/* #endif */
</style>
