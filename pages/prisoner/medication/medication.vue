<template>
  <div class="medication-container">
    <div class="medication-wrapper">
      <div class="medication-content">
        <div class="medication-title">
          <text>服药管理</text>
        </div>
        <div class="medication-wrapper">
          <div class="medication-menu-list">
            <div class="medication-menu-item" :class="currentPage == 1 ? 'medication-menu-active' : ''"
              @click="switchPage(1)">
              <common-icons iconType="icondispose" size="38" color="#fff" />
              <text>服药确认</text>
            </div>
            <div class="medication-menu-item" :class="currentPage == 2 ? 'medication-menu-active' : ''"
              @click="switchPage(2)">
              <common-icons iconType="iconrecord" size="46" color="#fff" />
              <text>服药记录</text>
            </div>
          </div>
          <div class="medication-vertical-divider"></div>
          <div v-if="currentPage == 1" class="medication-plan-container">
            <div class="plan-table-wrapper">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in medicationColumns.plan" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="plan-table-scroll">
                <div v-if="planList.length">
                  <div class="table-content-list" v-for="(item, index) in planList" :key="index">
                    <div class="content-item" style="flex: 1">
                      {{ item.doctors }}
                    </div>
                    <div class="content-item" style="flex: 2">
                      {{ item.diagnosis }}
                    </div>
                    <div class="content-item content-section" style="flex: 3">
                      <div class="content">{{ item.drugName }}</div>
                    </div>
                    <div class="content-item" style="flex: 2">
                      {{ item.time }}
                    </div>
                    <div class="content-item" style="flex: 1">
                      {{ item.status == 1 ? '已服药' : item.status == 3 ? '服药退签' : '未服药' }}
                    </div>
                    <div class="content-item" style="flex: 2">
                      <div class="button" @click="openSignModal(item)">服药签名</div>
                    </div>
                  </div>
                </div>
                <div v-else class="table-content-empty">暂无数据</div>
              </scroll-view>
            </div>
          </div>
          <div v-if="currentPage == 2" class="medication-record-container">
            <div class="record-table-wrapper">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in medicationColumns.record" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="record-table-scroll" @scrolltolower="handleScrolltolower">
                <div v-if="recordList.length">
                  <div class="table-content-list" v-for="(item, index) in recordList" :key="index">
                    <div class="content-item" style="flex: 1">
                      {{ item.doctorName }}
                    </div>
                    <div class="content-item" style="flex: 2">
                      {{ item.doctorProof }}
                    </div>
                    <div class="content-item content-section" style="flex: 3">
                      <div class="content">{{ item.dispose }}</div>
                    </div>
                    <div class="content-item" style="flex: 2">
                      {{ item.time }}
                    </div>
                    <div class="content-item" style="flex: 1">
                      {{ item.status == 1 ? '已服药' : item.status == 3 ? '服药退签' : '未服药' }}
                    </div>
                  </div>
                </div>
                <div v-else class="table-content-empty">暂无数据</div>
              </scroll-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <neil-modal :show="showSignModal" @close="closeModal('SignModal')">
        <div class="common-modal-container">
          <div class="modal-header">
            <div class="modal-title">服药签名（请从左往右进行签名）</div>
            <div class="modal-close" @click="closeModal('SignModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <view class="modal-horizontal-divider"></view>
          <div class="common-modal-content">
            <htz-signature v-if="showSignModal" @submit="signSuccess" @fail="signFail" cid="signId"
              btnText="指纹确认"></htz-signature>
          </div>
        </div>
      </neil-modal>
      <neil-modal :show="showFingerModal">
        <view class="finger-modal-container">
          <view class="modal-header">
            <view class="modal-title">指纹确认</view>
            <div class="modal-close" @click="closeModal('FingerModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </view>
          <view class="page-horizontal-divider"></view>
          <view class="modal-content">
            <common-icons iconType="iconzhiwen" size="100" color="#fff" />
            <text>请按压指纹...</text>
          </view>
        </view>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import ePicker from "@/components/e-picker/e-picker.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import htzSignature from "@/components/htz-signature/htz-signature.vue";
import { pathToBase64 } from "@/common/utils/imageTools.js";
import { dateFormat } from "@/common/utils/util.js";
import { mapState } from "vuex";
import medicationColumns from "@/static/mock/medicationColumns.json";

