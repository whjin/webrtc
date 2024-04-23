<template>
  <div class="bgmain-container">
    <nav-bar @click-init="onClickInitSet" />
    <view class="main-area">
      <controlIndex v-if="tagIndex == 41" ref="home"></controlIndex>
      <controlIntercom v-else-if="tagIndex == 42" ref="intercom"></controlIntercom>
      <control-radio v-else-if="tagIndex == 43" ref="radio"></control-radio>
      <control-audio v-else-if="tagIndex == 44" ref="audio"></control-audio>
      <control-video v-else-if="tagIndex == 45" ref="video"></control-video>
      <control-set v-else-if="tagIndex == 46" ref="setting"></control-set>
      <control-manager v-else-if="tagIndex == 47" ref="manager"></control-manager>
      <control-call v-else-if="tagIndex == 48" ref="call"></control-call>
    </view>
    <bottom-tab ref="bottomtab" @click-change="handleTagChange" />
    <div class="neil-modal-container">
      <!-- APP配置-基础URL -->
      <neil-modal :show="showUrlConfig" @close="closeModal('UrlConfig')">
        <view style="width: 600upx; height: 400upx">
          <view class="uni-flex model-bar">
            <view class="uni-flex-item model-bar-title">
              APP配置-基础URL
              <text style="font-size: 20upx; color: #ff0000">(非专业人员请勿操作)</text>
            </view>
          </view>
          <view class="page-horizontal-divider"></view>
          <view style="padding: 15upx 50upx; height: 100%">
            <view class="uni-flex" style="align-items: center; height: 100upx">
              <text style="flex: 1; font-size: 20upx">基础Url：</text>
              <input style="flex: 4" class="input-baseurl" v-model="baseUrl" placeholder="http://ip:port/" />
            </view>
            <view class="uni-flex" style="
                align-items: center;
                justify-content: center;
                height: 100upx;
              ">
              <view class="page-button" @click="setBaseUrl">下一步</view>
            </view>
            <view style="
                color: rgba(220, 220, 220, 0.3);
                font-size: 14upx;
                text-align: center;
                margin-top: 80upx;
              " @click="clearALLCache">
              广州市高科通信技术股份有限公司版权所有
            </view>
          </view>
        </view>
      </neil-modal>
      <!-- APP配置-系统缓存 -->
      <neil-modal :show="showCacheConfig" @close="closeModal('CacheConfig')">
        <view style="width: 600upx; height: 400upx">
          <view class="uni-flex model-bar">
            <view class="uni-flex-item model-bar-title">
              APP配置-系统缓存
              <text style="font-size: 20upx; color: #ff0000" @click="closeModal('CacheConfig')">(非专业人员请勿操作)</text>
            </view>
          </view>
          <view class="page-horizontal-divider"></view>
          <view style="padding: 15upx 35upx; height: 100%">
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx">系统缓存：{{ sysCacheInfo }}</text>
            </view>
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx">终端服务：{{ sysWebSocketInfo }}</text>
            </view>
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx">本机Ip：</text>
              <input style="flex: 4" class="input-baseurl" v-model="controlIP" placeholder="ip" disabled />
            </view>
            <view class="uni-flex" style="
                align-items: center;
                justify-content: center;
                height: 100upx;
              ">
              <view class="page-button" style="margin-right: 60upx; width: 135upx" @click="setAllSettingCache">加载系统缓存
              </view>
              <view class="page-button" style="margin-right: 60upx; width: 135upx" @click="setAllBindInfo">认证终端信息</view>
              <view class="page-button-empty" @click="closeCacheConfig">关闭</view>
            </view>
          </view>
        </view>
      </neil-modal>
      <!-- 密码验证弹框 -->
      <keyboard :show="showSystemPwd" :failSystemPwd="failSystemPwd" ref="keyboard" @getPassword="getPassword"
        @hideKey="hideKeyModal"></keyboard>
      <!-- 设备离线弹框 -->
      <neil-modal :show="showDevOffline">
        <div class="offline-modal-container">
          <div class="modal-header">
            <div class="modal-title">温馨提示</div>
            <div class="modal-close" @click="closeModal('DevOffline')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="page-horizontal-divider"></div>
          <div class="offline-modal-box">
            <common-icons type="iconalarm" size="86" color="#fff"></common-icons>
            <text class="offline-content">网络异常，设备连接失败！({{ reconnectCount }})</text>
          </div>
        </div>
      </neil-modal>
      <!-- 服务离线弹框 -->
      <neil-modal :show="showServeOffline">
        <div class="offline-modal-container">
          <div class="modal-header">
            <div class="modal-title">温馨提示</div>
          </div>
          <div class="page-horizontal-divider"></div>
          <div class="offline-modal-box">
            <common-icons type="iconalarm" size="86" color="#fff"></common-icons>
            <text class="offline-content">{{ serveOfflineContent }}</text>
          </div>
        </div>
      </neil-modal>
      <div class="emergence-alarm-modal">
        <!-- 应急报警弹框 -->
        <div v-if="isOpenAlarm" class="emergence-alarm-main">
          <v-alarm @close-alarm="closeAlarmModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonIcons from "@/components/common-icons/common-icons.vue";
