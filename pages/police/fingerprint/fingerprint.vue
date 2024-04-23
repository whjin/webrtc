<template>
  <div class="police-fingerprint-container">
    <div class="fingerprint-wrapper">
      <div class="fingerprint-header">
        <div class="fingerprint-title">民警指纹录入</div>
        <div class="fingerprint-btn-box">
          <div class="fingerprint-button" @click="fingerprintInit">
            指纹录入
          </div>
        </div>
      </div>
      <div class="fingerprint-box">
        <div
          class="fingerprint-list"
          v-for="(item, index) in fingerList"
          :key="index"
        >
          <div
            class="fingerprint-item"
            :class="{ disabledClick: !!item.mKey && !!item.mKey2 }"
            @click="handleCheckChange(item)"
          >
            <checkbox
              class="checkbox"
              :checked="
                !!item.mKey && !!item.mKey2
                  ? true
                  : item.policeNumber == checkedId
                  ? true
                  : false
              "
              :disabled="!!item.mKey && !!item.mKey2"
              :class="{ disabledCheck: !!item.mKey && !!item.mKey2 }"
            >
              <text>{{ item.policeName }}</text>
              <text :class="{ mark: !!item.mKey || !!item.mKey2 }">{{
                !item.mKey && !item.mKey2
                  ? ""
                  : !!item.mKey && !!item.mKey2
                  ? 2
                  : 1
              }}</text>
            </checkbox>
          </div>
          <div class="page-horizontal-divider"></div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <!-- 指纹录入 -->
      <neil-modal :show="showFinger">
        <div class="fingerprint-modal-container">
          <div class="fingerprint-header">
            <div class="fingerprint-title">
              <text>温馨提示</text>
            </div>
            <div class="fingerprint-close" @click="closeModal('Finger')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <view class="page-horizontal-divider"></view>
          <view
            class="uni-flex uni-flex-item uni-column"
            style="justify-content: center; align-items: center"
          >
            <common-icons iconType="iconzhiwen" size="100" color="#FFFFFF" />
            <text style="font-size: 20.83upx; font-weight: 400"
              >验证指纹，进行登录...</text
            >
          </view>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import { currentPage } from "@/common/utils/util.js";

export default {
  components: {
    neilModal,
  },
  data() {
    return {
      // 指纹认证弹框
      showFinger: false,
      // 民警指纹信息
      fingerList: [],
      // 已选人员信息
      checkedList: [],
      // 已选人员ID
      checkedId: "",
      // 建档ID
      paramInt: 1,
      // 指纹开启状态
      isOpen: false,
      isFingerRepeat: false,
    };
  },
  created() {
    // 获取民警指纹信息
    this.getPoliceFingerInfo();
    // 开启倒计时
    currentPage().countTimer();
    // 指纹录入监听
    this.setFingerCallBack();
  },
  destroyed() {
    // 关闭指纹连接
    this.closeFingerPrint();
  },
  methods: {
    // 指纹识别
    handleFingerprint(res) {
      if (res.code == "0") {
        this.closeModal("Finger");
        currentPage().voiceBroadcast("当前指纹已存在");
      } else {
        getApp().globalData.FloatUniModule.fingerprintCollect(this.paramInt);
      }
    },
    // 指纹录入监听
    setFingerCallBack() {
      // 指纹采集
      getApp().globalData.FloatUniModule.setFingerprintFeatureLeftNumCallBack(
        (e) => {
          if (e.code == "0") {
            console.log("指纹采集成功");
          }
        }
      );
      // 指纹入库
      getApp().globalData.FloatUniModule.setFingerprintFeatureCallBack((e) => {
        if (e.code == "0") {
          if (!this.isFingerRepeat) {
            this.isFingerRepeat = true;
            setTimeout(() => {
              this.isFingerRepeat = false;
            }, 1500);
            if (!!e.feature) {
              this.savePoliceFingerInfo(e.id, e.feature);
              getApp().globalData.FloatUniModule.fingerprintFeatureInput(
                e.id,
                e.feature
              );
              currentPage().voiceBroadcast("指纹录入成功");
            } else {
              currentPage().voiceBroadcast("指纹录入失败，当前特征值为空");
            }
            this.closeModal("Finger");
          }
        }
      });
    },
    // 民警指纹录入信息
    async getPoliceFingerInfo() {
      const { roomId } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall("get", Api.police.getPoliceFingerInfo, {
        roomId,
      });
      if (res.state.code == 200) {
        this.fingerList = res.data;
      }
    },
    // 选择人员
    handleCheckChange(item) {
      if (!this.checkedList.length) {
        this.checkedList.push(item);
        this.checkedId = this.checkedList[0].policeNumber;
      } else {
        if (item.policeNumber == this.checkedList[0].policeNumber) {
          this.checkedList = [];
        } else {
          this.checkedList.splice(0, 1, item);
          this.checkedId = this.checkedList[0].policeNumber;
        }
      }
    },
    // 民警指纹录入
    fingerprintInit() {
      if (this.checkedList.length) {
        for (let value of this.checkedList.values()) {
          if (!!value.mKey && !!value.mKey2) {
            return;
          }
        }
      } else {
        currentPage().handleShowToast("请先选择人员列表", "center");
        return;
      }
      if (!this.isOpen) {
        // 打开指纹设备
        getApp().globalData.FloatUniModule.fingerModuleStop();
        getApp().globalData.FloatUniModule.syncStartFinger((e) => {
          if (e.code == 0) {
            this.isOpen = true;
            this.openModal("Finger");
            console.log("打开指纹");
            // 获取建档ID
            this.getFingerKey();
          } else {
            currentPage().voiceBroadcast("指纹设备未打开");
            console.log("指纹设备未打开");
            // 关闭指纹连接
            this.closeFingerPrint();
          }
        });
      }
    },
    // 获取建档ID
    async getFingerKey() {
      const { roomId } = uni.getStorageSync("terminalInfo");
      let params = {
        roomId,
        police: this.checkedList[0].policeNumber,
      };
      let res = await Api.apiCall("get", Api.police.getPoliceFingerKey, params);
      if (res.state.code == 200) {
        if (!this.checkedList[0].mKey) {
          this.paramInt = res.data[0];
        } else {
          this.paramInt = res.data[1];
        }
        currentPage().voiceBroadcast("建档成功，请按压指纹");
        getApp().globalData.FloatUniModule.fingerprintRecognition();
      }
    },
    // 录入成功后保存指纹信息
    async savePoliceFingerInfo(mKey, pHint) {
      let params = {
        mKey,
        police: this.checkedList[0].policeNumber,
        pHint,
      };
      let res = await Api.apiCall(
        "post",
        Api.police.savePoliceFingerInfo,
        params
      );
      if (res.state.code == 200) {
        this.fingerList.map((item, index) => {
          if (item.policeNumber == res.data.police) {
            item.mKey = res.data.mKey;
            item.mKey2 = res.data.mKey2;
            this.fingerList.splice(index, 1, item);
          }
        });
        currentPage().handleShowToast("指纹保存成功");
      }
    },
    // 关闭指纹连接
    closeFingerPrint() {
      this.isOpen = false;
      getApp().globalData.FloatUniModule.syncStopFinger((e) => {
        if (e.code == 0) {
          console.log("关闭指纹");
          getApp().globalData.FloatUniModule.fingerModuleStop();
        }
      });
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
      this.closeFingerPrint();
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
