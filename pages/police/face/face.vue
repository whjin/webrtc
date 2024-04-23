<template>
  <div class="face-container">
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
                <div class="face-select face-remark">
                  <label>现场截图：</label>
                  <div class="upload-image">
                    <div class="take-picture" @click.stop="startTakePicture">
                      <common-icons iconType="iconcamera" size="26" color="#fff" />
                      <text class="text">照片上传</text>
                    </div>
                    <div class="image-list">
                      <div class="image-item" v-for="(item, index) in imageList" :key="item.uri">
                        <image class="image" :src="item.uri" @click.stop="previewImg(item.uri)"></image>
                        <common-icons iconType="icondelete" size="40" color="#fff" @click="deleteImg(index)"
                          :iconStyle="iconStyle" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="face-button-box">
              <div class="face-button button-cancel" @click="cancelFaceReg">
                取消登记
              </div>
              <div class="face-button button-save" @click="handleSaveReg">
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
                  <e-picker mode="date" class="picker-img" @change="selectRecordDate" clearable :placeholder="'请选择登记时间'">
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
              <div class="face-detail face-remark">
                <label style="width: 115upx">现场截图：</label>
                <div class="upload-image">
                  <div class="image-list">
                    <div class="image-item" v-for="(url, index) in faceDetailInfo.urls" :key="index">
                      <image class="image" :src="url" @click.stop="previewImg(url)"></image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 照片预览弹框 -->
      <neil-modal :show="showPreviewModal" :autoClose="true" @close="closeModal('PreviewModal')">
        <div class="preview-modal-box">
          <div class="modal-header">
            <div class="modal-title">照片预览</div>
            <div class="modal-close" @click="closeModal('PreviewModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="modal-horizontal-divider"></div>
          <div class="perview-modal-content">
            <image class="preview-img" :src="previewImgUrl" @click="closeModal('PreviewModal')"></image>
          </div>
        </div>
      </neil-modal>
      <!-- 拍照弹框 -->
      <neil-modal :show="showTakePicture" :autoClose="true" @close="stopFacePreview">
        <div class="common-modal-container picture-modal-container">
          <div class="common-modal-content"></div>
          <div class="common-modal-button">
            <div class="btn-cancel" @click="stopFacePreview">取消</div>
            <div class="btn-confirm" @click.stop="handleTakePicture">拍照</div>
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
import { dateFormat, isNullStr, currentPage } from "@/common/utils/util.js";
import Api from "@/common/api";
import { mapMutations } from "vuex";
import faceColumns from "@/static/mock/faceColumns.json";
import { base64ToPath } from "@/common/utils/imageTools.js";

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
      // 现场截图列表
      imageList: [],
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
      // 拍照弹框
      showTakePicture: false,
      iconStyle: {
        position: "absolute",
        top: "5px",
        right: "5px",
      },
      // 照片预览弹框
      showPreviewModal: false,
      previewImgUrl: "",
      // 禁止重复操作
      isRepeatState: false,
    };
  },
  computed: {
    // 监室信息
    roomInfo() {
      const { roomNo, roomName } = uni.getStorageSync("terminalInfo");
      return { roomNo, roomName };
    },
  },
  created() {
    // 获取民警信息
    this.getPoliceInfo();
    // 获取面对面类型
    this.getFaceType();
    // 开启倒计时
    currentPage().countTimer();
  },
  beforeDestroy() {
    this.stopFacePreview();
  },
  methods: {
    ...mapMutations({
      // 设置当前页面
      setCurrentTab: "app/SET_CURRENTTAB",
    }),
    // 菜单切换
    switchPage(index) {
      this.currentPage = index;
      if (this.currentPage == 2) {
        this.queryFaceRecord();
      }
    },
    // 获取民警信息
    async getPoliceInfo() {
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.police.getRoomPoliceInfo + `?roomNo=${roomNo}`,
        null
      );
      if (res.state.code == 200) {
        this.policeList = res.data;
      }
    },
    // 获取面对面类型
    async getFaceType() {
      let res = await Api.apiCall("get", Api.police.getFaceType, null);
      if (res.state.code == 200) {
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
      this.regDate = dateFormat("YYYY-MM-DD hh:mm:ss", new Date(e));
    },
    // 情况记录
    faceRemarkChange(e) {
      this.faceRemark = e.target.value;
    },
    // 拍照
    handleTakePicture() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1500);
        getApp().globalData.FloatUniModule.takePicture();
      }
    },
    // 开始拍照
    startTakePicture() {
      this.showTakePicture = true;
      this.$nextTick(() => {
        getApp().globalData.FloatUniModule.initFrame();
        getApp().globalData.FloatUniModule.setLocalVideoViewPosition(
          420,
          210,
          440,
          268
        );
        getApp().globalData.FloatUniModule.hideLocalPreView(false);
        getApp().globalData.FloatUniModule.setViewWidthHeight(440, 268);
        getApp().globalData.FloatUniModule.startTakeFrame();
        getApp().globalData.FloatUniModule.takePictureCallBack((res) => {
          let base64Str = res.bytes.replace(/[\r\n]/g, "");
          base64ToPath(`data:image/jpeg;base64,${base64Str}`).then((uri) => {
            this.stopFacePreview();
            if (this.imageList.length < 4) {
              this.imageList.push({ uri });
            } else {
              currentPage().handleShowToast("最多上传4张照片", "center");
            }
          });
        });
      });
    },
    // 关闭相机
    stopFacePreview() {
      this.showTakePicture = false;
      getApp().globalData.FloatUniModule.hideLocalPreView(true);
      getApp().globalData.FloatUniModule.stopTakeFrame();
    },
    // 预览照片
    previewImg(url) {
      this.previewImgUrl = url;
      this.showPreviewModal = true;
    },
    // 删除照片
    deleteImg(index) {
      this.imageList.splice(index, 1);
    },
    // 保存登记
    handleSaveReg() {
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
        imageId: "",
      };
      if (this.imageList.length) {
        this.uploadImg(params);
      } else {
        this.saveFaceRegister(params);
      }
    },
    // 上传图片
    uploadImg(params) {
      this.imageList.map((item, index) => (item.name = `image${index}`));
      const baseUrl = uni.getStorageSync("baseUrl");
      uni.uploadFile({
        url: baseUrl + Api.index.upload,
        files: this.imageList,
        formData: {
          fileType: "SECURITY_CHECK_IMAGE",
        },
        header: {
          "Content-Type": "multipart/form-data",
        },
        success: (res) => {
          let data = JSON.parse(res.data);
          if (data.state.code == 200) {
            let imgIdList = data.data;
            params.imageId = imgIdList.toString();
            this.saveFaceRegister(params);
          }
        },
      });
    },
    // 保存登记
    async saveFaceRegister(params) {
      let res = await Api.apiCall("post", Api.police.saveFaceRegister, params);
      if (res.state.code == 200) {
        currentPage().handleShowToast("提交面对面记录成功！");
      }
    },
    // 取消登记
    cancelFaceReg() {
      currentPage().onClickBack();
    },
    // 选择查询日期
    selectRecordDate(e) {
      this.recordDate = isNullStr(e)
        ? ""
        : dateFormat("YYYY-MM-DD", new Date(e));
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
      if (res.state.code == 200) {
        this.faceRecordList = res.data;
        if (this.faceRecordList.length) {
          this.faceRecordList.map((item) => {
            item.accountName = this.policeInfo.value;
            item.registerTime = dateFormat(
              "YYYY-MM-DD hh:mm",
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
    closeModal(type) {
      this[`show${type}`] = false;
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