import navBar from "@/components/nav-bar/nav-bar.vue";
import bottomTab from "@/components/bottom-tab/bottom-tab.vue";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import keyboard from "@/components/dt-keyboard/dt-keyboard.vue";
import controlIndex from "@/pages/index/index.vue";
import controlIntercom from "@/pages/intercom/intercom.vue";
import controlRadio from "@/pages/radio/radio.vue";
import controlAudio from "@/pages/audio/audio.vue";
import controlVideo from "@/pages/video/video.vue";
import controlSet from "@/pages/setting/setting.vue";
import controlManager from "@/pages/manager/manager.vue";
import controlCall from "@/pages/call/call.vue";
import vAlarm from "@/components/v-alarm/v-alarm.vue";
import { isNullStr, dateFormat, currentPages } from "@/common/utils/util.js";
import Log from "@/common/utils/log.js";
import Api from "@/common/api.js";
import { mapState, mapMutations, mapActions } from "vuex";
import menuList from "@/static/mock/menuList.json";
import { startLive } from "@/static/js/webrtc.js";

export default {
  name: "bgMain",
  components: {
    commonIcons,
    navBar,
    bottomTab,
    neilModal,
    controlIndex,
    controlIntercom,
    controlRadio,
    controlAudio,
    controlVideo,
    controlSet,
    controlManager,
    controlCall,
    vAlarm,
    keyboard,
  },
  data() {
    return {
      tagIndex: 41,
      clickNums: 0,
      showUrlConfig: false,
      showCacheConfig: false,
      baseUrl: "",
      sysCacheInfo: "",
      sysWebSocketInfo: "",
      isWebSocketDisable: false,
      // 密码验证弹框
      showSystemPwd: false,
      // 密码验证失败
      failSystemPwd: false,
      // 应急报警计时器
      alarmTimer: null,
      // 应急报警信息
      alarmInfo: {},
      // 设备离线提示弹框
      showDevOffline: false,
      // 服务离线提示弹框
      showServeOffline: false,
      // 服务离线提示信息
      serveOfflineContent: "",
      // 网络异常监听定时器
      heartbeatTimer: null,
      // 网络异常计时
      heartBeatTimeOut: uni.getStorageSync("heartBeatTimeOut"),
      // 终端配置状态
      initState: false,
      // 禁止重复操作（报警）
      isAlarmRepeat: false,
      // webSocket 会话对象
      socketTask: null,
      // socket重连次数
      reconnectCount: 0,
      // 对讲类型,0-监室监听 1-视频对讲
      intercomType: 0,
      // 按键SIP信息
      deviceSipInfo: {},
      // 是否收到心跳
      isHeartbeat: false,
      // 分机对讲信息
      terminalInfo: {},
    };
  },
  computed: {
    ...mapState({
      // 对讲信息
      intercomInfo: (state) => state.app.intercomInfo,
      // 视频对讲状态
      openIntercom: (state) => state.app.openIntercom,
      // 监视监听轮巡状态
      isPolling: (state) => state.app.isPolling,
      // 对讲弹框状态
      isOpenModal: (state) => state.app.isOpenModal,
      // 报警弹框状态
      isOpenAlarm: (state) => state.app.isOpenAlarm,
      // 未接来电状态
      missCallState: (state) => state.app.missCallState,
      // 视频通话列表
      chatList: (state) => state.app.chatList,
      // 应急报警列表
      alarmList: (state) => state.app.alarmList,
      // 监视监听状态
      monitorState: (state) => state.app.monitorState,
      // 呼叫方状态
      callState: (state) => state.app.callState,
    }),
    // 主机IP
    controlIP() {
      return this.$config.controlIP;
    },
  },
  onLoad() {
    this.reconnectCount = 0;
    this.clickNums = 0;
    //初始化配置-基础Url
    if (isNullStr(uni.getStorageSync("baseUrl"))) {
      this.baseUrl = this.$config.baseUrl;
      this.openModal("UrlConfig");
    } else {
      this.baseUrl = uni.getStorageSync("baseUrl");

      // 获取APP配置菜单
      this.getAppMenuList();
      // 同步配置信息
      this.configInfoSync();
      // 修改主机信息
      // this.setControlInfo();
      // 获取未接来电信息
      this.getMissCallInfo();

      //websocket连接
      if (!getApp().globalData.webSocketConnected) {
        if (!isNullStr(uni.getStorageSync("controlInfo").controlCode)) {
          //初始化配置WS服务
          this.connectWebSocketInit(
            uni.getStorageSync("controlInfo").controlCode
          );
        } else {
          this.setAllBindInfo();
        }
      }
      // 服务离线弹框
      uni.$on("serve-Offline", (state, msg = "") => {
        this.showServeOffline = state;
        this.serveOfflineContent = msg;
      });
    }
  },
  mounted() {
    // 获取摄像头权限
    startLive();
    // 连接RabbitMQ服务
    this.connectServer();
  },
  destroyed() {
    clearInterval(this.alarmTimer);
    this.clickNums = 0;
    uni.hideToast();
    uni.$off("serve-Offline");
  },
  methods: {
    ...mapMutations({
      // 设置视频对讲状态
      setOpenIntercom: "app/SET_OPENINTERCOM",
      // 设置挂断按钮状态
      setHangupState: "app/SET_HANGUPSTATE",
      // 视频流地址
      setNodePlayUrl: "app/SET_NODEPLAYURL",
      // 设置报警弹框状态
      setIsOpenAlarm: "app/SET_ISOPENALARM",
      // 设置未接来电数
      setMissCallNum: "app/SET_MISSCALLNUM",
      // 设置未接来电状态
      setMissCallState: "app/SET_MISSCALLSTATE",
      // 设置报警监室名
      setAlarmName: "app/SET_ALARMNAME",
      // 保存对讲信息
      setIntercomInfo: "app/SET_INTERCOMINFO",
      // 保存未接来电列表
      setMissCallList: "app/SET_MISSCALLLIST",
      // 设置呼叫方状态
      setCallState: "app/SET_CALLSTATE",
      // 设置TAB状态列表
      setTabList: "app/SET_TABLIST",
      // 设置菜单列表
      setMenuList: "app/SET_MENULIST",
      // 设置禁止Tab切换
      setDisableTab: "app/SET_DISABLETAB",
    }),
    ...mapActions({
      // 新增未接报警信息
      addMissAlarmInfo: "app/addMissAlarmInfo",
      // 删除超时请求信息
      deleteOvertimeCall: "app/deleteOvertimeCall",
    }),
    // 连接RabbitMQ服务
    connectServer() {
      const ws = new WebSocket("ws://localhost:15674/ws");
      const client = Stomp.over(ws);

      client.connect("admin", "admin", () => {
        console.log("连接RabbitMQ成功！");
        client.subscribe("/exchange/control_mq/control_msg", message => {
          console.log("收到的数据：", message);
        }, error => {
          console.log("订阅主题失败", error);
        });
      }, err => {
        console.log("连接RabbitMQ失败！", err);
      });
    },
    // 主机视频通话
    intercomHandler(res) {
      if (this.tagIndex == 42) {
        // 视频对讲中消息回传
        let { page, checked, setDynamicInfo, monitorSelect } =
          this.$refs.intercom;
        if (res.eventID == 4 && !this.isPolling && !checked.managerType) {
          const { controlCode } = uni.getStorageSync("controlInfo");
          if (page == 0) {
            // 主机拨通分机消息
            currentPages().sendWebsocket(
              `{maindevno:"${controlCode}",devno:"${checked.terminalCode}",type:"100",msg:"12"}`,
              () => {
                this.setTalkViewSuccess();
              },
              () => {
                this.setTalkViewFail(res);
              }
            );
          } else {
            // 主机拨通主机消息
            if (this.callState) {
              currentPages().sendWebsocket(
                `{maindevno:"${controlCode}",devno:"${checked.controlCode}",type:"100",msg:"17"}`,
                () => {
                  this.setTalkViewSuccess();
                },
                () => {
                  this.setTalkViewFail(res);
                }
              );
            }
          }
          setDynamicInfo("100", `开启${checked.name}视频对讲`);
        } else {
          this.setTalkViewSuccess();
          if (monitorSelect.id == "0") {
            setDynamicInfo("100", `开始${checked.name}监视监听`);
          }
        }
      }
    },
    setTalkViewSuccess() {
      this.handleShowToast("正在加载对讲画面，请稍候...", "center", 5000);
      this.$refs.intercom.closeIntercomModal();
      this.setOpenIntercom(true);
      this.setHangupState(true);
      getApp().globalData.FloatUniModule.setTalkViewPosition(
        364,
        178,
        1156,
        760
      );
    },
    setTalkViewFail(res) {
      const { masterNum, slaveNum, devRegType } = res;
      console.log("挂断对讲：", 0, masterNum, slaveNum, devRegType);
      getApp().globalData.FloatUniModule.nativeHangup(
        0,
        masterNum,
        slaveNum,
        devRegType
      );
    },
    // 挂断视频通话
    stopIntercom() {
      console.log("挂断视频通话:", this.openIntercom);
      if (this.tagIndex == 42 && this.openIntercom && !this.isPolling) {
        if (this.intercomType == 1) {
          this.voiceBroadcast("对讲已挂断");
          const { controlCode } = uni.getStorageSync("controlInfo");
          const devno = Reflect.has(this.intercomInfo, "controlCode")
            ? this.intercomInfo.controlCode
            : this.intercomInfo.terminalCode;
          currentPages().sendWebsocket(
            `{maindevno:"${controlCode}",devno:"${devno}",type:"100",msg:"1"}`
          );
        }
        this.$refs.intercom.stopIntercomHandler();
        this.setDisableTab(false);
      }
    },
    // 接听视频通话
    answerIntercom(res) {
      this.handleShowToast("正在加载对讲画面，请稍候...", "center", 5000);
      this.setOpenIntercom(true);
      this.setHangupState(true);
      let { masterNum, slaveNum, devRegType } = res;
      console.log("接听主机：", 0, masterNum, slaveNum, devRegType);
      getApp().globalData.FloatUniModule.nativeAnswer(
        0,
        masterNum,
        slaveNum,
        devRegType
      );
    },
    // 取消视频通话
    cancelIntercom(res) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let intercomName = this.intercomInfo.name;
      let terminalCode = "";
      if (Reflect.has(this.intercomInfo, "controlCode")) {
        terminalCode = this.intercomInfo.controlCode;
      } else {
        terminalCode = this.intercomInfo.terminalCode;
      }
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"6"}`
      );
      if (this.tagIndex == 42) {
        this.$refs.intercom.clearCallTimer();
        this.setOpenIntercom(false);
        this.setCallState(false);
        let { masterNum, slaveNum, devRegType } = res;
        console.log("挂断对讲：", 0, masterNum, slaveNum, devRegType);
        getApp().globalData.FloatUniModule.nativeHangup(
          0,
          masterNum,
          slaveNum,
          devRegType
        );
        this.$refs.intercom.setDynamicInfo(
          "100",
          `取消${intercomName}视频对讲`
        );
      }
    },
    // 取消防拆报警
    cancelAlarm(res) {
      this.setCallState(false);
      let { masterNum, slaveNum, devRegType } = res;
      console.log("取消防拆：", 0, masterNum, slaveNum, devRegType);
      getApp().globalData.FloatUniModule.nativeHangup(
        0,
        masterNum,
        slaveNum,
        devRegType
      );
    },
    // 修改主机信息
    async setControlInfo() {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        data: {
          id: uni.getStorageSync("controlInfo").id,
          code: controlCode,
          version: plus.runtime.version,
        },
      };
      let res = await Api.apiCall("post", Api.index.updateControl, params);
      if (res.state.code == 200) {
        console.log("修改信息成功");
      }
    },
    // 获取未接来电信息
    async getMissCallInfo() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let res = await Api.apiCall(
        "get",
        Api.index.getMissCallInfo + `?controlId=${controlId}`,
        null
      );
      if (res.state.code == 200) {
        this.setMissCallList(res.data);
        this.setMissCallNum(res.data.length);
      }
    },
    // 重启应用
    handleRestartApp() {
      this.closeSocket();
      // getApp().globalData.Base.rebootApp("com.gksc.control");
      location.reload();
    },
    // 消息提示
    handleShowToast(title, position = "bottom", duration = 1500) {
      uni.showToast({
        title: title,
        position: position,
        duration: duration,
        icon: "none",
      });
    },
    // 功能页面切换
    handleTagChange(item) {
      if (this.tagIndex != item.id) {
        if (this.isPolling) {
          this.$refs.intercom.hangupMonitor().then(() => {
            this.$refs.intercom.stopMonitor();
          });
        } else {
          if (this.tagIndex == 42) {
            this.setMissCallState();
            if (this.missCallState) {
              this.handleShowToast("请先处理当前业务");
              return;
            }
          }
        }
        if (item.id == 46) {
          this.showSystemPwd = true;
        }
        this.tagIndex = item.id;
      }
    },
    onClickInitSet() {
      if (this.clickNums == 3) {
        this.clickNums = 0;
        this.initState = true;
        this.showSystemPwd = true;
      } else {
        if (this.clickNums == 2) {
          currentPages().handleShowToast("连续点击三次");
        }
        this.clickNums = this.clickNums + 1;
      }
    },
    setBaseUrl() {
      if (!isNullStr(this.baseUrl)) {
        uni.setStorageSync("baseUrl", this.baseUrl);
        this.closeModal("UrlConfig");
        this.openModal("CacheConfig");
        if (!uni.getStorageSync("adminPassword")) {
          uni.setStorageSync("adminPassword", "654321");
        }
      } else {
        uni.showToast({
          title: "url不能为空！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    clearALLCache() {
      uni.showModal({
        title: "提示",
        content: "是否确定清除App所有数据存储缓存？",
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync();
            this.sysCacheInfo = "";
            this.sysWebSocketInfo = "";
            this.webSocketOff();
            if (this.socketTask) {
              this.socketTask.close({
                success: (res) => {
                  console.log(JSON.stringify(res), "关闭WebSocket成功！");
                },
                fail: (err) => {
                  console.log(JSON.stringify(err), "关闭WebSocket失败！");
                },
              });
            }
          } else if (res.cancel) {
          }
        },
      });
    },
    // 加载系统缓存
    async setAllSettingCache() {
      let res = await Api.apiCall("get", Api.index.getSysSetting, null);
      if (res.state.code == 200) {
        let data = res.data;
        data.forEach((x) => {
          if (x.skey) {
            let key = x.skey;
            uni.setStorageSync(`${key}`, x.svalue);
          }
        });
        this.sysCacheInfo = "配置系统缓存成功";
        currentPages().handleShowToast("配置系统缓存成功");
      } else {
        uni.showToast({
          title: "配置系统缓存失败！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 认证终端信息
    async setAllBindInfo() {
      if (this.isWebSocketDisable) {
        this.handleShowToast("请勿重复认证！");
        return;
      }
      let params = {
        ip: this.controlIP,
      };
      uni.setStorageSync("authControlIP", this.controlIP);
      let res = await Api.apiCall(
        "get",
        Api.index.getControlInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (!isNullStr(res.data)) {
          // 设置本地缓存公共方法
          this.setControlStorage(res.data);
          if (!isNullStr(uni.getStorageSync("controlInfo").controlCode)) {
            //初始化配置WS服务
            this.connectWebSocketInit(
              uni.getStorageSync("controlInfo").controlCode
            );
          } else {
            uni.showToast({
              title: "缓存设置失败！！",
              image: "../../../static/images/common/error.png",
              icon: "none",
            });
          }
        } else {
          uni.showToast({
            title: "请先添加终端！",
            image: "../../static/images/common/error.png",
            icon: "none",
          });
        }
        // 获取APP配置菜单
        this.getAppMenuList();
      } else {
        uni.showToast({
          title: "绑定终端信息失败！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 同步认证终端信息
    async AllBindInfoSync() {
      let params = {
        ip: this.controlIP,
      };
      let res = await Api.apiCall(
        "get",
        Api.index.getControlInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (!isNullStr(res.data)) {
          // 设置本地缓存公共方法
          this.setControlStorage(res.data);
          currentPages().handleShowToast("绑定终端信息成功！");
        } else {
          uni.showToast({
            title: "请先添加终端！",
            image: "../../static/images/common/error.png",
            icon: "none",
          });
        }
      } else {
        uni.showToast({
          title: "绑定终端信息失败！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 设置本地缓存公共方法
    setControlStorage(controlInfo) {
      uni.setStorageSync("controlInfo", controlInfo);
    },
    // 同步配置信息
    configInfoSync() {
      this.sysCacheInfo = "";
      // 加载系统缓存
      this.setAllSettingCache();
      // 同步认证终端信息
      this.AllBindInfoSync();
    },
    // 关闭APP配置
    closeCacheConfig() {
      if (isNullStr(this.sysCacheInfo)) {
        uni.showToast({
          title: "系统缓存为空！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      } else if (isNullStr(uni.getStorageSync("controlInfo"))) {
        uni.showToast({
          title: "终端信息为空！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      } else if (!getApp().globalData.webSocketConnected) {
        uni.showToast({
          title: "终端服务连接失败！",
          image: "../../static/images/common/error.png",
          icon: "none",
        });
      } else {
        this.closeModal("CacheConfig");
        this.handleRestartApp();
      }
    },
    webSocketReConnect() {
      this.webSocketOff();
      this.reconnectCount++;
      this.connectWebSocketInit(uni.getStorageSync("controlInfo").controlCode);
    },
    webSocketOff() {
      // 离线标记
      // this.showDevOffline = true;
      // websocket 断开标记
      getApp().globalData.webSocketConnected = false;
      // 系统配置信息
      this.sysWebSocketInfo = "";
      // 打开重复认证终端
      this.isWebSocketDisable = false;
    },
    webSocketOn() {
      getApp().globalData.webSocketConnected = true;
      this.sysWebSocketInfo = "已连接";
      this.sysCacheInfo = "配置系统缓存成功！";
      // 禁用重复认证终端
      this.isWebSocketDisable = true;
      this.showDevOffline = false;
      this.reconnectCount = 0;
      console.log("WebSocket连接成功！");
    },
    // 发送WebSocket消息
    sendWebsocket(data, successCB, failCB) {
      this.socketTask && this.socketTask.send({
        data,
        success(res) {
          successCB && successCB();
          console.log("消息发送成功:" + JSON.stringify(data));
        },
        fail(err) {
          failCB && failCB();
          console.log("消息发送失败:" + JSON.stringify(err));
        },
      });
    },
    // webSocket心跳检查，this.heartBeatTimeOut * 1000 时间内未收到服务端心跳，则重新发起连接
    socketHeartbeatCheck() {
      if (this.heartbeatTimer == null) {
        let hearTimeOut = uni.getStorageSync("heartBeatTimeOut");
        this.heartbeatTimer = setInterval(() => {
          // 规定时间内未收到心跳，发起重新连接
          if (!this.isHeartbeat) {
            this.webSocketReConnect();
          }
          // 触发一次检测后重置心跳默认状态
          this.isHeartbeat = false;
        }, hearTimeOut * 1000);
      }
    },
    closeSocket() {
      if (this.socketTask != null) {
        this.socketTask.close({
          success: (res) => { },
          fail: (err) => { },
        });
        this.socketTask = null;
      }
    },
    // WebSocket初始连接
    connectWebSocketInit(code) {
      // 开启心跳检查
      this.socketHeartbeatCheck();
      // 设备离线状态
      if (!getApp().globalData.webSocketConnected) {
        // this.showDevOffline = true;
      } else {
        this.showDevOffline = false;
        return;
      }
      if (this.socketTask != null) {
        this.closeSocket();
      }
      this.socketTask = uni.connectSocket({
        url: uni.getStorageSync("webSocketUrl") + code,
        success(res) {
          // 这里是接口调用成功的回调，不是连接成功的回调，成功逻辑放在 onOpen 中
        },
        fail(err) {
          // 这里是接口调用失败的回调，不是连接失败的回调，失败逻辑放在 onError 中
        },
      });
      this.socketTask.onOpen((res) => {
        this.handleShowToast("终端服务连接成功！");
        this.webSocketOn();
        if (this.tagIndex == 42) {
          this.$refs.intercom.showIntercom();
        }
        if (this.tagIndex == 41) {
          this.$refs.home.getOnlineAlermInfo();
        }
      });
      this.socketTask.onError((err) => { });
      this.socketTask.onClose((res) => { });
      // 接收分机websocket消息
      this.socketTask.onMessage((res) => {
        let info = JSON.parse(res.data);
        console.log(JSON.stringify(info));
        if (info.type == this.$config.controlType.HEARTBEAT) {
          // 收到心跳包
          this.isHeartbeat = true;
          const { controlCode } = uni.getStorageSync("controlInfo");
          currentPages().sendWebsocket(
            `{maindevno:'${controlCode}', devno:'', type:'000', msg:'1',extend:{'ip':'${this.controlIP}'}}`
          );
        } else if (info.type == this.$config.controlType.INTERCOM) {
          if (info.msg == "4" || info.msg == "16" || info.msg == "19") {
            // 主分机|仓外屏发起视频通话
            if ((info.msg == "16" || info.msg == "19") && this.monitorState) {
              const { controlCode } = uni.getStorageSync("controlInfo");
              currentPages().sendWebsocket(
                `{maindevno:"${controlCode}",devno:"${info.devno}",type:"100",msg:"6"}`
              );
              return;
            }
            if (this.tagIndex == 42) {
              this.$refs.intercom.closeIntercomModal();
              if (this.openIntercom && this.isPolling) {
                this.$refs.intercom.hangupMonitor().then(() => {
                  this.$refs.intercom.stopMonitor();
                });
              }
            } else {
              let item = {
                id: 42,
                name: "对讲",
                type: "icontelephone",
                url: "/pages/intercom/intercom",
              };
              this.handleTagChange(item);
              this.$refs.bottomtab.onClickMenu(item);
            }
            this.$nextTick(() => {
              if (this.tagIndex == 42) {
                this.$refs.intercom.videoChatModal(info);
              }
            });
          } else if (info.msg == "1" || info.msg == "22" || info.msg == "26") {
            if (this.tagIndex == 42 && this.openIntercom) {
              if (info.msg == "22") {
                // 挂断仓外屏对讲
                this.$refs.intercom.hangupIntercom();
              }
            }
          } else if (info.msg == "6" || info.msg == "25") {
            // 取消主机|仓外屏视频通话
            if (!info.devno.startsWith("control")) {
              this.voiceBroadcast("对方正忙，请稍后再拨");
              this.$refs.intercom.closeVideoModel(true);
              let intercomName = this.intercomInfo.name;
              if (this.tagIndex == 42) {
                this.$refs.intercom.setDynamicInfo(
                  "100",
                  `取消${intercomName}视频对讲`
                );
              }
              if (Object.keys(this.deviceSipInfo).length) {
                const { masterNum, slaveNum } = this.deviceSipInfo;
                console.log("挂断对讲：", 0, masterNum, slaveNum, 0);
                getApp().globalData.FloatUniModule.nativeHangup(
                  0,
                  masterNum,
                  slaveNum,
                  0
                );
              }
            }
          } else if (info.msg == "8") {
            this.terminalInfo = info;
            if (info.extend == "") {
              // 回传本机音量
              getApp().globalData.FloatUniModule.getStreamVolumeTypeVoiceCall(
                (e) => {
                  currentPages().sendWebsocket(
                    `{maindevno:'${info.maindevno}', devno:'${info.devno}', type:'100', msg:'9',extend:'${e.value}'}`
                  );
                }
              );
            } else {
              // 设置本机音量
              getApp().globalData.FloatUniModule.setStreamVolumeTypeVoiceCall(
                Number(info.extend)
              );
            }
          } else if (info.msg == "9") {
            this.terminalInfo = info;
            // 获取分机音量
            this.$refs.intercom.terminalVolume = Number(info.extend);
          } else if (info.msg == "10") {
            // 主机已离线
            this.setDisableTab(false);
            if (this.tagIndex == 42) {
              let { checked, getRootState } = this.$refs.intercom;
              getRootState(0, checked);
            }
          } else if (info.msg == "13") {
            // 分机视频通话请求超时
            if (this.isOpenModal) {
              if (info.devno == this.intercomInfo.devno) {
                this.$refs.intercom.closeVideoModel();
                this.$refs.intercom.setDynamicInfo(
                  "100",
                  `${this.intercomInfo.name}视频通话超时`
                );
              }
            }
            if (this.chatList.length) {
              this.chatList.map((item) => {
                if (info.devno == item.devno) {
                  this.deleteOvertimeCall(item);
                  this.$refs.intercom.setDynamicInfo(
                    "100",
                    `${item.name}视频通话超时`
                  );
                }
              });
            }
            if (
              !this.chatList.length &&
              !this.alarmList.length &&
              !this.openIntercom
            ) {
              this.setDisableTab(false);
              this.setCallState(false);
            }
            // 更新未接来电列表
            this.getMissCallInfo();
            // 按键对讲请求超时
            if (Object.keys(this.deviceSipInfo).length) {
              const { masterNum, slaveNum } = this.deviceSipInfo;
              console.log("按键对讲超时：", 0, masterNum, slaveNum, 0);
              getApp().globalData.FloatUniModule.nativeHangup(
                0,
                masterNum,
                slaveNum,
                0
              );
            }
          } else if (info.msg == "15") {
            if (this.tagIndex == 42 && this.openIntercom) {
              // 主机自动挂断
              this.$refs.intercom.hangupIntercom();
            }
          } else if (info.msg == "17") {
            // 主机对讲接通
            if (this.tagIndex == 42) {
              this.setHangupState(true);
            }
          } else if (info.msg == "18") {
            // 主机对讲超时
            this.$refs.intercom.closeVideoModel();
            if (
              !this.isOpenModal &&
              !this.chatList.length &&
              !this.alarmList.length &&
              !this.openIntercom
            ) {
              this.setDisableTab(false);
            }
            // 更新未接来电列表
            this.getMissCallInfo();
          } else if (info.msg == "21") {
            // 仓外屏对讲超时
            if (this.openIntercom) {
              this.$refs.intercom.closeVideoModel();
            } else {
              this.$refs.intercom.closeVideoModel(true);
            }
          }
        } else if (info.type == this.$config.controlType.RADIO) {
          // 广播分机连接状态
          if (info.msg == "2") {
            let radioTableInfo = JSON.parse(info.extend);
            this.$refs.radio.getConnectInfo(radioTableInfo);
          } else if (info.msg == "4" || info.msg == "6") {
            // 分机回传音量
            if (this.tagIndex == 43) {
              this.$refs.radio.terminalRadioVolume(info);
            }
          }
        } else if (info.type == this.$config.controlType.AUDIO) {
          if (info.msg == "2") {
            // 分机连接状态
            let roomTableInfo = JSON.parse(info.extend);
            this.$refs.audio.getConnectInfo(roomTableInfo);
          } else if (info.msg == "3") {
            // 分机音频播放信息
            let audioTableInfo = JSON.parse(info.extend);
            if (this.tagIndex == 44) {
              this.$refs.audio.getAudioPlayInfo(audioTableInfo);
            }
          } else if (info.msg == "6") {
            // 分机回传音量
            if (this.tagIndex == 44) {
              this.$refs.audio.terminalAudioVolume(info);
            }
          }
        } else if (info.type == this.$config.controlType.VIDEO) {
          if (info.msg == "2") {
            // 分机连接状态
            let roomTableInfo = JSON.parse(info.extend);
            this.$refs.video.getConnectInfo(roomTableInfo);
          } else if (info.msg == "3") {
            // 分机视频播放信息
            let videoTableInfo = JSON.parse(info.extend);
            if (this.tagIndex == 45) {
              this.$refs.video.getVideoPlayInfo(videoTableInfo);
            }
          } else if (info.msg == "7") {
            // 同步分机音量
            if (this.tagIndex == 45) {
              this.$refs.video.terminalVideoVolume(info);
            }
          }
        } else if (info.type == this.$config.controlType.ALARM) {
          if (info.msg == "0") {
            // 分机应急报警
            let missAlarmInfo = info;
            let extend = JSON.parse(info.extend);
            missAlarmInfo.name = extend.roomName;
            missAlarmInfo.alarmId = extend.alarmId;
            this.setMissCallState();
            if (this.missCallState) {
              this.addMissAlarmInfo(missAlarmInfo);
            } else {
              this.setIsOpenAlarm(true);
              this.audioContext = uni.createInnerAudioContext();
              this.audioContext.autoplay = false;
              this.alarmInfo = extend;
              this.setAlarmName(this.alarmInfo.roomName);
              this.setIntercomInfo(missAlarmInfo);
              this.audioContext.src = "/static/alarm/alarm.mp3";
              this.audioContext.play();
              this.voiceBroadcast(`${this.intercomInfo.name}发生应急报警`);
              this.alarmTimer = setInterval(() => {
                this.voiceBroadcast(`${this.intercomInfo.name}发生应急报警`);
                this.audioContext.play();
              }, 5000);
            }
            if (this.tagIndex == 42) {
              // getApp().globalData.Base.speechStop();
              this.$refs.intercom.closeIntercomModal();
              if (this.openIntercom && this.isPolling) {
                this.$refs.intercom.hangupMonitor().then(() => {
                  this.$refs.intercom.stopMonitor();
                });
              }
            }
            if (this.tagIndex == 46) {
              this.showSystemPwd = false;
            }
          } else if (info.msg == "4") {
            // 应急报警请求超时
            if (this.isOpenAlarm) {
              clearInterval(this.alarmTimer);
              this.setIsOpenAlarm(false);
              this.audioContext.stop();
              this.saveAlarmInfo(this.intercomInfo.alarmId, "n");
              this.setAlarmDynamicInfo(`${this.intercomInfo.name}应急报警超时`);
            } else {
              if (this.alarmList.length) {
                this.alarmList.map((item) => {
                  if (info.devno == item.devno) {
                    this.deleteOvertimeCall(item);
                    this.saveAlarmInfo(item.alarmId, "n");
                    this.setAlarmDynamicInfo(`${item.name}应急报警超时`);
                  }
                });
              }
            }
            if (
              !this.chatList.length &&
              !this.alarmList.length &&
              !this.openIntercom
            ) {
              this.setDisableTab(false);
              this.setCallState(false);
            }
            // 更新未接来电列表
            this.getMissCallInfo();
            // 按键报警请求超时
            if (Object.keys(this.deviceSipInfo).length) {
              const { masterNum, slaveNum } = this.deviceSipInfo;
              console.log("挂断对讲：", 0, masterNum, slaveNum, 0);
              getApp().globalData.FloatUniModule.nativeHangup(
                0,
                masterNum,
                slaveNum,
                0
              );
            }
          }
        } else if (info.type == this.$config.controlType.DEVICE) {
          let content = {
            content: info.extend,
          };
          if (info.msg == "0") {
            console.log("开始语音播报");
            // getApp().globalData.Base.speech(content);
          } else if (info.msg == "1") {
            console.log("停止语音播报");
            // getApp().globalData.Base.speechStop();
          } else if (info.msg == "2") {
            console.log("设备校时");
          } else if (info.msg == "3") {
            // 设备重启
            getApp().globalData.FloatUniModule.rebootSystem();
            uni.closeSocket();
          } else if (info.msg == "6") {
            // 同步配置信息
            this.configInfoSync();
          } else if (info.msg == "7") {
            // 自动升级APP
            if (this.tagIndex == 46) {
              this.$refs.setting.getUpdateAppInfo(1);
            } else {
              let item = {
                id: 46,
                name: "设置",
                type: "iconsetting",
                url: "/pages/setting/setting",
              };
              this.handleTagChange(item);
              this.$refs.bottomtab.onClickMenu(item);
              this.$nextTick(() => {
                if (this.tagIndex == 46) {
                  this.$refs.setting.getUpdateAppInfo(1);
                }
              });
            }
          } else if (info.msg == "8") {
            // 应用重启
            if (this.tagIndex == 42 && this.openIntercom) {
              this.$refs.intercom.hangupIntercom();
            }
            this.handleRestartApp();
          } else if (info.msg == "9") {
            // 首页数据刷新
            if (this.tagIndex == 41) {
              // 获取在线报警情况
              this.$refs.home.getOnlineAlermInfo();
              // 获取动态信息
              this.$refs.home.getDynamicInfo(true);
            }
          } else if (info.msg == "10") {
            // 回声消除
          } else if (info.msg == "11") {
            // 开启守护
            getApp().globalData.FloatUniModule.openGuard(1);
            console.log("开启守护成功");
          } else if (info.msg == "12") {
            // 关闭守护
            getApp().globalData.FloatUniModule.openGuard(0);
            console.log("关闭守护成功");
          } else if (info.msg == "13") {
            Log.uploadLogFile(content.content);
          } else if (info.msg == "15") {
            // 打开设备ADB
            getApp().globalData.UpdateApp.shell(
              {
                command: "start adbd",
                root: true,
              },
              (res) => {
                console.log("打开ADB：", JSON.stringify(res));
              }
            );
          } else if (info.msg == "16") {
            // 关闭设备ADB
            getApp().globalData.UpdateApp.shell(
              {
                command: "stop adbd",
                root: true,
              },
              (res) => {
                console.log("关闭ADB：", JSON.stringify(res));
              }
            );
          }
        }
      });
    },
    // 根据来邦slaveNum获取分机信息
    async getTerminalSipInfo(eventID, sip) {
      let type = eventID == 11 ? 2 : 1;
      await Api.apiCall(
        "get",
        Api.index.getTerminalBySip + `?sip=${sip}&type=${type}`,
        null
      );
    },
    // 更新应急报警信息
    async saveAlarmInfo(id, status) {
      let receiveControlId = uni.getStorageSync("controlInfo").id;
      let params = { id, status, receiveControlId };
      let res = await Api.apiCall("post", Api.index.updateAlarmInfo, params);
      if (res.state.code == 200) {
        this.setIsOpenAlarm(false);
        this.handleShowToast(`${res.state.msg}`);
      }
    },
    // 新增应急报警操作动态
    async setAlarmDynamicInfo(content) {
      let controlId = uni.getStorageSync("controlInfo").id;
      let operationTime = dateFormat("YYYY-MM-DD", new Date());
      let params = {
        controlId,
        type: "500",
        content,
        operationTime,
      };
      let res = await Api.apiCall(
        "post",
        Api.index.setDynamicInfo,
        JSON.stringify(params)
      );
      if (res.state.code == 200) {
        if (this.tagIndex == 41) {
          // 获取动态信息
          this.$refs.home.getDynamicInfo(false);
        }
        this.handleShowToast("保存应急报警动态成功");
      } else {
        this.handleShowToast("请求错误", "center");
      }
    },
    // 打开未接来电弹框
    openMissCallModal() {
      if (this.tagIndex == 42) {
        this.$refs.intercom.toggleMissCallModal();
      }
    },
    // 获取APP配置菜单
    async getAppMenuList() {
      const { areaCode } = uni.getStorageSync("controlInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getAppModuleConf + `?device=control&unitCode=${areaCode}`,
        null
      );
      if (res.state.code == 200) {
        if (res.data.length) {
          let tabs = res.data.map((item) => item.url);
          let tabList = [];
          tabList[0] = tabs.includes("Home") ? 1 : 0;
          tabList[1] = tabs.includes("intercom") ? 1 : 0;
          tabList[2] = tabs.includes("radio") ? 1 : 0;
          tabList[3] = tabs.includes("audio") ? 1 : 0;
          tabList[4] = tabs.includes("video") ? 1 : 0;
          tabList[5] = tabs.includes("call") ? 1 : 0;
          tabList[6] = tabs.includes("setting") ? 1 : 0;
          tabList[7] = tabs.includes("control") ? 1 : 0;
          this.setTabList(tabList);
          this.setMenuList(menuList);
        }
      }
    },
    // 开始视频推流
    startLivePusher() {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let pushUrl = uni.getStorageSync("rtmpUrl") + controlCode;
      let subNVue = uni.getSubNVueById("livePusher");
      subNVue.show("fade-in", 200, () => {
        uni.$emit("live-push", {
          status: "start",
          url: pushUrl,
        });
      });
    },
    // 停止视频推流
    stopLivePusher() {
      this.setNodePlayUrl("");
      let subNVue = uni.getSubNVueById("livePusher");
      subNVue.show("fade-in", 200, () => {
        uni.$emit("live-push", {
          status: "stop",
        });
      });
    },
    // 关闭报警弹框
    closeAlarmModal(bool) {
      if (!this.isAlarmRepeat) {
        this.isAlarmRepeat = true;
        setTimeout(() => {
          this.isAlarmRepeat = false;
        }, 3000);
        clearInterval(this.alarmTimer);
        // 处理报警回传消息
        const { controlCode } = uni.getStorageSync("controlInfo");
        let terminalCode = this.intercomInfo.devno;
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"500",msg:"5"}`
        );
        this.audioContext.stop();
        this.setIsOpenAlarm(bool);
        this.saveAlarmInfo(this.alarmInfo.alarmId, "y");
        if (this.tagIndex != 42) {
          let item = {
            id: 42,
            name: "对讲",
            type: "icontelephone",
            url: "/pages/intercom/intercom",
          };
          this.handleTagChange(item);
          this.$refs.bottomtab.onClickMenu(item);
        }
        this.setDisableTab(true);
        this.$nextTick(() => {
          if (this.tagIndex == 42) {
            this.$refs.intercom.videoChatModal(this.intercomInfo);
          }
        });
      }
    },
    // 管理员密码验证
    getPassword(e) {
      let adminPassword = uni.getStorageSync("adminPassword");
      if (e == adminPassword) {
        this.showSystemPwd = false;
        if (this.initState) {
          this.openModal("UrlConfig");
          this.initState = false;
        }
      } else {
        this.failSystemPwd = true;
        this.$refs.keyboard.clear();
        setTimeout(() => (this.failSystemPwd = false), 600);
      }
    },
    // 关闭密码验证弹框
    hideKeyModal() {
      this.initState = false;
      this.showSystemPwd = false;
      let item = {
        id: 41,
        name: "首页",
        type: "iconhomepage",
        url: "/pages/index/index",
      };
      this.handleTagChange(item);
      this.$refs.bottomtab.onClickMenu(item);
    },
    // 语音播报
    voiceBroadcast(voiceText) {
      let options = {
        content: voiceText,
      };
      // getApp().globalData.Base.speech(options);
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
      if (type == "DevOffline") {
        if (this.tagIndex == 42) {
          this.$refs.intercom.showIntercom();
        }
      }
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
