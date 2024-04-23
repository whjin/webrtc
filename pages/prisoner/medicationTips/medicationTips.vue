<template>
  <view class="medication-tips">
    <view class="main-area">
      <view class="uni-flex page-title header">
        <text>服药管理</text>
        <view class="btn-box">
          <template v-if="isTheMedicine">
            <view class="btn-item gray-btn" @click="hanleMedication('cancel')">取消服药</view>
            <view class="btn-item blue-btn" @click="hanleMedication('finish')">完成服药</view>
          </template>
          <view v-if="!isTheMedicine && curPage == 1" class="btn-item blue-btn"
            :class="{ disabled: !medicationPlanList.length }" @click="hanleMedication('start')">开始服药</view>
        </view>
      </view>
      <view class="content">
        <view class="tips" v-if="isTheMedicine">
          <view class="left-box inner-glow-box">
            <view class="title">正在进行服药监控录像</view>
            <view class="video-box">
              <view class="room-name">{{ roomName }}</view>
              <video :src="videoUrl" codec="software" autoplay muted :controls="false"
                style="width: 678.473upx; height: 359.73upx" object-fit="fill"></video>
            </view>
          </view>
          <view class="right-box inner-glow-box">
            <view class="title">服药步骤</view>
            <view class="steps-box">
              <view class="steps-item" :class="{ 'next-steps': item.hasNextSteps }" v-for="item in stepsDetails"
                :key="item.imgUrl">
                <view class="img-box" :style="item.domStyle">
                  <image class="img" :src="item.imgUrl"></image>
                </view>
                <text class="tips">{{ item.tips }}</text>
              </view>
            </view>
          </view>
        </view>
        <template v-else>
          <div class="medication-menu-list" v-if="debounceSwitchPage">
            <div v-for="item in medicationMenuList" :key="item.page" class="medication-menu-item"
              :class="{ 'medication-menu-active': curPage == item.page }" @click="debounceSwitchPage(item.page)">
              <common-icons :iconType="item.iconStyle.iconType" :size="item.iconStyle.size"
                :color="item.iconStyle.color" />
              <text>{{ item.title }}</text>
            </div>
          </div>
          <div class="medication-vertical-divider"></div>
          <div class="medication-table-container">
            <div class="table-box">
              <div class="table-head">
                <div class="medication-head-item" v-for="item in medicationTableList" :key="item.code">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="medication-table-scroll" @scrolltolower="handleRecorListScrolltolower">
                <div class="medication-table-content" v-for="(item, index) in medicationColumns" :key="index">
                  <div class="medication-table-item" v-for="i in medicationTableList" :key="i.code" :style="i.code == 'status' && curPage == 1 ? 'color:#D22D2D;' : ''
                    " @click="handleClickTableItem(i.code)">
                    {{ item[i.code] }}
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import Api from "@/common/api.js";
import Log from "@/common/utils/log.js";
import { debounce, dateFormat, currentPage } from "@/common/utils/util.js";
export default {
  components: {},
  data() {
    return {
      medicationMenuList: [
        {
          page: 1,
          title: "服药计划",
          iconStyle: {
            iconType: "icondispose",
            size: 38,
            color: "#fff",
          },
        },
        {
          page: 2,
          title: "服药记录",
          iconStyle: {
            iconType: "iconrecord",
            size: 46,
            color: "#fff",
          },
        },
      ],
      stepsDetails: [
        {
          imgUrl: "/static/images/illness/1.png",
          tips: "距离仓内屏\n一只手臂宽度",
          hasNextSteps: true,
          domStyle: "padding: 8.84upx 15.84upx 0;",
        },
        {
          imgUrl: "/static/images/illness/2.png",
          tips: "左手拿药\n右手拿水杯",
          hasNextSteps: true,
          domStyle: "padding: 8.84upx 15.84upx 0;",
        },
        {
          imgUrl: "/static/images/illness/3.png",
          tips: "伸手向仓内屏\n出示所服药物",
          hasNextSteps: false,
          domStyle: "padding: 8.84upx 15.84upx 0;",
        },
        {
          imgUrl: "/static/images/illness/4.png",
          tips: "服下药物",
          hasNextSteps: true,
          domStyle: "padding: 8.84upx 15.84upx 0;",
        },
        {
          imgUrl: "/static/images/illness/5.png",
          tips: "面向仓内屏张开\n手掌，张开嘴巴",
          hasNextSteps: true,
          domStyle: "padding: 8.84upx 15.84upx 0;",
        },
        {
          imgUrl: "/static/images/illness/6.png",
          tips: "请点击“完成服\n药”按钮",
          hasNextSteps: false,
          domStyle: "",
        },
      ],
      // 计划列表
      medicationPlanList: [],
      // 记录列表
      medicationRecordList: [],
      curPage: 1, // 1：计划 2：记录
      isTheMedicine: false, // 开始服药
      roomName: uni.getStorageSync("terminalInfo").roomName, // 监室名称
      videoUrl: "",
      isHandlingRecord: false, // 处理录像标识
      debounceSwitchPage: null,
      // 值班记录分页参数
      medicationRecordPageParam: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 值班记录列表总数
      medicationRecordTotal: 999,
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
    // 列表数据
    medicationTableList() {
      if (this.curPage == 1) {
        // 计划
        return [
          {
            title: "主治医生",
            code: "doctors",
          },
          {
            title: "医生诊断",
            code: "diagnosis",
          },
          {
            title: "治疗处置",
            code: "drugName",
          },
          {
            title: "服药时间",
            code: "time",
          },
          {
            title: "服药状态",
            code: "status",
          },
        ];
      } else {
        // 记录
        return [
          {
            title: "主治医生",
            code: "doctorName",
          },
          {
            title: "医生诊断",
            code: "doctorProof",
          },
          {
            title: "治疗处置",
            code: "dispose",
          },
          {
            title: "服药时间",
            code: "time",
          },
          {
            title: "服药状态",
            code: "status",
          },
        ];
      }
    },
    medicationColumns() {
      if (this.curPage == 1) {
        // 计划
        return this.medicationPlanList;
      } else {
        // 记录
        return this.medicationRecordList;
      }
    },
  },
  mounted() {
    // 开启倒计时
    currentPage().countTimer();
    this.getMedicationList(1);
    this.debounceSwitchPage = debounce(this.switchPage);
  },
  destroyed() {
    this.videoUrl = "";
  },
  methods: {
    switchPage(page) {
      this.curPage = page;
      this.setMedicationRecordPageParam(1, 10);
      this.getMedicationList(page);
    },
    handleClickTableItem(code) { },
    // 点击按钮 start：开始服药 finish：完成服药 cancel：取消服药
    hanleMedication(type) {
      if (type == "start") {
        this.handleRecord("start", () => {
          let url =
            uni.getStorageSync("rtspUrl") +
            "@" +
            uni.getStorageSync("terminalInfo").embeddedIp +
            "/stream0";
          this.isTheMedicine = true;
          this.videoUrl = url;
        });
      } else {
        let status = 1;
        if (type == "cancel") {
          status = 2;
        }
        this.handleRecord("end", (url) => {
          this.isTheMedicine = false;
          this.videoUrl = "";
          this.saveMedicineRecord(status, url);
        });
      }
    },
    // 滑动到底部触发加载
    handleRecorListScrolltolower() {
      // 已获取所有数据
      if (this.medicationRecordList.length >= this.medicationRecordTotal) {
        return currentPage().handleShowToast("暂无更多数据", "center");
      }
      this.medicationRecordPageParam.pageIndex += 1;
      this.getMedicationList(2);
    },
    // 获取服药列表 1：计划 2：记录
    async getMedicationList(type) {
      let api =
        type == 1
          ? Api.prisoner.medicationTips.medicationPlanList
          : Api.prisoner.medicationTips.medicationRecordList;
      let params =
        type == 1
          ? {
            rybh: this.personInfo.rybh,
          }
          : {
            data: {
              rybh: this.personInfo.rybh,
            },
            pageParam: this.medicationRecordPageParam,
          };
      let reqType = type == 1 ? "get" : "post";
      let res = await Api.apiCall(reqType, api, params, true);
      if (res.state.code == 200) {
        if (!res.data.length) {
          currentPage().handleShowToast("暂无数据", "center");
        }
        if (type == 1) {
          let planList = res.data.map((item) => {
            item.status = Number(item.status) == 0 ? "待完成" : "已完成";
            return item;
          });
          this.medicationPlanList = planList;
        } else {
          let recordList = res.data.map((item) => {
            item.time = dateFormat("YYYY-MM-DD", new Date(item.time));
            item.status = Number(item.status) == 0 ? "待完成" : "已完成";
            return item;
          });
          if (this.medicationRecordPageParam.pageIndex == 1) {
            this.medicationRecordList = recordList;
          } else {
            this.medicationRecordList =
              this.medicationRecordList.concat(recordList);
          }
          this.medicationRecordTotal = (res.page && res.page.total) || 0;
        }
      }
    },
    // 设置服药记录列表分页参数
    setMedicationRecordPageParam(pageIndex, pageSize) {
      this.medicationRecordPageParam = {
        pageIndex,
        pageSize,
      };
    },
    /**
     * 录像
     * type：start开始 end结束
     * cb：end成功后返回录像url
     */
    async handleRecord(type, cb) {
      if (this.isHandlingRecord) return;
      this.isHandlingRecord = true;
      let api =
        type == "start"
          ? Api.prisoner.medicationTips.startRecord
          : Api.prisoner.medicationTips.endRecord;
      let url =
        uni.getStorageSync("rtspUrl") +
        "@" +
        uni.getStorageSync("terminalInfo").embeddedIp +
        "/stream0";
      let params = {
        data: {
          rtspUrl: url,
        },
      };
      let res = await Api.apiCall("post", api, params, true);
      this.isHandlingRecord = false;
      if (res.state.code == 200) {
        if (type == "end") {
          cb && cb(res.data);
        } else {
          cb && cb();
        }
      }
    },
    // 保存服药记录
    async saveMedicineRecord(status, url) {
      let params = {
        doctorName: "",
        doctorProof: "",
        dispose: "",
        url,
        status,
        rybh: this.personInfo.rybh,
      };
      let arrs = {
        doctorName: [],
        doctorProof: [],
        dispose: [],
      };
      this.medicationPlanList.forEach((item) => {
        arrs.doctorName.push(item.doctors);
        arrs.doctorProof.push(item.diagnosis);
        arrs.dispose.push(item.drugName);
      });
      params.doctorName = arrs.doctorName.join("/");
      params.doctorProof = arrs.doctorProof.join("/");
      params.dispose = arrs.dispose.join("/");

      let res = await Api.apiCall(
        "post",
        Api.prisoner.medicationTips.saveMedicineRecord,
        {
          data: params,
        },
        true
      );
    },
  },
};
</script>

<style lang="less" scoped>
.inner-glow-box {
  padding: 10.84upx 20.84upx 20.84upx;
  box-sizing: border-box;
  border: 1px solid #00c6ff;
  border-radius: 4px;
  box-shadow: inset 0upx 0upx 5upx 5upx rgba(25, 106, 190, 0.5);
}

.medication-tips {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-box {
      margin-right: 48.61upx;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn-item {
        margin-left: 13.89upx;
        width: 111.11upx;
        height: 43.05upx;
        border: 1px solid rgba(0, 122, 255, 1);
        border-radius: 4upx;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 18.06upx;

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }

      .gray-btn {
        background: rgba(55, 151, 255, 0.16);
      }

      .blue-btn {
        background: #007aff;
      }
    }
  }

  .content {
    margin: 0 48.61upx;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .tips {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .title {
        margin-bottom: 20.83upx;
        width: 100%;
        font-size: 20.83upx;
        text-align: center;
        color: #35fffa;
      }

      .left-box {
        height: 477.78upx;

        .video-box {
          width: 678.473upx;
          // height: 359.73upx;
          background-color: #000;

          .room-name {
            padding: 6.95upx 13.89upx;
            width: 100%;
            font-size: 18.06upx;
          }
        }
      }

      .right-box {
        margin-left: 13.89upx;
        height: 477.78upx;

        .steps-box {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;

          .steps-item {
            margin-bottom: 10.95upx;
            font-size: 0;

            .img-box {
              margin-bottom: 10.95upx;
              width: 135.417upx;
              height: 145.84upx;
              box-sizing: border-box;
              border: 2px dashed #91b7f2;

              .img {
                width: 100%;
                height: 100%;
              }
            }

            .tips {
              display: flex;
              justify-content: center;
              width: 135.417upx;
              font-size: 15.28upx;
              text-align: center;
            }
          }

          .next-steps {
            position: relative;

            &::after {
              position: absolute;
              top: 163.89upx;
              right: -30.89upx;
              content: " ";
              display: inline-block;
              width: 30upx;
              height: 20upx;
              background-image: url("../../../static/images/common/arrow.png");
              background-repeat: no-repeat;
              background-size: cover;
            }
          }
        }
      }
    }

    .medication-menu-list {
      width: 148upx;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .medication-menu-item {
        height: 120upx;
        width: 120upx;
        box-sizing: border-box;
        margin-bottom: 32upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(93, 166, 222, 0.5);
        border-radius: 3.88upx;

        text {
          margin-top: 6.88upx;
          font-size: 18upx;
          font-weight: 400;
          color: #fff;
        }
      }

      .medication-menu-active {
        background: rgba(0, 122, 255, 0.9);
      }
    }

    .medication-vertical-divider {
      margin-right: 30upx;
      width: 2px;
      height: 380upx;
      background-image: linear-gradient(to bottom,
          rgba(0, 198, 255, 0),
          rgba(0, 198, 255, 1),
          rgba(0, 198, 255, 0));
    }

    .medication-table-container {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex: 1;

      .table-box {
        display: flex;
        flex-direction: column;
        color: #fff;

        .table-head {
          display: flex;

          .weekmenu-head-item,
          .medication-head-item {
            box-sizing: border-box;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            font-size: 18upx;
            font-weight: bold;
            line-height: 43.75upx;
            background: rgba(17, 62, 141, 0.5);
          }

          .medication-head-item {
            white-space: nowrap;
          }
        }

        .medication-table-scroll {
          height: 380upx;

          .weekmenu-table-content {
            height: 83.33upx;
            display: flex;
            flex: 1;
            align-items: center;
            border-bottom: 0.69upx solid rgba(0, 198, 255, 0.5);
            padding: 24upx 0;

            .weekmenu-table-item {
              height: 100%;
              box-sizing: border-box;
              display: flex;
              flex: 1;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              font-size: 16upx;
              text-align: justify;
              font-weight: 600;

              span {
                width: 125upx;
                height: 65upx;
                overflow: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                display: -webkit-box;
                -webkit-box-orient: vertical;
              }
            }
          }

          .medication-table-content {
            display: flex;
            border-bottom: 1upx solid rgba(17, 62, 141, 0.9);

            .medication-table-item {
              flex: 1;
              display: inline-block;
              text-align: center;
              font-size: 18.05upx;
              font-weight: 400;
              line-height: 48.61upx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .medication-table-total {
            display: flex;
            font-size: 18.05upx;
            line-height: 48.61upx;
            justify-content: space-between;
            border-bottom: 1upx solid rgba(17, 62, 141, 0.9);

            span {
              width: 225upx;
              display: flex;
              justify-content: center;
            }
          }
        }

        .current-date {
          color: #35fffa;
        }
      }
    }
  }
}
</style>
