<template>
  <neil-modal :show="isShow" :autoClose="true" @close="handleClose">
    <div class="container">
      <div class="header">
        <div class="title">{{ title }}</div>
        <div class="close" @click="handleClose">
          <image src="/static/images/common/close.png"></image>
        </div>
      </div>
      <div class="table-container">
        <div class="table-box">
          <div class="table-head">
            <div class="head-item" v-for="item in headers" :key="item.key" @click="handleSort(item)">
              {{ item.label }}
              <div v-if="item.sortConfig && item.sortConfig.sort" class="sort-logo" :class="item.sortConfig && item.sortConfig.sort && item.sortConfig.sortType">
                <div id="triangle-up"></div>
                <div id="triangle-down"></div>
              </div>
            </div>
          </div>
          <scroll-view scroll-y="true" class="table-scroll" @scrolltolower="handleScrolltolower">
            <div v-if="!contents.length" class="no-content">暂无数据</div>
            <div v-else class="table-main" v-for="(item, index) in contents" :key="index">
              <div class="table-content">
                <div v-for="i in headers" :key="i.key" class="table-item" style="flex: 1">
                  {{ item[i.key] }}
                </div>
              </div>
              <div class="table-line"></div>
              <!-- <image
                class="table-line"
                src="@/static/images/table/bottom.png"
              ></image> -->
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
  </neil-modal>
</template>

<script>
/**
 * 使用参考index.vue/TerminalStateDialog
 * component 表格弹框组件，支持下拉加载，可配置排序
 * props：
 * 1、isShow：是否显示弹框，由引用的组件控制（必填）
 * 2、title：标题（必填）
 * 3、headers：[ arr，表格头部（必填）
 *  {
 *    label：string，显示的文字（必填）
 *    key：与contents的key对应，用于获取contents对应的内容（必填）
 *    sortConfig：{ 排序配置（非必填）
 *        sort：boolean，是否需要排序
 *        sortType：string，排序类型，asc（升序），desc（降序）
 *    }
 *  }
 * ]
 * 4、contents：[ arr，表格内容（必填）
 *  {
 *    包含headers中的所有key，可写入其他不需要渲染但用于单列操作的变量，如id
 *  }
 * ]
 * method：
 * 1、@scrolltolower 滑动至底部的回调，用于上拉加载，参数：无
 * 2、@clickHeadItem 点击表格头部回调，可用于排序，参数：被点击的tab
 * 3、@close 点击右上角或蒙版的关闭窗口动作回调，参数：无
 */
import neilModal from "@/components/neil-modal/neil-modal.vue";

export default {
  components: {
    neilModal
  },
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "标题",
    },
    headers: {
      type: Array,
      default () {
        return [];
      }
    },
    contents: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {};
  },
  methods: {
    handleScrolltolower () {
      this.$emit('scrolltolower');
    },
    handleSort (item) {
      this.$emit('clickHeadItem', item);
    },
    handleClose () {
      this.$emit('close');
    }
  },
};
</script>

<style lang="less">
.container {
  width: 900upx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header {
    height: 61.11upx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 27.77upx;
    border-bottom: 1.38upx solid #006fe9;
    .title {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 22.22upx;
      font-weight: 500;
      color: #fff;
    }
    .close {
      height: 100%;
      width: 22upx;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        height: 22upx;
        width: 22upx;
      }
    }
  }
  .table-container {
    box-sizing: border-box;
    margin: 27.77upx 0;
    padding: 0 27.77upx;
    .table-box {
      .table-head {
        background: url(../../static/images/table/title-tr.png);
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        font-size: 16upx;
        .head-item {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 13.88upx 20.83upx;
          color: #fff;
          font-size: 18upx;
          .sort-logo {
            display: flex;
            flex-direction: column;
            #triangle-up {
              width: 0;
              height: 0;
              border-left: 3.33upx solid transparent;
              border-right: 3.33upx solid transparent;
              border-bottom: 5.55upx solid #fff;
              margin-bottom: 2upx;
            }
            #triangle-down {
              width: 0;
              height: 0;
              border-left: 3.33upx solid transparent;
              border-right: 3.33upx solid transparent;
              border-top: 5.55upx solid #fff;
            }
            &.desc {
              #triangle-up {
                border-bottom: 5.55upx solid #333;
              }
            }
            &.asc {
              #triangle-down {
                border-top: 5.55upx solid #333;
              }
            }
          }
        }
      }
      .table-scroll {
        width: 100%;
        height: 380upx;
        color: #fff;
        .table-main {
          display: flex;
          flex-direction: column;
          .table-content {
            display: flex;
            align-items: center;
            .table-item {
              padding: 13.88upx 0;
              display: flex;
              justify-content: center;
              font-size: 14upx;
            }
          }
          .table-line {
            display: flex;
            width: 100%;
            height: 2upx;
            background: #00c6ff;
            opacity: 0.3;
          }
        }
        .no-content {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>