export default {
  name: "medication",
  components: {
    neilModal,
    ePicker,
    xflSelect,
    htzSignature,
  },
  data() {
    return {
      currentPage: 1,
      // 服药确认|记录表头
      medicationColumns: medicationColumns,
      // 服药确认列表
      planList: [],
      // 服药确认信息
      medicationInfo: {},
      // 服药记录列表
      recordList: [],
      // 服药签名弹框
      showSignModal: false,
      // 服药签名
      signature: "",
      // 指纹图像弹框
      showFingerModal: false,
      // 设备连接状态
      isOpen: false,
      // 按压指纹定时器
      fingerTimer: null,
      // 指纹图像
      fingerImage: "",
      // 分页参数
      pageParam: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 记录总数
      recordTotal: 0,
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
  },
  created() {
    // 获取服药确认列表
    this.getPlanInfo();
    // 开启倒计时
    this.$parent.countTimer();
  },
  beforeDestroy() {
    // 关闭指纹
    this.closeFingerPrint();
  },
  methods: {
    // 菜单切换
    switchPage(index) {
      this.currentPage = index;
      if (index == 1) {
        // 获取服药确认列表
        this.getPlanInfo();
      } else {
        this.recordList = [];
        this.pageParam = {
          pageIndex: 1,
          pageSize: 10,
        };
        // 获取服药记录
        this.getRecordInfo();
      }
    },
    // 获取服药确认列表
    async getPlanInfo() {
      let res = await Api.apiCall("get", Api.prisoner.medication.getMedicationPlan + `?rybh=${this.personInfo.rybh}`);
      if (res.state.code == 200) {
        this.planList = res.data;
      }
    },
    // 打开服药签名弹框
    openSignModal(info) {
      this.medicationInfo = info;
      this.showSignModal = true;
    },
    // 获取签名成功
    signSuccess(res) {
      this.handlePathToBase64(res.tempFilePath).then(base64Str => {
        this.closeModal("SignModal");
        this.signature = base64Str;
        // 采集指纹
        this.startFingerprint();
      });
    },
    // 获取签名失败
    signFail(err) {
      this.$parent.handleShowToast("获取签名失败", "center", 5000);
    },
    // 开始指纹采集
    startFingerprint() {
      this.showFingerModal = true;
      this.initFingerPrint();
      setTimeout(() => {
        this.getFingerImage();
      }, 1500);
    },
    // 获取指纹图像
    getFingerImage() {
      this.$parent.voiceBroadcast("请按压指纹");
      clearInterval(this.fingerTimer);
      this.fingerTimer = setInterval(() => {
        if (getApp().globalData.Fingerprint.isPressFinger() == 0) {
          let res = getApp().globalData.Fingerprint.getRawImage();
          if (res.code == 0) {
            this.closeModal("FingerModal");
            this.fingerImage = res.image.replace(/[\r\n]/g, "");
            // 保存服药记录
            this.saveMedicineInfo();
            // 关闭指纹
            this.closeFingerPrint();
          } else {
            this.$parent.voiceBroadcast("采集失败，请重新按压指纹");
          }
        }
      }, 1000);
    },
    // 设备连接
    initFingerPrint() {
      if (!this.isOpen) {
        getApp().globalData.Fingerprint.init((result) => {
          if (result == 0) {
            this.isOpen = true;
            console.log("设备已连接");
          } else {
            console.log("设备连接失败");
          }
        });
      }
    },
    // 关闭指纹连接
    closeFingerPrint() {
      clearInterval(this.fingerTimer);
      if (this.isOpen) {
        let res = getApp().globalData.Fingerprint.close();
        if (res == 0) {
          this.isOpen = false;
          console.log("关闭设备");
        } else {
          console.log("关闭设备失败");
        }
      }
    },
    // 保存服药记录
    async saveMedicineInfo() {
      const {
        doctors: doctorName,
        diagnosis: doctorProof,
        drugName: dispose,
        drugDispenseId,
      } = this.medicationInfo;
      let params = {
        data: {
          doctorName,
          doctorProof,
          dispose,
          url: "",
          status: 1,
          rybh: this.personInfo.rybh,
          operatePrisoner: this.personInfo.operate,
          drugDispenseId,
          signature: this.signature,
          fingerImage: this.fingerImage,
        }
      };
      let res = await Api.apiCall("post", Api.prisoner.medication.saveMedicineRecord, params);
      if (res.state.code == 200) {
        this.closeModal("SignModal");
        this.closeModal("FingerModal");
        this.$parent.handleShowToast("保存服药签名信息成功");
        // 获取服药确认列表
        this.getPlanInfo();
      }
    },
    // 获取服药记录
    async getRecordInfo() {
      let params = {
        data: {
          rybh: this.personInfo.rybh,
        },
        pageParam: this.pageParam,
      };
      let res = await Api.apiCall("post", Api.prisoner.medication.getMedicineRecords, params);
      if (res.state.code == 200) {
        let result = res.data;
        result.length && result.map(item => {
          item.time = dateFormat("YYYY-MM-DD hh:mm:ss", new Date(item.time));
        });
        this.recordList = this.recordList.concat(result);
        this.recordTotal = res.page && res.page.total;
      }
    },
    // 下拉底部加载
    handleScrolltolower() {
      // 已获取所有数据
      if (this.recordList.length >= this.recordTotal) {
        return this.$parent.handleShowToast("暂无更多数据");
      }
      this.pageParam.pageIndex++;
      this.getRecordInfo();
    },
    // 图片路径转Base64
    handlePathToBase64(imgPath) {
      return new Promise((resolve, reject) => {
        pathToBase64(imgPath).then(base64 => {
          let index = base64.indexOf(",") + 1;
          let imgBase64 = base64.substr(index);
          resolve(imgBase64);
          this.deleteFile(imgPath);
        }).catch(err => {
          reject(err);
          this.deleteFile(imgPath);
        });
      });
    },
    // 根据文件路径删除文件
    deleteFile(filePath) {
      // #ifdef APP-PLUS
      plus.io.requestFileSystem(
        plus.io.PUBLIC_DOCUMENTS, // 程序公用文档目录常量
        (fs) => {
          // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
          fs.root.getFile(
            filePath,
            {
              create: false, // 文件不存在则创建
            },
            (fileEntry) => {
              // 文件在手机中的路径
              fileEntry.remove(() => {
              });
            }
          );
        }
      );
      // #endif
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
