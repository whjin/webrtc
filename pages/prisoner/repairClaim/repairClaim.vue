<template>
  <view>
    <view class="main-area">
      <view class="uni-flex page-title">
        <text>物品报修申领</text>
      </view>
      <view class="uni-flex uni-flex-item">
        <view class="uni-flex uni-column page-menu-area">
          <view v-for="item in tabConfig" :key="item.key" class="uni-flex uni-column page-menu" :class="{'page-menu-activate' : currentGoodType == item.type}" @click="switchPage(item.type)">
            <common-icons iconType="icondispose" size="42" color="#FFFFFF" />
            <text style="line-height: 20.83upx; margin-top: 13.19upx;">{{ item.tabName }}</text>
          </view>
        </view>
        <view class="page-vertical-divider"></view>
        <view class="uni-flex uni-column uni-flex-item">
          <scroll-view scroll-y="true" class="uni-flex uni-row" style="width: 1140upx; flex-direction: row; height: 500upx;" @scrolltolower="handleGoodsListScrolltolower">
            <view class="uni-flex" style="flex-wrap: wrap;">
              <view class="symptoms" v-for="item in goodsList" :key="item.id">
                <view class="uni-flex" style="margin-top: 20upx; margin-left: 25.69upx; float: left;">
                  <image :src="item.picUrl" style="width: 96.52upx; height: 102.75upx;"></image>
                </view>
                <scroll-view class="uni-flex text-describe text-describe-name" scroll-x>名称：{{ item.goodName }}</scroll-view>
                <scroll-view class="uni-flex text-describe" scroll-x>状态：{{ item.statusName }}</scroll-view>
                <view class="uni-flex button button-repair" :class="{'button-disable-repair' : item.operateStatus == 0 && (item.status == 0 || item.status == 1 || item.status == 2 || item.status == 3) }" @click="openConfirmModal(item.id, false)">
                  <text style="
                      line-height: 18.05upx;
                      font-size: 18.05upx;
                      margin-top: 9.72upx;
                      width: 100%;
                    ">{{ item.operateStatus == 0 ? '已' + typeName : typeName }}</text>
                </view>
                <view class="uni-flex button button-repair" :class="{'button-disable-repair' : !item.operateStatus && item.status !== 3}" @click="openConfirmModal(item.rid, true)">
                  <text style="
				              line-height: 18.05upx;
				              font-size: 18.05upx;
				              margin-top: 9.72upx;
				              width: 100%;
				            ">确认</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 提交登记 -->
      <neil-modal :show="isShowConfirmModal" @close="closeConfirmModal">
        <view class="uni-flex uni-column" style="width: 500upx; height: 400upx;">
          <view class="uni-flex uni-flex-item uni-column" style="justify-content: center; align-items: center;">
            <text style="font-size: 25upx; font-family: 400;">{{ isConfirmRecord ? '是否确认本次处理结果' : `确认提交物品${typeName}` }}？</text>
          </view>
          <view class="uni-flex" style="justify-content: center; height: 100upx;">
            <view class="page-button-empty" style="margin-right: 60upx;" @click="closeConfirmModal">取消</view>
            <view class="page-button" @click="submitConfirmReg">确定</view>
          </view>
        </view>
      </neil-modal>
    </view>
  </view>
</template>

