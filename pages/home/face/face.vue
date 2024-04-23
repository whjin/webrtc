<template>
  <div class="face-container" @click="initCountTimeout">
    <div class="face-wrapper">
      <div class="face-content">
        <div class="face-title">
          <text>面对面管理</text>
        </div>
        <div class="face-box">
          <div class="face-menu-list">
            <div class="face-menu-item" :class="currentPage == 1 ? 'face-menu-active' : ''" @click="switchPage(1)">
              <common-icons iconType="icondispose" size="38" color="#fff" />
              <text>面对面登记</text>
            </div>
            <div class="face-menu-item" :class="currentPage == 2 ? 'face-menu-active' : ''" @click="switchPage(2)">
              <common-icons iconType="iconrecord" size="46" color="#fff" />
              <text>面对面记录</text>
            </div>
          </div>
          <div class="face-vertical-divider"></div>
          <div v-if="currentPage == 1" class="face-register-container">
            <div class="face-form-content">
              <div class="face-form-box">
                <div class="face-select">
                  <label>监室名称：</label>
                  <input type="text" class="input-img" v-model="roomInfo.roomName" disabled />
                </div>
                <div class="face-select">
                  <label>面对面民警：</label>
                  <xfl-select :list="policeList" clearable :placeholder="'请选择面对面民警'" @change="selectPolice"
                    @clear="clearSelectPolice"></xfl-select>
                </div>
                <div class="face-select">
                  <label>登记时间：</label>
                  <e-picker mode="dateTime" class="picker-img" @change="selectRegDate" :placeholder="'请选择登记时间'">
                    <div class="face-date">{{ regDate }}</div>
                  </e-picker>
                </div>
                <div class="face-select">
                  <label>面对面类型：</label>
                  <xfl-select :list="faceTypeList" clearable :placeholder="'请选择面对面类型'" @change="selectFaceType"
                    @clear="clearFaceType"></xfl-select>
                </div>
                <div class="face-select face-remark">
                  <label>情况记录：</label>
                  <textarea :value="faceRemark" :maxlength="-1" @input="faceRemarkChange"></textarea>
                </div>
              </div>
            </div>
            <div class="face-button-box">
              <div class="face-button button-cancel" @click="cancelFaceReg">
                取消登记
              </div>
              <div class="face-button button-save" @click="saveFaceRegister">
                保存登记
              </div>
            </div>
          </div>
          <div v-if="currentPage == 2" class="face-record-container">
            <div class="record-form-content">
              <div class="face-form-box">
                <div class="face-select">
                  <label>监室名称：</label>
                  <input type="text" class="input-img" v-model="roomInfo.roomName" disabled />
                </div>
                <div class="face-select">
                  <label>面对面民警：</label>
                  <xfl-select :list="policeList" clearable :placeholder="'请选择面对面民警'" @change="selectPolice"
                    @clear="clearSelectPolice"></xfl-select>
                </div>
                <div class="face-select">
                  <label>登记时间：</label>
                  <e-picker mode="date" class="picker-img" @change="selectRecordDate" :placeholder="'请选择登记时间'">
                    <div class="face-date">{{ recordDate }}</div>
                  </e-picker>
                </div>
                <div class="face-select">
                  <label>面对面类型：</label>
                  <xfl-select :list="faceTypeList" clearable :placeholder="'请选择面对面类型'" @change="selectFaceType"
                    @clear="clearFaceType"></xfl-select>
                </div>
              </div>
              <div class="face-button-box">
                <div class="face-button button-query" @click="queryFaceRecord">
                  查询
                </div>
              </div>
            </div>
            <div class="record-table-box">
              <div class="table-head">
                <div class="table-head-item" v-for="(item, index) in faceColumns" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="record-table-scroll">
                <div class="table-content" v-for="(item, index) in faceRecordList" :key="index">
                  <div class="record-table-item" style="flex: 1">
                    {{ item.roomNo }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.userName }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.fieldName }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.registerTime }}
                  </div>
                  <div class="record-table-item" style="flex: 1" @click="getFaceDetailInfo(item)">
                    查看详情
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <neil-modal :show="showDetailModal">
        <div class="face-modal-box">
          <div class="modal-header">
            <div class="modal-title">面对面管理详情</div>
            <div class="modal-close" @click="closeModal('DetailModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="modal-horizontal-divider"></div>
          <div class="face-modal-content">
            <div class="face-detail-box">
              <div class="face-detail">
                <label style="width: 115upx">监室号：</label>
                <input type="text" class="input-img" v-model="faceDetailInfo.roomNo" disabled />
              </div>
              <div class="face-detail">
                <label>面对面民警：</label>
                <input type="text" class="input-img" v-model="faceDetailInfo.userName" disabled />
              </div>
              <div class="face-detail">
                <label style="width: 115upx">登记时间：</label>
                <input type="text" class="input-img" v-model="faceDetailInfo.registerTime" disabled />
              </div>
              <div class="face-detail">
                <label>面对面类型：</label>
                <input type="text" class="input-img" v-model="faceDetailInfo.fieldName" disabled />
              </div>
              <div class="face-detail face-remark">
                <label style="width: 115upx">情况记录：</label>
                <textarea :value="faceDetailInfo.situationRecord" :maxlength="-1" disabled></textarea>
              </div>
            </div>
          </div>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import neilModal from "@/components/neil-modal/neil-modal.vue";
