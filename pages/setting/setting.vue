<template>
  <div class="setting-container">
    <scroll-view scroll-y="true" class="setting-modal-scroll">
      <uni-grid :column="4" :show-border="false" :square="false" @change="setMenuClick">
        <uni-grid-item class="setting-menu-item" v-for="(item, index) in settingMenu" :key="index">
          <div class="setting-image-box" :class="index % 2 ? 'bgStyle-two' : 'bgStyle-one'" @click="setMenuClick(index)">
            <image :src="item.image" mode="aspectFill"></image>
          </div>
          <text>{{ item.name }}</text>
        </uni-grid-item>
      </uni-grid>
    </scroll-view>
    <!-- 本机设置菜单 -->
    <neil-modal :show="showSystemMenu">
      <div class="device-modal-container">
        <div class="modal-header">
          <div class="modal-title">
            <text>系统设置</text>
          </div>
          <div class="modal-close" @click="closeModal('SystemMenu')">
            <image src="/static/images/common/close.png"></image>
          </div>
        </div>
        <div class="page-horizontal-divider"></div>
        <scroll-view scroll-y="true" class="device-menu-scroll">
          <ul>
            <li @click="showNavigationBar">显示状态栏</li>
            <li @click="hideNavigationBar">隐藏状态栏</li>
            <li @click="openModal('RestartDev')">设备重启</li>
            <li @click="openModal('RestartApp')">应用重启</li>
            <li @click="openModal('ConfigInfo')">同步配置信息</li>
            <li @click="getUpdateAppInfo(0)">升级APP</li>
            <li @click="echoCalibrate">回声校准</li>
            <li @click="openCrashHandle">开启守护</li>
            <li @click="closeCrashHandle">关闭守护</li>
          </ul>
        </scroll-view>
      </div>
    </neil-modal>
    <!-- 设备重启弹框 -->
    <neil-modal :show="showRestartDev">
      <div class="common-modal-container">
        <div class="common-modal-content">
          <text>是否重启设备？</text>
        </div>
        <div class="common-modal-button">
          <div class="btn-cancel" @click="closeModal('RestartDev')">取消</div>
          <div class="btn-confirm" @click="handleRestartDev">
            确定
          </div>
        </div>
      </div>
    </neil-modal>
    <!-- 应用重启弹框 -->
    <neil-modal :show="showRestartApp">
      <div class="common-modal-container">
        <div class="common-modal-content">
          <text>是否重启应用？</text>
        </div>
        <div class="common-modal-button">
          <div class="btn-cancel" @click="closeModal('RestartApp')">取消</div>
          <div class="btn-confirm" @click="handleRestartApp">
            确定
          </div>
        </div>
      </div>
    </neil-modal>
    <!-- 同步配置信息弹框 -->
    <neil-modal :show="showConfigInfo">
      <div class="common-modal-container">
        <div class="common-modal-content">
          <text>是否同步配置信息？</text>
        </div>
        <div class="common-modal-button">
          <div class="btn-cancel" @click="closeModal('ConfigInfo')">取消</div>
          <div class="btn-confirm" @click="configInfoSync">确定</div>
        </div>
      </div>
    </neil-modal>
    <!-- 升级APP弹框 -->
    <neil-modal :show="showUpdateApp">
      <div class="update-modal-container">
        <div class="modal-header">
          <div class="modal-title">当前版本V{{ appVersion }}</div>
        </div>
        <div class="page-horizontal-divider"></div>
        <scroll-view scroll-y="true" class="update-table-scroll">
          <div class="update-note">{{ updateNote }}</div>
        </scroll-view>
        <div class="update-modal-button">
          <div class="btn-cancel" @click="closeModal('UpdateApp')">取消</div>
          <div class="btn-confirm" :class="{ 'btn-disabled': disabledClick }" @click="handleUpdateApp">
            下载更新
          </div>
        </div>
      </div>
    </neil-modal>
  </div>
</template>

<script>
import uniGrid from "@/components/uni/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni/uni-grid-item/uni-grid-item.vue";
import settingMenu from "@/static/mock/settingMenu.json";
import Api from "@/common/api.js";
import Log from "@/common/utils/log.js";
import { currentPages } from "@/common/utils/util";