<script>
import Api from '@/common/api.js';
import { mapState } from "vuex";
import neilModal from "@/components/neil-modal/neil-modal.vue";
export default {
  components: {
    neilModal
  },
  data () {
    return {
      isDataLoading: false,
      goodStatusConfig: [
        {
          key: 0, // 申请
          name: '待处理'
        },
        {
          key: 1, // 确认通过
          name: '待处理'
        },
        {
          key: -1, // 管教拒绝
          name: '正常'
        },
        {
          key: 2, // 审批通过
          name: '待处理'
        },
        {
          key: -2, // 审批拒绝
          name: '正常'
        },
        {
          key: 3, // 已处理
          name: '已处理'
        },
        {
          key: -3, // 拒绝处理
          name: '正常'
        }
      ],
      // tab配置
      tabConfig: [
        {
          tabName: '物品报修',
          type: 1
        },
        {
          tabName: '物品申领',
          type: 0
        }
      ],
      // 当前选择处理的类型 1：报修， 0：申领
      currentGoodType: 1,
      // 确认弹框是否用于确认记录
      isConfirmRecord: false,
      // 被选中的物品
      selectedGoods: {
        goodId: ''
      },
      // 确认记录ID
      selectedRecordId: '',
      // 分页参数
      goodsPageParam: {
        pageIndex: 1,
        pageSize: 16
      },
      // 物品总数
      goodsTotal: 999,
      isShowConfirmModal: false,
      // 物品列表
      goodsList: []
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: state => state.app.personInfo
    }),
    // 当前处理物品的类型 0：申领 1：报修
    typeName () {
      let typeName = this.currentGoodType == 1 ? '报修' : '申领';
      return typeName;
    },
    // 监室ID
    roomId () {
      return uni.getStorageSync('terminalInfo').roomId;
    }
  },
  created () {
    // 获取物品列表
    this.getGoodsList();
    // 开启倒计时
    this.$parent.countTimer();
  },
  destroyed () {
  },
  methods: {
    // 获取物品列表
    async getGoodsList () {
      if (this.isDataLoading) {
        return;
      }
      this.isDataLoading = true;
      let params = {
        data: {
          roomId: this.roomId,
          goodType: this.currentGoodType
        },
        pageParam: this.goodsPageParam
      };
      let res = await Api.apiCall('post', Api.prisoner.repairClaim.getList, params, true);
      if (res.state.code == 200) {
        this.isDataLoading = false;
        if (!res.data.length) {
          return this.$parent.handleShowToast("暂无数据", "center");
        }
        let goodsData = res.data;
        goodsData.map(item => {
          let statusItem = this.goodStatusConfig.find(i => i.key == item.status);
          item.statusName = (statusItem && (item.operateStatus == 0) && statusItem.name) || '正常';
          return item;
        });
        if (this.goodsPageParam.pageIndex == 1) {
          this.goodsList = goodsData;
        } else {
          this.goodsList = this.goodsList.concat(goodsData);
        }
        this.goodsTotal = (res.page && res.page.total) || 0;
      }
    },
    // 提交物品请求
    async handleRepairClaim () {
      let params = Object.assign({}, this.selectedGoods, {
        rybh: this.personInfo.rybh,
        roomId: this.roomId
      });
      let res = await Api.apiCall('post', Api.prisoner.repairClaim.save, params, true);
      if (res.state.code == 200) {
        this.$parent.handleShowToast("操作成功", "center");
        // 前端修改状态 以免重新获取第一页数据导致用户无法看到被操作的物品
        this.goodsList.forEach(item => {
          if (item.id == this.selectedGoods.goodId) {
            item.operateStatus = 0;
            item.status = 0;
            item.statusName = '待处理';
          }
        });
        this.resetSelectedGoods();
      }
    },
    // 确认处理结果
    async confirmRecord () {
      let params = {
        id: this.selectedRecordId,
        rybh: this.personInfo.rybh
      };
      let res = await Api.apiCall('get', Api.prisoner.repairClaim.confirmRecord, params, true);
      if (res.state.code == 200) {
        this.$parent.handleShowToast("操作成功", "center");
        // 前端修改状态 以免重新获取第一页数据导致用户无法看到被操作的物品
        this.goodsList.forEach(item => {
          if (item.rid == this.selectedRecordId) {
            item.operateStatus = 1;
            item.statusName = '正常';
          }
        });
        this.resetSelectedGoods();
      }
    },
    // 切换tab
    switchPage (type) {
      this.setGoodsPageParam(1, 16);
      this.currentGoodType = type;
      this.getGoodsList();
    },
    // 打开确认弹框
    openConfirmModal (id, isConfirmRecord) {
      this.isConfirmRecord = isConfirmRecord;
      if (isConfirmRecord) {
        this.selectedRecordId = id;
      } else {
        this.selectedGoods.goodId = id;
      }
      this.isShowConfirmModal = true;
    },
    // 关闭确认弹框
    closeConfirmModal () {
      this.isShowConfirmModal = false;
    },
    // 确认提交
    submitConfirmReg () {
      if (this.isConfirmRecord) {
        this.confirmRecord();
      } else {
        this.handleRepairClaim();
      }
      this.closeConfirmModal();
    },
    // 重置被选中物品
    resetSelectedGoods () {
      this.selectedGoods = {
        goodId: ''
      };
      this.selectedRecordId = '';
      this.isConfirmRecord = false;
    },
    // 设置分页参数
    setGoodsPageParam (pageIndex, pageSize) {
      this.goodsPageParam = {
        pageIndex,
        pageSize
      };
    },
    // 滚动加载
    handleGoodsListScrolltolower () {
      // 已获取所有数据
      if (this.goodsList.length >= this.goodsTotal) {
        return this.$parent.handleShowToast("暂无更多数据", "center");
      }
      this.goodsPageParam.pageIndex += 1;
      this.getGoodsList();
    }
  },
};
</script>

<style scoped>
.button-repair {
  margin-left: 8.6upx;
  margin-top: 11.8upx;
  background-color: #007aff;
  float: left;
  width: 62.9upx;
  height: 36upx;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}
.button-disable-repair {
  background-color: #ccc;
  pointer-events: none;
}
.symptoms {
  background-image: url('data:image/png;base64,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');
  background-size: 100% 100%;
  width: 285upx;
  height: 140.83upx;
  color: #bbbbbb;
  text-align: center;
  line-height: 59.02upx;
}
.text-describe {
  width: 133upx;
  font-size: 16.66upx;
  line-height: 15.97upx;
  margin-top: 10.63upx;
  margin-left: 12upx;
  text-align: left;
  white-space: nowrap;
  color: #ffffff;
  float: left;
}
.text-describe-name {
  margin-top: 30upx;
}
</style>
