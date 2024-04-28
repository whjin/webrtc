<template>
  <div class="shopping-container">
    <div class="shopping-wrapper">
      <div class="shopping-header">
        <div class="shopping-header-left">
          <div class="shopping-account">
            余额：
            <text>{{ accountBalance }}</text>
          </div>
        </div>
        <div class="shopping-header-right">
          <div class="consume" @touchstart.stop="openShoppingRecord">
            <common-icons iconType="iconconsume" size="48" color="#fff" />
          </div>
          <div class="cart" @touchstart.stop="openShoppingCart">
            <common-icons iconType="iconshoppingcart" size="48" color="#fff" />
            <div class="quantity">
              <text :style="{ fontSize: fontSize + 'upx' }">{{
                quantity
              }}</text>
            </div>
          </div>
        </div>
      </div>
      <div class="shopping-content">
        <div class="shopping-menu">
          <div class="shopping-menu-item shopping-menu-active">
            <common-icons iconType="iconother" size="28" style="color: 35fffa" />
            <text>全部商品</text>
          </div>
        </div>
        <div class="shopping-goods-container">
          <scroll-view scroll-y="true" class="shopping-goods-scroll">
            <div class="shopping-goods-box">
              <div class="shopping-goods-item shopping-img" :class="{ 'shopping-select-img': item.goodsId == goodsId }"
                v-for="item in commonGoodsList" :key="item.goodsId" @click="handleSelectGoods(item)">
                <div class="goods-img">
                  <image :src="item.imageUrl ? item.imageUrl : defaultUrl" lazy-load></image>
                </div>
                <div class="goods-name">{{ item.goodsName }}</div>
                <div class="purchase">
                  <div class="price">￥{{ item.price }}</div>
                  <div class="count">
                    <div class="minus-btn" :class="{ 'minus-disabled': item.disabled }" @click="handleMinusGoods(item)">
                      <common-icons iconType="iconminus" size="18" color="#fff" />
                    </div>
                    <div class="num">{{ item.selectNum }}</div>
                    <div class="plus-btn" @touchstart.stop="handlePlusGoods(item)">
                      <common-icons iconType="iconplus" size="18" color="#fff" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <neil-modal :show="showShoppingCart" @close="closeModal('ShoppingCart')">
        <div class="cart-modal-box">
          <div class="modal-header">
            <view class="modal-title">购物车</view>
            <div class="modal-close" @touchstart.stop="closeModal('ShoppingCart')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="cart-modal-content">
            <div class="cart-table-box">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in cartColumns" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="cart-table-scroll">
                <div class="table-content" v-for="(item, index) in cartGoodsList" :key="index">
                  <div class="cart-table-item" style="flex: 2">
                    {{ item.goodsName }}
                  </div>
                  <div class="cart-table-item" style="flex: 1; color: #fd0404">
                    ￥{{ item.price }}
                  </div>
                  <div class="cart-table-item" style="flex: 2">
                    <div class="count">
                      <div class="minus-btn" :class="{ 'minus-disabled': item.disabled }"
                        @click="handleMinusCart(item, index)">
                        <common-icons iconType="iconminus" size="18" color="#fff" />
                      </div>
                      <div class="num">{{ item.selectNum }}</div>
                      <div class="plus-btn" @touchstart.stop="handlePlusCart(item, index)">
                        <common-icons iconType="iconplus" size="18" color="#fff" />
                      </div>
                    </div>
                  </div>
                  <div class="cart-table-item" style="flex: 1">
                    {{ item.selectSize }}
                  </div>
                  <div class="cart-table-item" style="flex: 1">
                    ￥{{ (item.price * item.selectNum).toFixed(2) }}
                  </div>
                  <div class="cart-table-item" style="flex: 2" @click="handleDeleteGoods(item, index)">
                    <div class="delete-btn">删除</div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
          <div class="cart-modal-bottom">
            <div class="cart-total">
              商品合计：<text>{{ cartTotal }}</text>元
            </div>
            <div class="cart-settlement">
              <div class="clearup-btn" @click="handleClearCart">
                清空所有商品
              </div>
              <div class="settlement-btn" @click="handleSettleCart">结算</div>
            </div>
          </div>
        </div>
      </neil-modal>
      <neil-modal :show="showShoppingRecord" @close="closeModal('ShoppingRecord')">
        <div class="record-modal-box">
          <div class="modal-header">
            <view class="modal-title">消费记录</view>
            <div class="modal-close" @touchstart.stop="closeModal('ShoppingRecord')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="record-modal-content">
            <div class="record-form-box">
              <div class="record-select">
                <e-picker mode="date" class="picker-img" :isInFullPage="false" :showValue="startDate"
                  @change="selectStartDate">
                  <div class="record-date">{{ startDate }}</div>
                </e-picker>
                <div class="divider-line">-</div>
                <e-picker mode="date" class="picker-img" :isInFullPage="false" :showValue="endDate"
                  @change="selectEndDate">
                  <div class="record-date">{{ endDate }}</div>
                </e-picker>
              </div>
              <div class="record-button">
                <div class="btn-query" @click="handleRecordQuery">查找记录</div>
              </div>
            </div>
            <div class="record-table-box">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in orderColumns" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="record-table-scroll" @scrolltolower="handleRecorListScrolltolower">
                <div class="table-content" v-for="(item, index) in orderRecordList" :key="item.orderNo">
                  <div class="record-table-item" style="flex: 2">
                    {{ item.orderNo }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    ￥{{ item.monetary }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.gmtCreate | dateFormatFilter }}
                  </div>
                  <div class="record-table-item" :class="{
                    green: item.statusColor == 'green',
                    blue: item.statusColor == 'blue',
                    red: item.statusColor == 'red',
                  }" style="flex: 2">
                    {{ item.statusName }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    <div class="confirm-btn" :class="{
                      disable: !item.canConfirm || item.finishConfirm == 1,
                    }" @click="openRecordDetails(item, index)">
                      {{ item.finishConfirm == 1 ? "已确认" : "确认收货" }}
                    </div>
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    <div class="check-btn" @click="openRecordDetails(item, index)">
                      查看详情
                    </div>
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    <scroll-view scroll-x>
                      {{ item.commisRemark }}
                    </scroll-view>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </neil-modal>
      <neil-modal :show="showRecordDetails" @close="closeRecordDetailsModal">
        <div class="record-modal-box" style="height: 600upx">
          <div class="modal-header">
            <view class="modal-title">消费记录详情</view>
            <div class="modal-close" @click="closeRecordDetailsModal">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="record-modal-content">
            <div class="record-table-box">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in detailsColumns" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="record-table-scroll">
                <div class="table-content" v-for="(item, index) in recordDetailsList" :key="item.goodsId">
                  <div class="record-table-item" style="flex: 2">
                    {{ item.goodsName }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.saleCount }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    ￥{{ item.salePrice }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    ￥{{ (item.saleCount * item.salePrice) | keepTwoDecimal }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.gmtCreate | dateFormatFilter }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.bookStatus == 1 ? "-" : item.approvalCount || 0 }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    <div class="confirm-btn" :class="{
                      disable:
                        !curRecordDetails.canConfirm ||
                        curRecordDetails.finishConfirm == 1 ||
                        item.confirmStatus == 1 ||
                        item.bookStatus == 1,
                    }" @click="handleConfirmGoods(item)">
                      {{ item.confirmStatus == 1 ? "已确认" : "确认收货" }}
                    </div>
                  </div>
                  <div class="record-table-item" style="flex: 2; position: relative; overflow: unset">
                    <xfl-select :list="confirmTypeList" :clearable="false" :placeholder="'请选择备注类型'" widthStyle="160"
                      :rowIndex="index" :disabled="!curRecordDetails.canConfirm ||
                        curRecordDetails.finishConfirm == 1 ||
                        item.confirmStatus == 1 ||
                        item.bookStatus == 1
                        " @change="selectConfirmType"></xfl-select>
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    <input v-model="item.remarks" type="text" class="tips-input" placeholder="请输入备注" :disabled="!curRecordDetails.canConfirm ||
                      curRecordDetails.finishConfirm == 1 ||
                      item.confirmStatus == 1 ||
                      item.bookStatus == 1
                      " />
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </neil-modal>
      <neil-modal :show="showOrderInit" @close="closeModal('OrderInit')">
        <div class="order-modal-box">
          <view class="modal-header">
            <view class="modal-title">温馨提示</view>
            <div class="modal-close" @touchstart.stop="closeModal('OrderInit')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="order-modal-content">
            <div v-if="showSuccess" class="modal-orderInit">
              <common-icons iconType="iconsuccess" size="118" color="#fff" />
              <text class="order-tip">购买成功</text>
            </div>
            <div v-if="!showSuccess" class="modal-orderInit">
              <common-icons iconType="iconfail" size="100" color="#fff" />
              <text class="order-tip">{{ errTips }}</text>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 商品尺码弹框 -->
      <neil-modal :show="showGoodsSizeModal">
        <div class="size-modal-box">
          <view class="modal-header">
            <view class="modal-title">选择商品尺码</view>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="size-modal-content">
            <div class="size-box">
              <div class="size-item" :class="{ 'size-item-select': selectSizeIdx == index }"
                v-for="(size, index) in goodsSizeInfo.size" :key="size" @click="selectGoodsSize(size, index)">
                {{ size }}
              </div>
            </div>
            <div class="size-tips">
              温馨提示：如果需要修改尺码，请重新添加该商品！
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 购物提示弹框 -->
      <neil-modal :show="showCrossMonthModal">
        <div class="common-modal-container">
          <view class="modal-header">
            <view class="modal-title">温馨提示</view>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="common-modal-content">
            <text style="color: #35fffa">须知：由于审批和拣货时间，本次购物金额可能会结算到下个月的500元购物额度。</text>
          </div>
          <div class="common-modal-button">
            <div class="btn-confirm" @touchstart.stop="closeModal('CrossMonthModal')">
              确定
            </div>
          </div>
        </div>
      </neil-modal>
      <recognition-dialogs ref="recognitionDialogs" useFor="shopping" :regConfig="regConfig"
        :isShow="showRecognitionDialogs" @fingerRecognitionSuccess="fingerRecognitionSuccess"
        @faceRecognitionSuccess="faceRecognitionSuccess" @close="closeRecognitionDialogs"></recognition-dialogs>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { mapState } from "vuex";