export default {
  name: "controlSet",
  components: {
    uniGrid,
    uniGridItem,
  },
  data() {
    return {
      // 系统菜单弹框
      showSystemMenu: false,
      selectedIndex: 0,
      settingMenu: settingMenu,
      // 设备重启弹框
      showRestartDev: false,
      // 应用重启弹框
      showRestartApp: false,
      // 同步配置信息弹框
      showConfigInfo: false,
      // 升级APP弹框
      showUpdateApp: false,
      // APP版本
      appVersion: "",
      // APP更新日志
      updateNote: "",
      // 禁用按钮
      disabledClick: false,
      // APP下载地址
      downloadUrl: "",
    };
  },
  methods: {
    setMenuClick(index) {
      this.selectedIndex = index;
      if (index == 0) {
        this.showSystemMenu = true;
      }
    },
    // 显示状态栏
    showNavigationBar() { },
    // 隐藏状态栏
    hideNavigationBar() { },
    // 重启设备
    handleRestartDev() {
      getApp().globalData.FloatUniModule.rebootSystem();
      uni.closeSocket();
    },
    // 重启应用
    handleRestartApp() {
      currentPages().handleRestartApp();
    },
    // 同步配置信息
    configInfoSync() {
      currentPages().syncSystemInfo();
      this.showConfigInfo = false;
    },
    // 升级APP
    async getUpdateAppInfo(type) {
      let params = {
        data: {
          versionCode: plus.runtime.versionCode,
          deviceType: 1,
        },
      };
      let res = await Api.apiCall("post", Api.index.getUpdateInfo, params);
      if (res.state.code == 200) {
        switch (type) {
          case 0:
            this.appVersion = plus.runtime.version;
            if (res.data.status == 0) {
              this.updateNote = `当前已是最新版本！`;
              this.disabledClick = true;
            } else {
              this.updateNote = res.data.note;
              this.downloadUrl = res.data.url;
            }
            this.showUpdateApp = true;
            break;
          case 1:
            if (res.data.status == 0) {
              console.log("当前已是最新版本！");
            } else {
              this.downloadUrl = res.data.url;
              this.handleUpdateApp();
            }
            break;
        }
      }
    },
    // 下载更新APP
    handleUpdateApp() {
      plus.io.resolveLocalFileSystemURL(
        "/sdcard/Download/update.apk",
        (entry) => {
          console.log("安装包已存在");
          plus.io.resolveLocalFileSystemURL(
            "/sdcard/Download/update.apk",
            (entry) => {
              entry.remove(
                (res) => {
                  console.log("删除文件成功");
                  this.updateControl();
                },
                (err) => {
                  console.log("删除文件失败");
                }
              );
            }
          );
        },
        (err) => {
          console.log("文件夹为空");
          this.updateControl();
        }
      );
    },
    // 下载安装APP
    updateControl() {
      plus.nativeUI.showWaiting("安装包下载中，请稍候...");
      plus.downloader
        .createDownload(
          this.downloadUrl,
          { filename: "/sdcard/Download/update.apk" },
          (d, status) => {
            plus.nativeUI.closeWaiting();
            if (status == 200) {
              getApp().globalData.UpdateApp.install(d.filename, (res) => {
                if (res.state) {
                  console.log("APP安装成功");
                  Log.writeLog("APP安装成功", false);
                } else {
                  console.log("APP安装失败");
                  Log.writeLog("APP安装失败", false);
                }
              });
            } else {
              console.log("安装包下载失败");
              Log.writeLog("安装包下载失败", false);
            }
          }
        )
        .start();
    },
    // 回声校准
    echoCalibrate() { },
    // 开启守护
    openCrashHandle() {
      getApp().globalData.FloatUniModule.openGuard(1);
      console.log("主机开启守护成功");
      Log.writeLog("主机开启守护成功", false);
    },
    // 关闭守护
    closeCrashHandle() {
      getApp().globalData.FloatUniModule.openGuard(0);
      console.log("主机关闭守护成功");
      Log.writeLog("主机关闭守护成功", false);
    },
    // 打开弹框
    openModal(type) {
      this[`show${type}`] = true;
    },
    // 关闭弹框
    closeModal(type) {
      this[`show${type}`] = false;
      if (type == "UpdateApp") {
        this.disabledClick = false;
      }
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