import ePicker from "@/components/e-picker/e-picker.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import { dateFormat, currentPage } from "@/common/utils/util.js";
import Api from "@/common/api";
import { mapMutations } from "vuex";
import faceColumns from "@/static/mock/faceColumns.json";

export default {
  components: {
    neilModal,
    ePicker,
    xflSelect,
  },
  data() {
    return {
      currentPage: 1,
      // 面对面民警列表
      policeList: [],
      // 面对面类型列表
      faceTypeList: [],
      // 登记时间
      regDate: dateFormat("YYYY-MM-DD hh:mm:ss", new Date()),
      // 查询日期
      recordDate: dateFormat("YYYY-MM-DD", new Date()),
      // 面对面类型
      faceType: "",
      // 情况记录
      faceRemark: "",
      // 面对面民警信息
      policeInfo: {},
      // 面对面记录表头
      faceColumns: faceColumns,
      // 面对面记录列表
      faceRecordList: [],
      // 面对面详情弹框
      showDetailModal: false,
      // 面对面详情
      faceDetailInfo: {},
    };
  },
  computed: {
    // 监室信息
    roomInfo() {
      let info = {
        roomNo: uni.getStorageSync("terminalInfo").roomNo,
        roomName: uni.getStorageSync("terminalInfo").roomName,
      };
      return info;
    },
  },
  created() {
    // 获取民警信息
    this.getPoliceInfo();
    // 获取面对面类型
    this.getFaceType();
  },
  destroyed() {
    this.showDetailModal = false;
  },
  methods: {
    ...mapMutations({
      // 设置当前页面
      setCurrentTab: "app/SET_CURRENTTAB",
    }),
    // 重置倒计时
    initCountTimeout() {
      currentPage().initCountTimeout();
    },
    // 菜单切换
    switchPage(index) {
      this.currentPage = index;
      if (this.currentPage == 2) {
        this.queryFaceRecord();
      }
    },
    // 获取民警信息
    async getPoliceInfo() {
      let roomNo = uni.getStorageSync("terminalInfo").roomNo;
      let res = await Api.apiCall(
        "get",
        Api.police.getRoomPoliceInfo + `?roomNo=${roomNo}`,
        null
      );
      if (res.state.code == "200") {
        this.policeList = res.data;
      }
    },
    // 获取面对面类型
    async getFaceType() {
      let res = await Api.apiCall("get", Api.police.getFaceType, null);
      if (res.state.code == "200") {
        this.faceTypeList = res.data.data;
      }
    },
    // 选择面对面民警
    selectPolice(item) {
      this.policeInfo.code = item.orignItem.code;
      this.policeInfo.value = item.orignItem.value;
    },
    // 清空面对面民警
    clearSelectPolice() {
      this.policeInfo = {};
    },
    // 选择面对面类型
    selectFaceType(item) {
      this.faceType = item.orignItem.code;
      this.faceRemark = item.orignItem.value;
    },
    // 清空面对面类型
    clearFaceType() {
      this.faceType = "";
      this.faceRemark = "";
    },
    // 选择登记时间
    selectRegDate(e) {
      this.regDate = e;
    },
    // 情况记录
    faceRemarkChange(e) {
      this.faceRemark = e.target.value;
      currentPage().initSpecialTimeout();
    },
    // 取消登记
    cancelFaceReg() {
      this.setCurrentTab(1);
    },
    // 保存面对面登记
    async saveFaceRegister() {
      if (!Object.keys(this.policeInfo).length) {
        currentPage().handleShowToast("请选择面对面民警", "center");
        return;
      }
      if (!this.faceType) {
        currentPage().handleShowToast("请选择面对面类型", "center");
        return;
      }
      let startTime = currentPage().readCardTime;
      let params = {
        startTime,
        roomNo: this.roomInfo.roomNo,
        accountName: this.policeInfo.code,
        registerTime: this.regDate,
        faceType: this.faceType,
        situationRecord: this.faceRemark,
      };
      let res = await Api.apiCall("post", Api.police.saveFaceRegister, params);
      if (res.state.code == "200") {
        currentPage().handleShowToast("提交面对面记录成功！");
      }
    },
    // 选择查询日期
    selectRecordDate(e) {
      this.recordDate = e;
    },
    // 查询面对面记录
    async queryFaceRecord() {
      this.faceRecordList = [];
      let params = {
        data: {
          roomNo: this.roomInfo.roomNo,
          accountName: this.policeInfo.code,
          registerTime: this.recordDate,
          faceType: this.faceType,
        },
        pageParam: {
          pageIndex: 1,
          pageSize: 15,
        },
      };
      let res = await Api.apiCall("post", Api.police.getFaceRecord, params);
      if (res.state.code == "200") {
        this.faceRecordList = res.data;
        if (this.faceRecordList.length) {
          this.faceRecordList.map((item) => {
            item.accountName = this.policeInfo.value;
            item.registerTime = dateFormat(
              "YYYY-MM-DD hh:mm:ss",
              new Date(item.registerTime)
            );
          });
        } else {
          currentPage().handleShowToast("暂无数据", "center");
        }
      }
    },
    // 查看面对面管理详情
    getFaceDetailInfo(item) {
      this.faceDetailInfo = item;
      this.showDetailModal = true;
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

<style lang="less">@import '../../../common/less/index.less';</style>