import {
  isNullStr,
  unique,
  formatFloat,
  dateFormat,
} from "@/common/utils/util.js";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import bottomBar from "@/components/bottom-bar/bottom-bar.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import cartColumns from "@/static/mock/cartColumns.json";
import orderColumns from "@/static/mock/orderColumns.json";
import detailsColumns from "@/static/mock/detailsColumns.json";

export default {
  components: {
    neilModal,
    bottomBar,
    xflSelect,
  },
  data() {
    return {
      // 错误提示
      errTips: "",
      // 账户余额
      accountBalance: 0,
      // 商品数量
      quantity: 0,
      // 人员档案信息
      prisonerInfo: {},
      // 所有商品信息
      allGoodsList: [],
      // 当前商品列表
      commonGoodsList: [],
      pageSize: 15,
      // 默认商品图片
      defaultUrl: "/static/images/shopping/default.png",
      // 购物车弹框
      showShoppingCart: false,
      // 购物车表头
      cartColumns: cartColumns,
      // 购物车列表
      cartGoodsList: [],
      // 选择商品ID
      goodsId: "",
      // 商品尺码弹框
      showGoodsSizeModal: false,
      // 商品尺码信息
      goodsSizeInfo: {},
      // 选择商品尺码
      selectSize: "",
      // 选择商品尺码索引
      selectSizeIdx: "",
      // 商品总价
      cartTotal: 0,
      // 结算弹框
      showOrderInit: false,
      // 结算成功弹框
      showSuccess: true,
      // 消费记录弹框
      showShoppingRecord: false,
      // 记录详情弹框
      showRecordDetails: false,
      // 开始时间
      startDate: "",
      // 结束时间
      endDate: "",
      // 消费记录表头
      orderColumns: orderColumns,
      // 消费记录列表
      orderRecordList: [],
      // 记录详情表头
      detailsColumns: detailsColumns,
      // 备注类型列表
      confirmTypeList: [],
      // 记录详情列表
      recordDetailsList: [],
      // 当前详情索引
      curRecordDetails: {},
      // 消费记录分页参数
      orderPageParams: {
        pageIndex: 1,
        pageSize: 15,
      },
      // 消费记录总数
      orderRecordTotal: 999,
      // 所有购物车暂存列表
      saveCartList: [],
      // 购物车暂存信息
      saveCartItem: {},
      // 购物验证信息
      regConfig: {
        regName: "",
        rybh: "",
      },
      // 显示验证弹框
      showRecognitionDialogs: false,
      // 是否在购物时间
      isShoppingTime: true,
      // 购物跨月审批弹框
      showCrossMonthModal: false,
      // 禁止重复提交
      isRepeatState: false,
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
    // 数量字体
    fontSize() {
      return this.count > 99 ? 16 : this.count > 9 ? 20 : 24;
    },
  },
  filters: {
    dateFormatFilter(val) {
      if (!val) return "无";
      return dateFormat("YYYY-MM-DD", new Date(val));
    },
    keepTwoDecimal(val) {
      let value = Number(val);
      if (!value) return "-";
      return value.toFixed(2);
    },
  },
  created() {
    // 购物跨月审批提示
    this.openCrossMonthModal();
    // 获取商品列表
    this.getPrisonInfo(this.personInfo.rybh);
  },
  mounted() {
    // 开启倒计时
    this.$parent.countTimer();
    // 获取备注类型列表
    this.getConfirmTypeList();
  },
  destroyed() {
    // 暂存购物车列表
    // this.saveCartInfo();
  },
  methods: {
    // 购物跨月审批提示
    openCrossMonthModal() {
      if (this.personInfo.hasOwnProperty("dayOfMonth")) {
        this.showCrossMonthModal = true;
      }
    },
    // 获取人员信息
    async getPrisonInfo(code) {
      let res = await Api.apiCall(
        "get",
        Api.index.getPrisonInfoByCode + `${code}`,
        null
      );
      if (res.state.code == 200) {
        this.prisonerInfo = res.data;
        let { money, name, rybh, roomno, roomSex } = this.prisonerInfo;
        this.accountBalance = money
          ? formatFloat(money, 2)
          : 0;
        this.regConfig.callName = name;
        this.regConfig.rybh = rybh;
        let params = { roomno, roomSex, rybh };
        // 商品列表请求参数
        let goodParams = {
          data: {
            ...params,
          },
        };
        // 获取商品列表
        this.getGoodsList(goodParams);
      }
    },
    // 获取商品列表
    async getGoodsList(params) {
      let res = await Api.apiCall(
        "post",
        Api.index.getShoppingGoodsInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (res.data == "NoShopping") {
          this.isShoppingTime = false;
          this.showTips(false, "未到开放购物时间！");
          return;
        }
        if (Array.isArray(res.data) && res.data.length) {
          this.commonGoodsList = res.data;
        }
      }
    },
    // 选择商品
    handleSelectGoods(item) {
      this.goodsId = item.goodsId;
    },
    // 减少商品数量
    handleMinusGoods(item) {
      if (item.selectNum > 0) {
        item.disabled = false;
        item.selectNum--;
        this.quantity--;
        this.cartGoodsList.map((list, index) => {
          if (list.goodsId == item.goodsId) {
            list.selectNum = item.selectNum;
            if (!list.selectNum) {
              this.cartGoodsList.splice(index, 1);
              if (list.hasOwnProperty("selectSize")) {
                this.resetGoodsSize(list.goodsId);
              }
            }
          }
        });
      } else {
        item.disabled = true;
      }
    },
    // 重置商品尺码信息
    resetGoodsSize(id) {
      this.commonGoodsList.map((list) => {
        if (list.goodsId == id) {
          delete list.selectSize;
        }
      });
    },
    // 增加商品数量
    handlePlusGoods(item) {
      item.disabled = false;
      if (!item.goodsUpperLimit) {
        // 不限购商品
        this.plusGoodsHandler(item);
      } else {
        if (item.selectNum < item.goodsUpperLimit) {
          // 限购商品
          this.plusGoodsHandler(item);
        } else {
          this.showTips(false, `该商品限购${item.goodsUpperLimit}件`);
          return;
        }
      }
    },
    // 增加商品数据公共方法
    plusGoodsHandler(item) {
      item.selectNum++;
      this.quantity++;
      this.goodsSizeInfo = {};
      this.selectSize = "";
      this.selectSizeIdx = "";
      if (item.hasOwnProperty("size") && !item.hasOwnProperty("selectSize")) {
        this.goodsSizeInfo = item;
        this.showGoodsSizeModal = true;
      } else {
        this.plusGoodsCartHandler(item);
      }
    },
    // 选择商品尺码
    selectGoodsSize(size, index) {
      this.selectSize = size;
      this.selectSizeIdx = index;
      this.goodsSizeInfo.selectSize = this.selectSize;
      this.plusGoodsCartHandler(this.goodsSizeInfo);
      this.showGoodsSizeModal = false;
    },
    // 增加商品购物车公共方法
    plusGoodsCartHandler(item) {
      if (this.cartGoodsList.length) {
        this.cartGoodsList.map((list, index) => {
          if (list.goodsId == item.goodsId) {
            this.cartGoodsList.splice(index, 1, item);
          } else {
            this.cartGoodsList.push(item);
          }
        });
      } else {
        this.cartGoodsList.push(item);
      }
      this.cartGoodsList = unique(this.cartGoodsList);
    },
    // 减少购物车商品数量
    handleMinusCart(item, index) {
      if (item.selectNum > 1) {
        item.disabled = false;
        item.selectNum--;
        this.quantity--;
        let minusGoods = this.cartTotal - this.cartGoodsList[index].price;
        this.cartTotal = formatFloat(minusGoods, 2);
        // 减少购物车商品数量
        this.modifyCartQuantity(item);
      } else {
        this.showTips(false, "该商品不能再减了！");
        return;
      }
    },
    // 增加购物车商品数量
    handlePlusCart(item, index) {
      item.disabled = false;
      if (!item.goodsUpperLimit) {
        // 不限购商品
        this.plusCartHandler(item, index);
      } else {
        if (item.selectNum < item.goodsUpperLimit) {
          // 限购商品
          this.plusCartHandler(item, index);
        } else {
          this.showTips(false, `该商品限购${item.goodsUpperLimit}件`);
          return;
        }
      }
    },
    // 增加购物车商品数量公共方法
    plusCartHandler(item, index) {
      item.selectNum++;
      this.quantity++;
      let plusGoods = this.cartTotal + Number(this.cartGoodsList[index].price);
      this.cartTotal = formatFloat(plusGoods, 2);
      // 增加购物车商品数量
      this.modifyCartQuantity(item);
    },
    // 打开购物车
    openShoppingCart() {
      if (!this.isShoppingTime) {
        this.showTips(false, "未到开放购物时间！");
        return;
      }
      this.cartTotal = 0;
      this.showShoppingCart = true;
      this.cartGoodsList.map((item) => {
        item.disabled = false;
        this.cartTotal += item.price * item.selectNum;
      });
      this.cartTotal = formatFloat(this.cartTotal, 2);
    },
    // 删除商品
    handleDeleteGoods(item, index) {
      this.quantity = this.quantity - this.cartGoodsList[index].selectNum;
      let minusPrice =
        this.cartGoodsList[index].price * this.cartGoodsList[index].selectNum;
      let minusGoods = this.cartTotal - minusPrice;
      this.cartTotal = formatFloat(minusGoods, 2);
      this.cartGoodsList[index].selectNum = 0;
      this.cartGoodsList.splice(index, 1);
      this.commonGoodsList.map((list) => {
        if (list.goodsId == item.goodsId) {
          list.selectNum = 0;
          if (list.hasOwnProperty("selectSize")) {
            delete list.selectSize;
          }
        }
      });
    },
    // 清空购物车
    handleClearCart() {
      if (!this.cartGoodsList.length) {
        this.$parent.handleShowToast("购物车为空", "center");
        return;
      }
      // 初始化商品信息
      this.initGoodsInfo();
      // 清空暂存购物车
      uni.removeStorageSync("saveCartList");
    },
    // 初始化商品信息
    initGoodsInfo() {
      this.commonGoodsList.map((list) => {
        list.selectNum = 0;
        if (list.hasOwnProperty("selectSize")) {
          delete list.selectSize;
        }
      });
      this.cartGoodsList = [];
      this.cartTotal = 0;
      this.quantity = 0;
    },
    // 增加减少购物车商品数量
    modifyCartQuantity(item) {
      this.commonGoodsList.map((list, index) => {
        if (list.goodsId == item.goodsId) {
          this.commonGoodsList.splice(index, 1, item);
        }
      });
    },
    // 获取暂存购物车列表
    getCartInfo() {
      // 购物车缓存不为空
      if (!isNullStr(uni.getStorageSync("saveCartList"))) {
        let saveCartList = uni.getStorageSync("saveCartList");
        let allGoodsList = [...this.commonGoodsList];
        // 所有商品不为空
        if (allGoodsList.length) {
          saveCartList.map((list) => {
            if (list.goodsId == this.prisonerInfo.rybh) {
              this.cartGoodsList = list.cartList;
              let goodsIdList = allGoodsList.map((goods) => goods.goodsId);
              this.cartGoodsList.map((item, index) => {
                if (!goodsIdList.includes(item.goodsId)) {
                  this.cartGoodsList.splice(index, 1);
                }
              });
              this.cartGoodsList.map((item) => {
                this.quantity += item.selectNum;
              });
              this.commonGoodsList.map((list) => {
                this.cartGoodsList.map((item) => {
                  if (list.goodsId == item.goodsId) {
                    list.selectNum = item.selectNum;
                    if (item.hasOwnProperty("selectSize")) {
                      list.selectSize = item.selectSize;
                    }
                  }
                });
              });
            }
          });
        } else {
          // 所有商品为空
          this.cartGoodsList = [];
          this.quantity = 0;
        }
      }
    },
    // 暂存购物车列表
    saveCartInfo() {
      // 购物车缓存为空
      if (isNullStr(uni.getStorageSync("saveCartList"))) {
        // 购物车不为空
        if (this.cartGoodsList.length) {
          this.saveCartItem = {
            id: this.prisonerInfo.rybh,
            cartList: this.cartGoodsList,
          };
          this.saveCartList.push(this.saveCartItem);
        } else {
          // 购物车为空，清空缓存
          uni.removeStorageSync("saveCartList");
        }
      } else {
        // 购物车缓存不为空
        this.saveCartList = uni.getStorageSync("saveCartList");
        // 购物车不为空
        if (this.cartGoodsList.length) {
          this.saveCartItem = {
            id: this.prisonerInfo.rybh,
            cartList: this.cartGoodsList,
          };
          let cardIdList = this.saveCartList.map((item) => item.goodsId);
          this.saveCartList.map((list, index) => {
            if (list.goodsId == this.prisonerInfo.rybh) {
              // 替换该人员缓存
              this.saveCartList.splice(index, 1, this.saveCartItem);
            } else {
              if (!cardIdList.includes(this.prisonerInfo.rybh)) {
                // 新增该人员缓存
                this.saveCartList.push(this.saveCartItem);
              }
            }
          });
        } else {
          // 购物车为空，删除该人员缓存
          this.saveCartList.map((list, index) => {
            if (list.goodsId == this.prisonerInfo.rybh) {
              this.saveCartList.splice(index, 1);
            }
          });
        }
      }
      uni.setStorageSync("saveCartList", this.saveCartList);
    },
    // 购物车结算
    handleSettleCart() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 3000);
        if (!this.cartGoodsList.length) {
          this.$parent.handleShowToast("购物车为空", "center");
          return;
        }
        if (this.prisonerInfo.rybh == "0999") {
          this.saveCartOrderInfo();
        } else {
          this.openModal("RecognitionDialogs");
          this.$nextTick(() => {
            this.$refs.recognitionDialogs &&
              this.$refs.recognitionDialogs.startRecognition();
          });
        }
      }
    },
    // 生成购买订单
    async saveCartOrderInfo() {
      // 结算商品列表
      let orderGoodsList = [];
      this.cartGoodsList.map((item) => {
        if (item.selectNum > 0) {
          let goods = {
            goodsId: item.goodsId,
            buyNum: item.selectNum,
            price: item.price,
            goodsUnit: item.goodsUnit,
            goodsNo: item.goodsNo,
            goodsName: item.goodsName,
          };
          if (item.hasOwnProperty("selectSize")) {
            goods.size = item.selectSize;
          }
          orderGoodsList.push(goods);
        }
      });
      let params = {
        goods: orderGoodsList,
        prisonInfo: this.prisonerInfo,
        totalPrice: this.cartTotal,
      };
      let res = await Api.apiCall(
        "post",
        Api.index.saveCartOrderInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        this.showTips(true, "购买成功");
        // 初始化商品信息
        this.initGoodsInfo();
        this.showShoppingCart = false;
      } else {
        this.showTips(false, `购买失败：${res.state.msg || "存在未审核订单"}`);
      }
    },
    // 打开消费记录
    openShoppingRecord() {
      this.endDate = dateFormat("YYYY-MM-DD", new Date());
      let date = new Date(this.endDate);
      let lastMonthDate = date.setMonth(date.getMonth() - 1);
      this.startDate = dateFormat("YYYY-MM-DD", new Date(lastMonthDate));
      this.setOrderPageParams(1, 10);
      this.getOrderHistoryInfo();
      this.showShoppingRecord = true;
    },
    // 选择开始时间
    selectStartDate(e) {
      this.startDate = e;
    },
    // 选择结束时间
    selectEndDate(e) {
      this.endDate = e;
    },
    // 消费记录滑动到底部触发加载
    handleRecorListScrolltolower() {
      // 已获取所有数据
      if (this.orderRecordList.length >= this.orderRecordTotal) {
        return this.$parent.handleShowToast("暂无更多数据", "center");
      }
      this.orderPageParams.pageIndex += 1;
      this.getOrderHistoryInfo();
    },
    // 查询购物记录
    handleRecordQuery() {
      this.orderRecordList = [];
      this.setOrderPageParams(1, 10);
      this.getOrderHistoryInfo();
    },
    // 获取消费记录
    async getOrderHistoryInfo() {
      let selectDateList = [this.startDate, this.endDate];
      if (selectDateList.includes("")) {
        this.$parent.handleShowToast("请选择订单日期", "center");
        return;
      }
      let params = {
        data: {
          rybh: this.prisonerInfo.rybh,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        pageParam: this.orderPageParams,
      };
      let res = await Api.apiCall(
        "post",
        Api.index.getOrderHistoryInfo,
        params
      );
      if (res.state.code == 200) {
        let list =
          (res.data &&
            res.data.map((item) => {
              let status = item.approvalStatus
                ? Number(item.approvalStatus)
                : 0;
              switch (status) {
                case 0:
                  item.statusName = "待审批";
                  item.statusColor = "green";
                  item.canConfirm = false;
                  break;
                case 1:
                  item.statusName = "审批中";
                  item.statusColor = "green";
                  item.canConfirm = false;
                  break;
                case 2:
                  item.statusName = "审批不通过";
                  item.statusColor = "red";
                  item.canConfirm = false;
                  break;
                case 3:
                  item.statusName = "审批通过";
                  item.statusColor = "blue";
                  item.canConfirm = true;
                  break;
                case 4:
                  item.statusName = "审批不通过";
                  item.statusColor = "red";
                  item.canConfirm = false;
                  break;
                case 5:
                  item.statusName = "订单打印中";
                  item.statusColor = "blue";
                  item.canConfirm = true;
                  break;
                case 6:
                  item.statusName = "订单待打印";
                  item.statusColor = "blue";
                  item.canConfirm = true;
                  break;
                default:
                  item.statusName = "待审批";
                  item.statusColor = "green";
                  item.canConfirm = false;
                  break;
              }
              return item;
            })) ||
          [];
        if (this.orderPageParams.pageIndex == 1) {
          this.orderRecordList = list;
        } else {
          this.orderRecordList = this.orderRecordList.concat(list);
        }
        this.orderRecordTotal = (res.page && res.page.total) || 0;
        if (!res.data.length) {
          this.$parent.handleShowToast("暂无数据", "center");
        }
      }
    },
    // 打开消费记录详情
    openRecordDetails(details, index) {
      this.recordDetailsList = [];
      this.curRecordDetails = Object.assign({}, details, {
        index,
      });
      this.getOrderDetail(details.detailNo);
    },
    // 获取消费记录详情
    async getOrderDetail(detailNo) {
      let res = await Api.apiCall("post", Api.index.getOrderDetail, {
        data: {
          detailNo,
        },
      });
      if (res.state.code == 200) {
        this.recordDetailsList = res.data.data;
        this.showRecordDetails = true;
      } else {
        this.$parent.handleShowToast("获取消费详情失败", "center");
      }
    },
    // 关闭消费记录详情
    closeRecordDetailsModal() {
      this.recordDetailsList.map((item) => {
        item.remarks = "";
      });
      this.setOrderPageParams(1, 10);
      this.getOrderHistoryInfo();
      this.showRecordDetails = false;
    },
    handleConfirmGoods(goods) {
      this.confirmGoods(goods);
    },
    // 选择备注类型
    selectConfirmType(item) {
      this.$set(
        this.recordDetailsList[item.rowIndex],
        "remarks",
        `${item.newVal}；`
      );
    },
    // 获取备注类型列表
    async getConfirmTypeList() {
      let res = await Api.apiCall(
        "get",
        Api.index.getConfirmTypeList,
        null,
        true
      );
      if (res.state.code == 200) {
        this.confirmTypeList = (res.data && res.data.data) || [];
      }
    },
    // 确认收货
    async confirmGoods(goods) {
      let res = await Api.apiCall("post", Api.index.confirmGoods, {
        data: {
          id: goods.id,
          remarks: goods.remarks,
        },
      });
      if (res.state.code == 200) {
        this.recordDetailsList.map((item) => {
          if (item.id == goods.id) {
            item.confirmStatus = 1;
          }
        });
        this.$forceUpdate();
        this.$parent.handleShowToast("确认成功", "center");
      } else {
        this.$parent.handleShowToast("确认失败", "center");
      }
    },
    // 设置消费记录分页参数
    setOrderPageParams(pageIndex, pageSize) {
      this.orderPageParams = {
        pageIndex,
        pageSize,
      };
    },
    // 指纹验证成功回调
    fingerRecognitionSuccess(res) {
      if (this.prisonerInfo.mkeys.includes(String(res.mKey))) {
        this.verifySuccess();
      } else {
        this.voiceBroadcast("识别失败，没有录入该指纹");
      }
    },
    // 人脸验证成功回调
    faceRecognitionSuccess(res) {
      this.verifySuccess();
    },
    // 验证成功
    verifySuccess() {
      this.voiceBroadcast("验证通过");
      this.closeModal("RecognitionDialogs");
      this.saveCartOrderInfo();
    },
    // 登录弹框关闭回调
    closeRecognitionDialogs() {
      this.closeModal("RecognitionDialogs");
    },
    // 弹出提示框
    showTips(isSuccess, tips) {
      this.errTips = tips;
      this.showSuccess = isSuccess;
      this.openModal("OrderInit");
    },
    // 语音播放
    voiceBroadcast(voiceText) {
      // 语音播放时段
      let messagePlayTime =
        uni.getStorageSync("messagePlayTime") || "05:00,22:00";
      let interval = messagePlayTime.split(",");
      let now = dateFormat("hh:mm", new Date());
      if (now >= interval[0] && now <= interval[1]) {
        let options = {
          content: voiceText,
        };
        getApp().globalData.Base.speech(options);
      }
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
