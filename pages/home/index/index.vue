<template>
  <div class="home-container" @click="initCountTimeout">
    <nav-bar :homeState="homeState && showHomeState" :backState="backState && showBackState" @click-init="onClickInitSet"
      @click-home="onClickHome" @click-back="onClickBack" />
    <div class="home-wrapper">
      <div class="home-tabs" v-if="currentTab < 4">
        <text :class="currentTab == 1 ? 'tab-active' : ''" @click="switchModule(1)" v-show="tabList[0]">
          首页
        </text>
        <text :class="currentTab == 2 ? 'tab-active' : ''" @click="switchModule(2)" v-show="tabList[1]">
          在押人员
        </text>
        <text :class="currentTab == 3 ? 'tab-active' : ''" @click="switchModule(3)" v-show="tabList[2]">
          管教
        </text>
      </div>
      <div v-if="currentTab == 1" class="home-content-wrapper">
        <div class="home-content-box">
          <div class="home-content-top">
            <div class="home-content-list">
              <div class="home-police-item police" @touchstart.stop="openRoomLevelModal">
                <div class="home-police-box">
                  <text class="title">监室号</text>
                  <div class="room-box">
                    <text class="roomNo">{{ roomNo }}</text>
                    <text class="roomNo" :class="{
                      'civilized-room': roomLevel == '文明监室',
                      'strict-room': roomLevel == '严管监室',
                    }">
                      {{ roomLevel }}
                    </text>
                  </div>
                </div>
              </div>
              <div class="home-police-item police">
                <div class="home-police-box">
                  <text class="title">主管民警</text>
                  <text class="charge-name">{{ chargePoliceInfo.name }}</text>
                </div>
              </div>
              <div class="home-police-item police">
                <div class="home-police-box">
                  <text class="title">协管民警</text>
                  <div class="assist-police-box">
                    <text class="assist-name" v-for="(item, index) in assistPoliceList" :key="index">
                      {{ item.name }}
                    </text>
                  </div>
                </div>
              </div>
            </div>
            <div class="home-content-list">
              <div class="home-prisoner-box prisoner-num-box">
                <div class="home-prisoner-item prisoner-num">
                  <text class="title">总人数(人)</text>
                  <text class="count">{{ prisonerNum.totalNum }}</text>
                </div>
                <div class="home-prisoner-item prisoner-num">
                  <text class="title">目前人数(人)</text>
                  <text class="count">{{ prisonerNum.existNum }}</text>
                </div>
                <div class="home-prisoner-item prisoner-num">
                  <text class="title">外出人数(人)</text>
                  <text class="count">{{ prisonerNum.outsideNum }}</text>
                </div>
              </div>
            </div>
          </div>
          <div class="home-content-bottom">
            <scroll-view scroll-y="true" class="home-bottom-scroll">
              <uni-grid :column="6" :show-border="false" :square="false">
                <uni-grid-item class="home-bottom-item" v-for="(item, index) in homeList" :key="index">
                  <view class="home-bottom-list" :class="index % 2 ? 'bgStyle-two' : 'bgStyle-one'"
                    @click="handleHomeClick(index)">
                    <image :src="item.image" mode="aspectFill"></image>
                    <text>{{ item.name }}</text>
                    <text v-if="item.index == 5 && noticeMark" class="home-mark">
                      {{ noticeMark }}
                    </text>
                  </view>
                </uni-grid-item>
              </uni-grid>
            </scroll-view>
          </div>
        </div>
        <div class="page-vertical-divider"></div>
        <div class="home-sidebar">
          <view class="home-sidebar-title">监室动态</view>
          <view class="home-sidebar-news">
            <scroll-view scroll-y="true" class="home-sidebar-scroll">
              <view class="home-sidebar-item" v-for="(item, index) in dynamicInfos" :key="index">
                <text>{{ item.idx }}</text>
                <text>【{{ item.type }}】</text>
                <text class="content">{{ item.content }}</text>
                <text class="date">{{ item.date }}</text>
              </view>
            </scroll-view>
          </view>
        </div>
      </div>
      <div v-else-if="currentTab == 2" class="prisoner-container">
        <div class="prisoner-content">
          <scroll-view scroll-y="true" class="prisoner-scroll">
            <uni-grid :column="6" :show-border="false" :square="false">
              <uni-grid-item class="prisoner-item" v-for="(item, index) in prisonerList" :key="index">
                <div class="prisoner-list" :class="index % 2 ? 'bgStyle-two' : 'bgStyle-one'"
                  @click="handlePrisonerClick(index)">
                  <image :src="item.image"></image>
                  <text>{{ item.name }}</text>
                </div>
              </uni-grid-item>
            </uni-grid>
          </scroll-view>
        </div>
      </div>
      <div v-else-if="currentTab == 3" class="prisoner-container">
        <div class="prisoner-content">
          <scroll-view scroll-y="true" class="prisoner-scroll">
            <uni-grid :column="6" :show-border="false" :square="false">
              <uni-grid-item class="prisoner-item" v-for="(item, index) in policeList" :key="index">
                <div class="prisoner-list" :class="index % 2 ? 'bgStyle-two' : 'bgStyle-one'"
                  @click="handlePoliceClick(index)">
                  <image :src="item.image"></image>
                  <text>{{ item.name }}</text>
                </div>
              </uni-grid-item>
            </uni-grid>
          </scroll-view>
        </div>
      </div>
      <terminal-kitchen v-else-if="currentTab == 4" ref="kitchen"></terminal-kitchen>
      <terminal-notice v-else-if="currentTab == 5" ref="notice"></terminal-notice>
      <terminal-call v-else-if="currentTab == 6" ref="call"></terminal-call>
      <terminal-fingerprint v-else-if="currentTab == 7" ref="fingerprint"></terminal-fingerprint>
      <terminal-policeFingerprint v-else-if="currentTab == 34" ref="policeFingerprint"></terminal-policeFingerprint>
      <terminal-shopping v-else-if="currentTab == 8" ref="shopping"></terminal-shopping>
      <terminal-rotation v-else-if="currentTab == 9" ref="rotation"></terminal-rotation>
      <terminal-talk v-else-if="currentTab == 10" ref="talk"></terminal-talk>
      <terminal-illness v-else-if="currentTab == 11" ref="illness"></terminal-illness>
      <terminal-repairClaim v-else-if="currentTab == 12" ref="repairClaim"></terminal-repairClaim>
      <terminal-mood v-else-if="currentTab == 13" ref="mood"></terminal-mood>
      <terminal-bed v-else-if="currentTab == 14" ref="bed"></terminal-bed>
      <terminal-temperatureMonitor v-else-if="currentTab == 15" ref="temperatureMonitor"></terminal-temperatureMonitor>
      <terminal-message v-else-if="currentTab == 16" ref="life"></terminal-message>
      <terminal-medication v-else-if="currentTab == 17" ref="medication"></terminal-medication>
      <terminal-video v-else-if="currentTab == 18" ref="video"></terminal-video>
      <terminal-conversation v-else-if="currentTab == 19" ref="conversation"></terminal-conversation>
      <terminal-subject v-else-if="currentTab == 20" ref="subject"></terminal-subject>
      <terminal-evaluation v-else-if="currentTab == 21" ref="evaluation"></terminal-evaluation>
      <terminal-question v-else-if="currentTab == 22" ref="question"></terminal-question>
      <terminal-suggestion v-else-if="currentTab == 23" ref="suggestion"></terminal-suggestion>
      <terminal-communication v-else-if="currentTab == 24" ref="communication"></terminal-communication>
      <terminal-life v-else-if="currentTab == 25" ref="life"></terminal-life>
      <terminal-face v-else-if="currentTab == 26" ref="face"></terminal-face>
      <terminal-outdoor v-else-if="currentTab == 27" ref="outroom"></terminal-outdoor>
      <terminal-check v-else-if="currentTab == 28" ref="check"></terminal-check>
      <bottom-bar :loginState="loginState" :name="person.name" :countdown="loginTimeout" @click-logout="handleLogout"
        @click-set="handleSetUp" />
    </div>
    <div class="neil-modal-container">
      <!-- 人脸/指纹登录弹框 -->
      <recognition-dialogs ref="recognitionDialogs" useFor="login" :isShow="showRecognitionDialogs"
        @fingerRecognitionSuccess="fingerRecognitionSuccess" @faceRecognitionSuccess="faceRecognitionSuccess"
        @close="closeRecognitionDialogs"></recognition-dialogs>
      <!-- APP配置-基础URL -->
      <neil-modal class="setting-modal-container" :show="showUrlConfig" @close="closeModal('UrlConfig')">
        <view style="width: 600upx; height: 400upx">
          <view class="uni-flex model-bar">
            <view class="uni-flex-item model-bar-title">
              APP配置-基础URL
              <text style="font-size: 20upx; font-weight: 400; color: #ff0000">
                (非专业人员请勿操作)
              </text>
            </view>
          </view>
          <view class="modal-horizontal-divider"></view>
          <view style="padding: 15upx 50upx; height: 100%">
            <view class="uni-flex" style="align-items: center; height: 100upx">
              <text style="flex: 1; font-size: 20upx; font-weight: 400">
                基础Url：
              </text>
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
      <neil-modal class="setting-modal-container" :show="showCacheConfig" @close="closeModal('CacheConfig')">
        <view style="width: 600upx; height: 400upx">
          <view class="uni-flex model-bar">
            <view class="uni-flex-item model-bar-title">
              APP配置-系统缓存
              <text style="font-size: 20upx; font-weight: 400; color: #ff0000" @click="closeModal('CacheConfig')">
                (非专业人员请勿操作)
              </text>
            </view>
          </view>
          <view class="modal-horizontal-divider"></view>
          <view style="padding: 15upx 35upx; height: 100%">
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx; font-weight: 400">
                系统缓存：{{ sysCacheInfo }}
              </text>
            </view>
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx; font-weight: 400">
                终端服务：{{ sysWebSocketInfo }}
              </text>
            </view>
            <view class="uni-flex" style="align-items: center; height: 50upx">
              <text style="flex: 1; font-size: 20upx; font-weight: 400">
                本机Ip：
              </text>
              <input style="flex: 4" class="input-baseurl" v-model="terminalIP" placeholder="ip" disabled />
            </view>
            <view class="uni-flex" style="
                align-items: center;
                justify-content: center;
                height: 100upx;
              ">
              <view class="page-button" style="margin-right: 60upx; width: 135upx" @click="setAllSettingCache">
                加载系统缓存
              </view>
              <view class="page-button" style="margin-right: 60upx; width: 135upx" @click="setAllBindInfo">
                认证终端信息
              </view>
              <view class="page-button-empty" @click="closeCacheConfig">
                关闭
              </view>
            </view>
          </view>
        </view>
      </neil-modal>
      <!-- 视频通话弹框 -->
      <neil-modal :show="showVideoCall">
        <div class="common-modal-container">
          <div class="common-modal-content">
            <text>确认发起视频通话？</text>
          </div>
          <div class="common-modal-button">
            <div class="btn-cancel" @click="closeModal('VideoCall')">取消</div>
            <div class="btn-confirm" @touchstart.stop="handleVideoConnect">
              确定
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 通话连接弹框 -->
      <neil-modal :show="showVideoConnect">
        <div class="common-modal-container">
          <div class="common-modal-content">
            <image class="content-rotate" src="/static/images/index/connect.png"></image>
            <text>正在通话中...</text>
          </div>
        </div>
      </neil-modal>
      <!-- 应急报警弹框 -->
      <neil-modal :show="showAlarmInit">
        <div class="common-modal-container">
          <div class="common-modal-content">
            <text>确认发起应急报警？</text>
          </div>
          <div class="common-modal-button">
            <div class="btn-cancel" @click="closeModal('AlarmInit')">取消</div>
            <div class="btn-confirm" @touchstart.stop="handleAlarmConfirm">
              确定
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 密码验证 -->
      <keyboard :show="showSystemPwd" :failSystemPwd="failSystemPwd" ref="keyboard" @getPassword="getPassword"
        @hideKey="hideKeyModel"></keyboard>
      <!-- 系统菜单 -->
      <neil-modal :show="showSystemMenu">
        <div class="system-modal-container">
          <div class="modal-header">
            <div class="modal-title">
              <text>系统设置</text>
            </div>
            <div class="modal-close" @click="closeModal('SystemMenu')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="page-horizontal-divider"></div>
          <scroll-view scroll-y="true" class="system-menu-scroll">
            <ul>
              <li @click="prisonerFingerprint">在押人员指纹录入</li>
              <li @click="openModal('PrisonerFinger')">同步在押人员指纹</li>
              <li @click="policeFingerprint">民警指纹录入</li>
              <li @click="openModal('PoliceFinger')">同步民警指纹</li>
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
      <!-- 屏保 -->
      <screen-saver :show="showScreenSaver" @close="closeScreenSaver"></screen-saver>
      <!-- 同步在押人员指纹弹框 -->
      <neil-modal :show="showPrisonerFinger">
        <div class="common-modal-container">
          <div class="common-modal-content">
            <text>是否同步在押人员指纹？</text>
          </div>
          <div class="common-modal-button">
            <div class="btn-cancel" @click="closeModal('PrisonerFinger')">
              取消
            </div>
            <div class="btn-confirm" @touchstart.stop="syncPrisonerFinger">
              确定
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 同步民警指纹弹框 -->
      <neil-modal :show="showPoliceFinger">
        <div class="common-modal-container">
          <div class="common-modal-content">
            <text>是否同步民警指纹？</text>
          </div>
          <div class="common-modal-button">
            <div class="btn-cancel" @click="closeModal('PoliceFinger')">
              取消
            </div>
            <div class="btn-confirm" @touchstart.stop="syncPoliceFinger">
              确定
            </div>
          </div>
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
            <div class="btn-confirm" @touchstart.stop="handleRestartDev">
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
            <div class="btn-confirm" @touchstart.stop="handleRestartApp">
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
            <div class="btn-confirm" @touchstart.stop="configInfoSync">
              确定
            </div>
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
            <div class="btn-confirm" :class="{ 'btn-disabled': disabledClick }" @touchstart.stop="handleUpdateApp">
              下载更新
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 监室等级时间周期弹框 -->
      <neil-modal :show="showLevelTimeModal">
        <div class="common-modal-container">
          <view class="modal-header">
            <view class="modal-title">监室等级时段</view>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="common-modal-content">
            <p>
              开始时间：
              <text style="color: #35fffa">{{ beginTime }}</text>
            </p>
            <p>
              结束时间：
              <text style="color: #35fffa">{{ endTime }}</text>
            </p>
          </div>
          <div class="common-modal-button">
            <div class="btn-confirm" @touchstart.stop="closeModal('LevelTimeModal')">
              关闭
            </div>
          </div>
        </div>
      </neil-modal>
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
            <common-icons iconType="iconalarm" size="86" color="#fff"></common-icons>
            <text class="offline-content">
              网络异常，设备连接失败！({{ reconnectCount }})
            </text>
          </div>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import terminalLife from "@/pages/home/life/life.vue";
import terminalKitchen from "@/pages/home/kitchen/kitchen.vue";
import terminalNotice from "@/pages/home/notice/notice.vue";
import terminalCall from "@/pages/prisoner/call/call.vue";
import terminalFingerprint from "@/pages/prisoner/fingerprint/fingerprint.vue";
import terminalPoliceFingerprint from "@/pages/police/fingerprint/fingerprint.vue";
import terminalShopping from "@/pages/prisoner/shopping/shopping.vue";
import terminalRotation from "@/pages/prisoner/rotation/rotation.vue";
import terminalTalk from "@/pages/prisoner/talk/talk.vue";
import terminalIllness from "@/pages/prisoner/illness/illness.vue";
import terminalRepairClaim from "@/pages/prisoner/repairClaim/repairClaim.vue";
import terminalMood from "@/pages/prisoner/mood/mood.vue";
import terminalBed from "@/pages/home/bed/bed.vue";
import terminalTemperatureMonitor from "@/pages/prisoner/temperatureMonitor/temperatureMonitor.vue";
import terminalMessage from "@/pages/home/message/message.vue";
import terminalMedication from "@/pages/prisoner/medication/medication.vue";
import terminalVideo from "@/pages/home/video/video.vue";
import terminalConversation from "@/pages/prisoner/conversation/conversation.vue";
import terminalSubject from "@/pages/prisoner/conversation/subject.vue";
import terminalEvaluation from "@/pages/prisoner/evaluation/evaluation.vue";
import terminalQuestion from "@/pages/prisoner/evaluation/question.vue";
import terminalSuggestion from "@/pages/prisoner/suggestion/suggestion.vue";
import terminalCommunication from "@/pages/prisoner/communication/communication.vue";
import terminalFace from "@/pages/police/face/face.vue";
import terminalOutdoor from "@/pages/police/outRoomRegister/outRoomRegister.vue";
import terminalCheck from "@/pages/police/check/check.vue";
import navBar from "@/components/nav-bar/nav-bar.vue";
import bottomBar from "@/components/bottom-bar/bottom-bar.vue";
import uniGrid from "@/components/uni/uni-grid/uni-grid.vue";
import uniGridItem from "@/components/uni/uni-grid-item/uni-grid-item.vue";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import commonIcons from "@/components/common-icons/common-icons.vue";
import keyboard from "@/components/dt-keyboard/dt-keyboard.vue";
import recognitionDialogs from "@/components/recognition-dialogs/recognition-dialogs.vue";
import screenSaver from "@/components/screen-saver/screen-saver.vue";
import { isNullStr, dateFormat, convertTimeToSeconds } from "@/common/utils/util.js";
import { pathToBase64 } from "@/common/utils/imageTools.js";
import Api from "@/common/api.js";
import Log from "@/common/utils/log.js";
import { mapState, mapMutations } from "vuex";

const innerAudioContext = uni.createInnerAudioContext();
innerAudioContext.autoplay = false;

export default {
  components: {
    navBar,
    bottomBar,
    uniGrid,
    uniGridItem,
    neilModal,
    commonIcons,
    keyboard,
    recognitionDialogs,
    screenSaver,
    terminalLife,
    terminalKitchen,
    terminalNotice,
    terminalCall,
    terminalFingerprint,
    terminalPoliceFingerprint,
    terminalShopping,
    terminalRotation,
    terminalTalk,
    terminalIllness,
    terminalRepairClaim,
    terminalMood,
    terminalBed,
    terminalTemperatureMonitor,
    terminalMessage,
    terminalMedication,
    terminalVideo,
    terminalConversation,
    terminalSubject,
    terminalEvaluation,
    terminalQuestion,
    terminalSuggestion,
    terminalCommunication,
    terminalFace,
    terminalOutdoor,
    terminalCheck,
  },
  data() {
    return {
      // 登录用户信息
      person: {
        id: "",
        name: "",
      },
      // Tab禁用状态
      disabledState: false,
      // 点击设置栏次数
      clickNums: 0,
      // 配置baseUrl弹框
      showUrlConfig: false,
      // 配置系统缓存弹框
      showCacheConfig: false,
      baseUrl: "",
      // 系统缓存
      sysCacheInfo: "",
      // WebSocket连接提示信息
      sysWebSocketInfo: "",
      // 是否关闭WebSocket
      isWebSocketDisable: false,
      // WebSocket连接定时器
      socketTimer: null,
      // 监室等级
      roomLevel: "",
      // 严管监室开始时间
      beginTime: "",
      // 严管监室结束时间
      endTime: "",
      // 民警主管信息
      chargePoliceInfo: {},
      // 民警协管信息列表
      assistPoliceList: [],
      // 监室人员数
      prisonerNum: {},
      // Tab状态列表
      tabList: [],
      // 首页菜单
      homeList: [],
      // 在押人员菜单信息
      prisonerList: [],
      // 民警菜单
      policeList: [],
      // 监室公告角标
      noticeMark: 0,
      // 视频通话确认弹框
      showVideoCall: false,
      // 视频对讲弹框
      showVideoConnect: false,
      // 登录弹框
      showRecognitionDialogs: false,
      // 通话时间
      voiceTime: "",
      // 应急告警弹框
      showAlarmInit: false,
      // 首页应急报警计时器
      alarmTimer: null,
      // 首页应急报警计数
      alarmCount: 0,
      // 按键应急报警计时器
      keyAlarmTimer: null,
      // 按键应急报警计数
      keyAlarmCount: 0,
      // 按键报警间隔时长
      keyAlarmTime: uni.getStorageSync("keyAlarmTime"),
      // 动态信息
      dynamicList: [],
      // 视频通话名称
      bgVideoName: "",
      // 音频名称
      BGAudioName: "",
      // 广播流地址
      broadcastUrl: "",
      // 播放视频地址
      bgVideoUrl: "",
      // 音频列表
      audioList: [],
      // 音频信息
      audioInfo: {},
      // 终端配置状态
      initState: false,
      // 底栏设置状态
      setupState: false,
      // 密码验证弹框
      showSystemPwd: false,
      // 密码验证失败
      failSystemPwd: false,
      // 同步在押人员指纹弹框
      showPrisonerFinger: false,
      // 同步民警指纹弹框
      showPoliceFinger: false,
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
      // APP更新内容
      updateNote: "",
      // 禁用按钮
      disabledClick: false,
      // APP下载地址
      downloadUrl: "",
      // 倒计时定时器
      timer: null,
      // 开启倒计时
      loginTimeout: uni.getStorageSync("loginTimeout") || 30,
      // 系统菜单弹框
      showSystemMenu: false,
      // 监室等级时间周期弹框
      showLevelTimeModal: false,
      // 监室等级弹框定时器
      levelTimer: null,
      // 设备离线提示弹框
      showDevOffline: false,
      // 网络异常监听定时器
      heartbeatTimer: null,
      // 网络异常计时
      heartBeatTimeOut: uni.getStorageSync("heartBeatTimeOut"),
      // 音频倒计时
      audioTimer: null,
      // 视频倒计时
      videoTimer: null,
      // 视频对讲状态
      intercomState: false,
      // 禁止重复操作
      isRepeatState: false,
      isFingerRepeat: false,
      // webSocket 会话对象
      socketTask: null,
      // socket重连次数
      reconnectCount: 0,
      // 广播播放状态
      radioPlayState: false,
      // 音频播放状态
      audioPlayState: false,
      // 视频播放状态
      videoPlayState: false,
      // 屏保弹框状态
      showScreenSaver: false,
      screenSaverTimer: null,
      // 屏保倒计时长
      screenSaverSwitch: uni.getStorageSync("screenSaverSwitch") || 30,
      // 屏保状态
      screenSaverState: false,
      // 电教播放状态
      eduPlayState: false,
      // 测温温度
      temperature: 0,
      // 对讲类型,0-监室监听 1-视频对讲
      intercomType: 0,
      // 校时时间
      timing: null,
      // 拍照上传入参
      faceParams: {
        alarmId: "",
        image: "",
        rybh: "",
      },
      // 抓拍状态
      isTakingPic: false,
      webrtcObj: {},
      base64Str: "",
    };
  },
  computed: {
    ...mapState({
      // 当前页面
      currentTab: (state) => state.app.currentTab,
      // 菜单状态
      menuState: (state) => state.app.menuState,
      // 返回首页状态
      homeState: (state) => state.app.homeState,
      // 后退状态
      backState: (state) => state.app.backState,
      // 登录状态
      loginState: (state) => state.app.loginState,
      // 是否正在点名
      isCalling: (state) => state.app.isCalling,
      // 是否正在对讲
      isIntercom: (state) => state.app.isIntercom,
      // 值班人员列表
      dutyList: (state) => state.app.dutyList,
      // 是否对讲等待接听中
      isWaitingIntercom: (state) => state.app.isWaitingIntercom,
      // 正在智能谈话
      isConversation: (state) => state.app.isConversation,
      // 正在心理测评
      isEvaluation: (state) => state.app.isEvaluation,
    }),
    // 监室动态日期格式化
    dynamicInfos() {
      this.dynamicList.map((item, index) => {
        item.idx = `${index + 1 >= 10 ? index + 1 : "0" + (index + 1)}.`;
        item.date = dateFormat("MM-DD hh:mm", new Date(item.date));
      });
      return this.dynamicList;
    },
    // 监室号
    roomNo() {
      return uni.getStorageSync("terminalInfo").roomName;
    },
    // 返回首页状态
    showHomeState() {
      return (
        this.currentTab > 1 && ![6, 19, 20, 21, 22].includes(this.currentTab)
      );
    },
    // 页面回退状态
    showBackState() {
      return (
        this.currentTab > 7 &&
        ![14, 16, 18, 19, 20, 21, 22, 25, 34].includes(this.currentTab)
      );
    },
    // 重连定时器间隔
    websocketTime() {
      let count = this.reconnectCount;
      if (count >= 0 && count < 360) {
        return 10000;
      } else if (count >= 360 && count < 960) {
        return 30000;
      } else if (count >= 960 && count < 2040) {
        return 60000;
      } else if (count >= 2040 && count < 2760) {
        return 120000;
      } else {
        return 240000;
      }
    },
    // 分机IP
    terminalIP() {
      return (
        getApp().globalData.Base.getIpAddress().ip || this.$config.terminalIP
      );
    },
  },
  onLoad() {
    this.reconnectCount = 0;
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

      // 来邦初始化对讲服务
      getApp().globalData.FloatUniModule.initIPCManager((e) => {
        if (e.code == 0) {
          // 设备校时
          if (this.timing) {
            getApp().globalData.FloatUniModule.setSystemTime(this.timing);
          }
          getApp().globalData.FloatUniModule.hideTalkView(true);
          // 来邦监听对讲事件
          getApp().globalData.FloatUniModule.talkEventCallback((res) => {
            console.log("对讲服务事件：" + JSON.stringify(res));
            getApp().globalData.FloatUniModule.hideTalkView(true);
            if (res.eventID == 1) {
              // 呼出处理中
            } else if (res.eventID == 2) {
              // 呼出振铃
            } else if (res.eventID == 3 || res.eventID == 4) {
              // 3-监听接通 4-对讲接通
              this.intercomType = 0;
              this.intercomHandler();
              if (res.eventID == 4) {
                // 对讲接通
                this.intercomType = 1;
                if (this.showRecognitionDialogs) {
                  this.closeRecognitionDialogs();
                }
                this.voiceBroadcast("请注意，已经开启视频对讲");
                if (this.audioPlayState) {
                  // 暂停播放音频
                  uni.$emit("video-player", "audio", "pause");
                }
                if (this.videoPlayState) {
                  // 暂停播放视频
                  uni.$emit("video-player", "video", "pause");
                }
                if (this.isCalling && this.currentTab == 6) {
                  this.$refs.call.discontinueCall(true);
                }
                if (res.devRegType == 8) {
                  let { masterNum, slaveNum, devRegType } = res;
                  console.log(masterNum, slaveNum, devRegType);
                  getApp().globalData.FloatUniModule.openLocalCamera(true);
                  getApp().globalData.FloatUniModule.nativeAnswer(
                    0,
                    masterNum,
                    slaveNum,
                    devRegType
                  );
                }
                // 停止播放电教
                this.stopEduPlay();
                this.disabledState = true;
              }
            } else if (res.eventID == 5) {
              this.disabledState = false;
              if (this.intercomType == 1) {
                this.voiceBroadcast("对讲已挂断！");
                // 通话或呼叫挂断
                if (this.audioPlayState) {
                  // 继续播放音频
                  uni.$emit("video-player", "audio", "resume");
                  this.disabledState = false;
                }
                if (this.videoPlayState) {
                  // 继续播放视频
                  uni.$emit("video-player", "video", "resume");
                  this.disabledState = true;
                }
                // 开始播放电教
                this.startEduPlay();
              }
            } else if (res.eventID == 7) {
              this.voiceBroadcast("对方正忙，请稍后再拨！");
            }
          });
          // 来邦监听指纹事件
          getApp().globalData.FloatUniModule.setCompareFingerprintCallBack(
            (res) => {
              if (!this.isFingerRepeat) {
                this.isFingerRepeat = true;
                setTimeout(() => {
                  this.isFingerRepeat = false;
                }, 1500);
                if ([7, 34].includes(this.currentTab)) {
                  if (this.currentTab == 7) {
                    // 在押人员指纹录入
                    this.$refs.fingerprint.handleFingerprint(res);
                  }
                  if (this.currentTab == 34) {
                    // 民警指纹录入
                    this.$refs.policeFingerprint.handleFingerprint(res);
                  }
                } else {
                  if (res.code == "0") {
                    let params = {
                      mKey: res.id,
                      temperature: this.temperature,
                    };
                    switch (this.currentTab) {
                      case 6:
                        this.$refs.call &&
                          this.$refs.call.fingerRecognitionSuccess(params);
                        break;
                      case 8:
                        this.$refs.shopping &&
                          this.$refs.shopping.fingerRecognitionSuccess(params);
                        break;
                      case 9:
                        this.$refs.rotation &&
                          this.$refs.rotation.fingerRecognitionSuccess(params);
                        break;
                      case 19:
                        this.$refs.conversation &&
                          this.$refs.conversation.fingerRecognitionSuccess(
                            params
                          );
                        break;
                      case 21:
                        this.$refs.evaluation &&
                          this.$refs.evaluation.fingerRecognitionSuccess(
                            params
                          );
                        break;
                      case 27:
                        this.$refs.outroom &&
                          this.$refs.outroom.fingerRecognitionSuccess(params);
                        break;
                      default:
                        this.fingerRecognitionSuccess(params);
                        break;
                    }
                  } else {
                    this.voiceBroadcast("指纹识别失败");
                  }
                }
              }
            }
          );
          // 来邦监听测温事件
          getApp().globalData.FloatUniModule.syncStopTemperature();
          getApp().globalData.FloatUniModule.setTemperatureDataCallBack(
            (res) => {
              if (res.code == "0") {
                this.temperature = res.temperature;
                switch (this.currentTab) {
                  case 6:
                    this.$refs.call &&
                      this.$refs.call.setTemperature(res.temperature);
                    break;
                  case 11:
                    this.$refs.illness &&
                      this.$refs.illness.setTemperature(res.temperature);
                    break;
                  case 15:
                    this.$refs.temperatureMonitor &&
                      this.$refs.temperatureMonitor.setTemperature(
                        res.temperature
                      );
                    break;
                }
              } else {
                console.log("测温失败");
              }
            }
          );
          // 来邦监听刷卡事件
          getApp().globalData.FloatUniModule.setCardDataCallBack((res) => {
            console.log("刷卡状态：" + JSON.stringify(res));
            if (res.code == "0") {
              // 关闭刷卡
              getApp().globalData.FloatUniModule.syncStopCard();
              if (this.currentTab == 3) {
                this.closeModal("RecognitionDialogs");
                // 管教刷卡时间
                let registerTime = dateFormat(
                  "YYYY-MM-DD hh:mm:ss",
                  new Date()
                );
                let { roomNo } = uni.getStorageSync("terminalInfo");
                let cardNo = res.cardNum;
                let params = { roomNo, registerTime, cardNo };
                this.saveFaceManager(params);
                this.getPoliceByCardNum(cardNo);
              }
            }
          });
          // 来邦监听门磁事件
          getApp().globalData.FloatUniModule.onDoorContactValue((res) => {
            console.log("门磁状态：" + JSON.stringify(res));
            // 门磁防拆报警 1开启 0关闭
            if (res.isOpen == 1) {
              this.setAlarmDynamic(res.isOpen);
            }
          });
          // 来邦初始化电教系统
          getApp().globalData.FloatUniModule.initEducation();
          getApp().globalData.FloatUniModule.setEducationStateListener(
            (res) => {
              console.log("电教任务状态：" + JSON.stringify(res));
              if (this.isIntercom || this.isCalling || this.radioPlayState) {
                return;
              }
              let isOpenEdu = uni.getStorageSync("isOpenEdu") || 0;
              if (isOpenEdu == 1) {
                const { taskState } = JSON.parse(res.educationTaskStateBean);
                switch (taskState) {
                  case 0:
                    // 开始播放电教
                    this.startEduPlay();
                    break;
                  case 1:
                    // 播放电教成功
                    this.eduPlayState = true;
                    this.disabledState = false;
                    if (this.currentTab == 18) {
                      this.$refs.video.stopPlayVideo(false);
                    }
                    if (this.audioPlayState) {
                      this.stopAudioHandler("0", false);
                    }
                    if (this.videoPlayState) {
                      this.stopVideoHandler("0", false);
                    }
                    this.receiveTask("edu", "start");
                    break;
                  case 2:
                    // 播放电教失败
                    this.eduPlayState = false;
                    this.disabledState = false;
                    this.callbackEduVideoInfo(0);
                    this.receiveTask("edu", "0");
                    break;
                  case 3:
                    // 停止播放电教
                    this.stopEduPlay();
                    this.receiveTask("edu", "stop");
                    break;
                }
              }
            });
        }
      });

      //websocket连接
      if (!getApp().globalData.webSocketConnected) {
        const { terminalCode } = uni.getStorageSync("terminalInfo");
        if (!isNullStr(terminalCode)) {
          //初始化配置WS服务
          this.connectWebSocketInit(terminalCode);
        } else {
          this.setAllBindInfo();
        }
      }
    }
  },
  mounted() {
    // 获取首页数据
    this.initHomeData(false);
  },
  destroyed() {
    this.clickNums = 0;
    clearInterval(this.videoTimer);
    innerAudioContext.stop();
    innerAudioContext.destroy();
    uni.hideToast();
  },
  methods: {
    ...mapMutations({
      // 设置当前页面
      setCurrentTab: "app/SET_CURRENTTAB",
      // 保存点名信息
      setRollInfo: "app/SET_ROLLINFO",
      // 指纹认证人员信息
      setPersonInfo: "app/SET_PERSONINFO",
      // 设置登录状态
      setLoginState: "app/SET_LOGINSTATE",
      // 设置是否正在点名
      setIsCalling: "app/SET_ISCALLING",
      // 设置是否正在对讲
      setIsIntercom: "app/SET_ISINTERCOM",
      // 设置值班人员列表
      setDutyList: "app/SET_DUTYLIST",
      // 设置是否对讲等待接听中
      setIsWaitingIntercom: "app/SET_ISWAITINGINTERCOM",
      // 保存谈话|测评计划ID
      setTaskId: "app/SET_TASKID",
      // 设置智能谈话状态
      setIsConversation: "app/SET_ISCONVERSATION",
      // 设置心理测评状态
      setIsEvaluation: "app/SET_ISEVALUATION",
    }),
    // 获取APP配置菜单
    async getAppMenuList() {
      const { areaCode } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getAppModuleConf + `?device=terminal&unitCode=${areaCode}`,
        null
      );
      if (res.state.code == 200) {
        if (res.data.length) {
          let tabs = res.data.map((item) => item.url);
          this.tabList[0] = tabs.includes("Home") ? 1 : 0;
          this.tabList[1] = tabs.includes("OdsPerson") ? 1 : 0;
          this.tabList[2] = tabs.includes("Police") ? 1 : 0;
          res.data.forEach((list) => {
            switch (list.url) {
              case "Home":
                this.homeList = list.children;
                break;
              case "OdsPerson":
                this.prisonerList = list.children;
                break;
              case "Police":
                this.policeList = list.children;
                break;
            }
          });
        }
      }
    },
    // 开始播放电教
    startEduPlay() {
      // 停止播放电教
      this.stopEduPlay();
      getApp().globalData.FloatUniModule.hdmiOpen(1);
      getApp().globalData.FloatUniModule.audioSyncOutput(1);
      getApp().globalData.FloatUniModule.enterEducationTask();
      this.disabledState = false;
    },
    // 暂停播放电教
    delayEduPlay() {
      this.stopEduPlay();
      setTimeout(() => {
        this.startEduPlay();
      }, 60000);
    },
    // 停止播放电教
    stopEduPlay() {
      getApp().globalData.FloatUniModule.exitEducationTask();
      this.eduPlayState = false;
      this.disabledState = false;
    },
    // 开启测温
    openThermometryModule() {
      getApp().globalData.FloatUniModule.syncStartTemperature((res) => {
        if (res.code == 0) {
          console.log("开启测温");
        }
      });
    },
    // 停止测温
    closeThermometryModule() {
      getApp().globalData.FloatUniModule.syncStopTemperature((res) => {
        if (res.code == 0) {
          console.log("关闭测温");
        }
      });
    },
    // 开始屏保
    startScreenSaver() {
      this.screenSaverState = true;
      this.openScreenSaver();
    },
    // 停止屏保
    stopScreenSaver() {
      this.screenSaverState = false;
      this.closeScreenSaver();
    },
    // 开启屏保
    openScreenSaver() {
      if (this.screenSaverState) {
        this.showScreenSaver = true;
        clearInterval(this.screenSaverTimer);
      }
    },
    // 关闭屏保
    closeScreenSaver() {
      this.showScreenSaver = false;
      if (this.screenSaverState) {
        this.startScreenSaverTimer();
      } else {
        clearInterval(this.screenSaverTimer);
      }
    },
    // 开启屏保定时器
    startScreenSaverTimer() {
      this.screenSaverSwitch = uni.getStorageSync("screenSaverSwitch") || 30;
      this.screenSaverTimer = setInterval(() => {
        this.screenSaverSwitch--;
        if (this.screenSaverSwitch <= 0) {
          this.openScreenSaver();
        }
      }, 1000);
    },
    // 获取警官信息
    async getPoliceInfo() {
      const { roomId } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getPoliceInfo,
        { roomId },
        true
      );
      if (res.state.code == 200) {
        if (Object.keys(res.data).length) {
          this.chargePoliceInfo = res.data.roomSupervisor;
          this.assistPoliceList = res.data.coordinatingPolice;
          this.roomLevel = res.data.roomLevel;
          this.beginTime = res.data.beginTime
            ? dateFormat("YYYY-MM-DD hh:mm:ss", new Date(res.data.beginTime))
            : "";
          this.endTime = res.data.endTime
            ? dateFormat("YYYY-MM-DD hh:mm:ss", new Date(res.data.endTime))
            : "";
        }
      }
    },
    // 获取监室人数
    async getPrisonerNum() {
      const { terminalCode: code } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getPrisonerNum,
        { code },
        true
      );
      if (res.state.code == 200) {
        this.prisonerNum = res.data;
      }
    },
    // 获取监室动态
    async getDynamicInfo(state) {
      const { terminalCode } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getDynamicInfo + `?terminalCode=${terminalCode}`,
        null,
        true
      );
      if (res.state.code == 200) {
        if (state) {
          this.handleShowToast("刷新成功！");
        }
        this.dynamicList = res.data;
        this.noticeMark = this.dynamicList.length;
        if (this.noticeMark) {
          if (this.dynamicList[0].level != "0") {
            // 暂停播放电教
            this.delayEduPlay();
          }
        }
      }
    },
    // 保存管教面对面管理记录
    async saveFaceManager(params) {
      let res = await Api.apiCall("post", Api.police.saveFaceRegister, params);
      if (res.state.code == 200) {
        this.voiceBroadcast("签到成功");
        this.handleShowToast("签到成功");
      }
    },
    // 刷卡获取民警信息
    async getPoliceByCardNum(cardNo) {
      let res = await Api.apiCall(
        "get",
        Api.police.getUserByCardNum + cardNo,
        null
      );
      if (res.state.code == 200) {
        this.recognitionHanlder(res.data);
      }
    },
    // 切换主页面
    switchModule(index) {
      if (!this.intercomState) {
        this.intercomState = true;
        setTimeout(() => {
          this.intercomState = false;
        }, 3000);
        clearInterval(this.timer);
        if (this.disabledState) {
          this.handleShowToast("当前在执行任务，请稍候");
          return;
        }
        this.setCurrentTab(index);
        if (index == 1) {
          this.onClickHome();
        } else {
          this.countTimer();
          if (index == 3) {
            // 打开刷卡
            getApp().globalData.FloatUniModule.syncStartCard((res) => {
              if (res.code == 0) {
                console.log("刷卡已开启");
              }
            });
          }
          if (this.person.id !== "0999") {
            this.openModal("RecognitionDialogs");
            this.$nextTick(() => {
              this.$refs.recognitionDialogs &&
                this.$refs.recognitionDialogs.startRecognition(this.currentTab);
            });
          }
        }
      }
    },
    // 重置倒计时长
    initCountTimeout() {
      this.screenSaverSwitch = uni.getStorageSync("screenSaverSwitch") || 30;
      if ([11, 17, 26, 28].includes(this.currentTab)) {
        this.loginTimeout = uni.getStorageSync("specialLoginTimeout") || 120;
      } else {
        this.loginTimeout = uni.getStorageSync("loginTimeout") || 30;
      }
    },
    // 开启倒计时
    countTimer() {
      this.initCountTimeout();
      this.timer = setInterval(() => {
        this.loginTimeout--;
        if (this.loginTimeout <= 0) {
          this.closeCountTimer();
        }
      }, 1000);
    },
    // 关闭倒计时
    closeCountTimer() {
      clearInterval(this.timer);
      this.initCountTimeout();
      if (this.person.id !== "0999") {
        this.loginStatusHanlder();
      }
      this.closeModal("RecognitionDialogs");
      if (![6].includes(this.currentTab)) {
        this.setCurrentTab(1);
      }
    },
    // 对讲挂断|取消|超时
    resetIntercom() {
      this.intercomState = false;
      this.showVideoConnect = false;
      this.setIsIntercom(false);
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
    // 首页子模块
    handleHomeClick(index) {
      this.handleHomeModal(this.homeList[index]);
    },
    // 在押人员子模块
    handlePrisonerClick(index) {
      this.handleHomeModal(this.prisonerList[index]);
    },
    // 民警子模块
    handlePoliceClick(index) {
      this.handleHomeModal(this.policeList[index]);
    },
    // 子模块路由跳转
    handleHomeModal(item) {
      if (item.url == "OnlineCall") {
        this.handleShowToast("暂无点名任务");
        return;
      }
      if (item.url == "selfTalk") {
        this.handleShowToast("暂无谈话任务");
        return;
      }
      if (item.url == "evaluation") {
        this.handleShowToast("暂无测评任务");
        return;
      }
      if (!isNullStr(item.isModal) && item.isModal) {
        clearInterval(this.timer);
        this.openModal(item.url);
      } else {
        clearInterval(this.timer);
        if (this.videoPlayState) {
          return;
        }
        this.setLoginState(this.loginState);
        this.setCurrentTab(item.index);
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
        if (this.setupState) {
          this.showSystemMenu = true;
          this.setupState = false;
        }
      } else {
        this.failSystemPwd = true;
        this.$refs.keyboard.clear();
        setTimeout(() => (this.failSystemPwd = false), 600);
      }
    },
    // 关闭密码验证弹框
    hideKeyModel() {
      this.initState = false;
      this.setupState = false;
      this.showSystemPwd = false;
    },
    // 在押人员指纹录入页面
    prisonerFingerprint() {
      this.setCurrentTab(7);
      this.showSystemMenu = false;
    },
    // 民警指纹录入页面
    policeFingerprint() {
      this.setCurrentTab(34);
      this.showSystemMenu = false;
    },
    // 重启设备
    handleRestartDev() {
      getApp().globalData.FloatUniModule.rebootSystem();
      uni.closeSocket();
    },
    // 重启应用
    handleRestartApp() {
      getApp().globalData.Base.rebootApp("com.gksc.terminal");
    },
    // 显示状态栏
    showNavigationBar() { },
    //隐藏状态栏
    hideNavigationBar() { },
    // 同步配置信息
    configInfoSync() {
      this.sysCacheInfo = "";
      // 加载系统缓存
      this.setAllSettingCache();
      // 同步认证终端信息
      this.AllBindInfoSync();
      this.showConfigInfo = false;
    },
    // 升级APP
    async getUpdateAppInfo(type) {
      let params = {
        data: {
          versionCode: plus.runtime.versionCode,
          deviceType: 2,
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
              console.log("下载成功：" + d.filename);
              getApp().globalData.UpdateApp.install(d.filename, (res) => {
                if (res.state) {
                  console.log("APP安装成功");
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
      console.log("开启守护成功");
    },
    // 关闭守护
    closeCrashHandle() {
      getApp().globalData.FloatUniModule.openGuard(0);
      console.log("关闭守护成功");
    },
    // 点击打开设置
    onClickInitSet() {
      if (this.currentTab == 1) {
        if (this.clickNums == 3) {
          this.clickNums = 0;
          this.initState = true;
          this.showSystemPwd = true;
        } else {
          this.clickNums = this.clickNums + 1;
        }
      }
    },
    // 下一步设置baseUrl
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
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 加载系统缓存
    async setAllSettingCache() {
      if (!isNullStr(this.sysCacheInfo)) {
        return;
      }
      let res = await Api.apiCall("get", Api.index.getAllSetting, null, true);
      if (res.state.code == 200) {
        let data = res.data;
        data.map((item) => {
          if (item.skey) {
            let key = item.skey;
            uni.setStorageSync(`${key}`, item.svalue);
          }
        });
        this.sysCacheInfo = "配置系统缓存成功！";
        console.log("配置系统缓存成功！");
        this.handleShowToast("配置系统缓存成功！");
      } else {
        console.log("配置系统缓存失败！");
        this.handleShowToast("配置系统缓存失败！");
      }
    },
    // 认证终端信息
    async setAllBindInfo() {
      if (this.isWebSocketDisable) {
        this.handleShowToast("请勿重复认证！");
        return;
      }
      let params = {
        ip: this.terminalIP,
        terminalType: 0,
      };
      uni.setStorageSync("authTerminalIP", this.terminalIP);
      let res = await Api.apiCall(
        "get",
        Api.index.getTerminalInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (!isNullStr(res.data)) {
          // 设置本地缓存公共方法
          this.setTerminalStorage(res.data);
          const { terminalCode } = uni.getStorageSync("terminalInfo");
          if (!isNullStr(terminalCode)) {
            //初始化配置WS服务
            this.connectWebSocketInit(terminalCode);
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
            image: "../../../static/images/common/error.png",
            icon: "none",
          });
        }
      } else {
        uni.showToast({
          title: "认证终端信息失败！",
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 同步认证终端信息
    async AllBindInfoSync() {
      // 获取分机信息
      let params = {
        ip: this.terminalIP,
        terminalType: 0,
      };
      let res = await Api.apiCall(
        "get",
        Api.index.getTerminalInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (!isNullStr(res.data)) {
          // 设置本地缓存公共方法
          this.setTerminalStorage(res.data);
          this.handleShowToast("绑定终端信息成功！");
        } else {
          uni.showToast({
            title: "请先添加终端！",
            image: "../../../static/images/common/error.png",
            icon: "none",
          });
        }
      } else {
        uni.showToast({
          title: "认证终端信息失败！",
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      }
    },
    // 设置本地缓存公共方法
    setTerminalStorage(terminalInfo) {
      uni.setStorageSync("terminalInfo", terminalInfo);
    },
    // 关闭终端配置弹框
    closeCacheConfig() {
      if (isNullStr(this.sysCacheInfo)) {
        uni.showToast({
          title: "系统缓存为空！",
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      } else if (isNullStr(uni.getStorageSync("terminalInfo"))) {
        uni.showToast({
          title: "终端信息为空！",
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      } else if (!getApp().globalData.webSocketConnected) {
        this.showVideoConnect = false;
        uni.showToast({
          title: "终端服务连接失败！",
          image: "../../../static/images/common/error.png",
          icon: "none",
        });
      } else {
        this.closeModal("CacheConfig");
        // 应用重启
        getApp().globalData.Base.rebootApp("com.gksc.terminal");
      }
    },
    // 发送WebSocket数据
    sendWebsocket(data) {
      this.socketTask.send({
        data,
        success(res) {
          console.log("消息发送成功:" + JSON.stringify(data));
        },
        fail(err) {
          console.log("消息发送失败:" + JSON.stringify(err));
          this.webSocketReConnect();
        },
      });
    },
    // 开始拍照
    startTakePicture() {
      this.isTakingPic = true;
      uni.$on("get-img-path", (path) => {
        this.handlePathToBase64(path).then((base64) => {
          let base64Str = base64.replace(/[\r\n]/g, "");
          this.faceRecognition(base64Str);
        });
      });
      this.startFacePreview();
    },
    startFacePreview() {
      uni.$emit("live-push", {
        status: "setStyle",
        width: "1920",
        height: "1080",
        left: "-1920",
        top: "-1080",
      });
      uni.$emit("live-push", {
        status: "startPre",
      });
      uni.$emit("live-push", {
        status: "snapshot",
      });
    },
    // 人脸识别
    async faceRecognition(base64Str = "") {
      // 结束人脸拍照
      this.stopTakePicture(false);
      const { roomId } = uni.getStorageSync("terminalInfo");
      let params = {
        data: {
          roomId,
          base64Str,
        },
      };
      let res = await Api.apiCall(
        "post",
        Api.prisoner.faceRecognition1N,
        params,
        true,
        true
      );
      this.faceParams.image = `data:image/png;base64,${base64Str}`;
      if (res.state.code == 200) {
        const { rybh } = res.data;
        this.faceParams.rybh = rybh;
        this.saveAlarmPicInfo();
      } else {
        this.startTakePicture();
      }
    },
    // 结束人脸拍照
    async stopTakePicture(state = true) {
      uni.$off("get-img-path");
      uni.$emit("live-push", {
        status: "stopPre",
      });
      await this.clearPictures();
      if (state && this.isTakingPic) {
        await this.saveAlarmPicInfo();
      }
    },
    // 清空照片
    clearPictures() {
      // #ifdef APP-PLUS
      const dir =
        "/storage/emulated/0/Android/data/com.gksc.terminal/apps/__UNI__E9B1944/doc/snapshot";
      plus.io.resolveLocalFileSystemURL(dir, (entry) => {
        entry.removeRecursively(() => {
          console.log("清理照片成功");
        });
      });
      // #endif
    },
    // 保存拍照信息
    async saveAlarmPicInfo() {
      this.isTakingPic = false;
      let params = {
        data: this.faceParams,
      };
      let res = await Api.apiCall("post", Api.index.addAlarmPhoto, params);
      if (res.state.code == 200) {
        console.log("拍照信息保存成功");
        this.faceParams = Object.assign({}, this.faceParams, {
          alarmId: "",
          image: "",
          rybh: "",
        });
      }
    },
    // 图片路径转Base64
    handlePathToBase64(imgPath) {
      return new Promise((res, rej) => {
        pathToBase64(imgPath)
          .then((base64) => {
            let index = base64.indexOf(",") + 1;
            let imgBase64 = base64.substr(index);
            res(imgBase64);
          })
          .catch((error) => {
            rej(error);
          });
      });
    },
    // WebSocket初始连接
    connectWebSocketInit(code) {
      // 设备离线状态
      if (!getApp().globalData.webSocketConnected) {
        this.showVideoConnect = false;
        if (this.currentTab == 2) {
          this.closeRecognitionDialogs();
        }
        this.showDevOffline = true;
      } else {
        this.showDevOffline = false;
        return;
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
        this.handleShowToast("绑定终端信息成功！");
        this.webSocketOn();
        clearTimeout(this.socketTimer);
        clearTimeout(this.heartbeatTimer);
        // 数据为空，重新加载
        if (isNullStr(this.prisonerNum.totalNum)) {
          setTimeout(() => {
            this.initHomeData(false);
          }, 60000);
        }
      });
      this.socketTask.onError((err) => {
        console.log(
          "连接失败，可能是websocket服务不可用，正在发起重连",
          JSON.stringify(err)
        );
        this.webSocketReConnect();
      });
      // 关闭WebSocket
      this.socketTask.onClose((res) => {
        console.log("检测到WebSocket连接关闭，正在发起重连！！");
        clearTimeout(this.heartbeatTimer);
        this.webSocketReConnect();
      });
      // 获取主机websocket数据
      this.socketTask.onMessage((res) => {
        let info = JSON.parse(res.data);
        if (info.type == this.$config.controlType.FACE) {
          console.log(info);
        } else {
          console.log(JSON.stringify(info));
        }
        if (info.type == this.$config.controlType.HEARTBEAT) {
          const { terminalCode } = uni.getStorageSync("terminalInfo");
          this.sendWebsocket(
            `{maindevno:'', devno:'${terminalCode}', type:'000', msg:'1',extend:{'ip':'${this.terminalIP}'}}`
          );
          if (!isNullStr(this.heartbeatTimer)) {
            clearTimeout(this.heartbeatTimer);
          }
          this.heartbeatTimer = setTimeout(() => {
            this.webSocketReConnect();
          }, this.heartBeatTimeOut * 1000);
        } else if (info.type == this.$config.controlType.WEBRTC) {
          if (info.msg == "0" || info.msg == "2") {
            // 0-开始视频对讲 2-开始监视监听
            const terminalInfo = uni.getStorageSync("terminalInfo");
            let webrtcServerUrl = uni.getStorageSync("webrtcServerUrl");
            this.webrtcObj = {
              position: { width: 500, height: 400, left: 0, top: 0 },
              data: Object.assign(terminalInfo, {
                type: info.msg == "0" ? "intercom" : "monitor"
              }),
              url: `${webrtcServerUrl}/web-terminal`,
            };
            getApp().globalData.Base.gotoNativePage(this.webrtcObj);
          } else if (info.msg == "1" || info.msg == "24") {
            // 挂断视频对讲
            getApp().globalData.Base.toggleCommonBtn("buttonTerminalExit");
            if (Object.keys(this.webrtcObj).length) {
              const { data: { type } } = this.webrtcObj;
              if (type == "intercom") {
                this.voiceBroadcast("对讲已挂断");
              }
            }
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            if (this.isCalling) {
              this.setCurrentTab(6);
            }
          } else if (info.msg == "6") {
            // 视频通话无应答
            this.voiceBroadcast("对方正忙，请稍后再拨");
            // 取消视频对讲
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            // 结束人脸拍照
            this.stopTakePicture();
            if (this.isCalling) {
              return this.setCurrentTab(6);
            }
            // 开始播放电教
            this.startEduPlay();
          } else if (info.msg == "8") {
            if (info.extend == "") {
              // 回传本机通话音量
              getApp().globalData.FloatUniModule.getStreamVolumeTypeVoiceCall(
                (e) => {
                  this.sendWebsocket(
                    `{maindevno:'${info.maindevno}', devno:'${info.devno}', type:'100', msg:'9',extend:'${e.value}'}`
                  );
                }
              );
            } else {
              // 设置本机通话音量
              getApp().globalData.FloatUniModule.setStreamVolumeTypeVoiceCall(
                Number(info.extend)
              );
            }
          } else if (info.msg == "10" || info.msg == "13") {
            // 主机离线，分机对讲请求超时
            this.voiceBroadcast("对方正忙，请稍后再拨");
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            if (this.isCalling) {
              return this.setCurrentTab(6);
            }
            // 开始播放电教
            this.startEduPlay();
          } else if (info.msg == "11") {
            this.voiceBroadcast("正在发起视频通话");
            this.setIsWaitingIntercom(true);
          } else if (info.msg == "12") {
            // 主机拨通仓内|仓外屏
            this.setIsIntercom(true);
            if (Object.keys(this.webrtcObj).length) {
              const { data: { type } } = this.webrtcObj;
              if (type == "intercom") {
                this.voiceBroadcast("请注意，已经开启视频对讲");
              }
            }
          } else if (info.msg == "27") {
            this.showVideoConnect = false;
            // 分机对讲中
            this.voiceBroadcast("正在对讲中，请勿重复操作");
          }
        } else if (info.type == this.$config.controlType.FACE) {
          if (info.msg == "1") {
            let { base64, length } = JSON.parse(info.extend);
            if (base64 && base64.startsWith("data:image/jpeg;base64,")) {
              this.base64Str = "";
            }
            this.base64Str += base64;
            if (this.base64Str.length >= length) {
              console.log(length, this.base64Str.length, { result: this.base64Str });
            }
          }
        } else if (info.type == this.$config.controlType.INTERCOM) {
          if (info.msg == "1" || info.msg == "24") {
            // 挂断视频对讲
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            if (this.isCalling) {
              this.setCurrentTab(6);
            }
          } else if (info.msg == "2") {
            // 开启监视监听
          } else if (info.msg == "6") {
            // 视频通话无应答
            this.voiceBroadcast("对方正忙，请稍后再拨");
            // 取消视频对讲
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            // 结束人脸拍照
            this.stopTakePicture();
            if (this.isCalling) {
              return this.setCurrentTab(6);
            }
            // 开始播放电教
            this.startEduPlay();
          } else if (info.msg == "8") {
            if (info.extend == "") {
              // 回传本机通话音量
              getApp().globalData.FloatUniModule.getStreamVolumeTypeVoiceCall(
                (e) => {
                  this.sendWebsocket(
                    `{maindevno:'${info.maindevno}', devno:'${info.devno}', type:'100', msg:'9',extend:'${e.value}'}`
                  );
                }
              );
            } else {
              // 设置本机通话音量
              getApp().globalData.FloatUniModule.setStreamVolumeTypeVoiceCall(
                Number(info.extend)
              );
            }
          } else if (info.msg == "10" || info.msg == "13") {
            // 主机离线，分机对讲请求超时
            this.voiceBroadcast("对方正忙，请稍后再拨");
            this.resetIntercom();
            this.setIsWaitingIntercom(false);
            if (this.isCalling) {
              return this.setCurrentTab(6);
            }
            // 开始播放电教
            this.startEduPlay();
          } else if (info.msg == "11") {
            this.voiceBroadcast("正在发起视频通话");
            this.setIsWaitingIntercom(true);
          } else if (info.msg == "12") {
            // 主机拨通仓内|仓外屏
            this.setIsIntercom(true);
          } else if (info.msg == "27") {
            this.showVideoConnect = false;
            // 分机对讲中
            this.voiceBroadcast("正在对讲中，请勿重复操作");
          }
        } else if (info.type == this.$config.controlType.RADIO) {
          if (info.msg == "0") {
            // 开始广播
            if (this.isIntercom || this.isWaitingIntercom) {
              return;
            }
            if (this.showRecognitionDialogs) {
              this.closeRecognitionDialogs();
            }
            if (this.audioPlayState) {
              uni.$emit("video-player", "audio", "stop");
            }
            if (this.videoPlayState) {
              uni.$emit("video-player", "video", "stop");
            }
            // 停止播放电教
            this.stopEduPlay();
            this.radioPlayState = true;
            this.audioPlayState = false;
            this.videoPlayState = false;
            this.broadcastUrl = uni.getStorageSync("rtmpUrl") + info.maindevno;
            uni.$emit("video-player", "radio", "start", this.broadcastUrl);
            // 分机回传音量
            this.radioVolumeHandler(info, "4");
            this.receiveTask("radio", "start");
          } else if (info.msg == "1") {
            // 停止广播
            this.stopRadioHandler("stop", true);
          } else if (info.msg == "3") {
            // 分机静音
            if (info.extend == "0") {
              // 关闭静音
              getApp().globalData.FloatUniModule.setStreamVolumeTypeMusic(
                Number(uni.getStorageSync("mediaDefaultVolume"))
              );
            } else if (info.extend == "1") {
              // 开启静音
              getApp().globalData.FloatUniModule.setStreamVolumeTypeMusic(0);
            }
          } else if (info.msg == "5") {
            // 回传主机音量
            let { volumeList } = JSON.parse(info.extend);
            volumeList.forEach((item) => {
              if (item.terminalCode == info.devno) {
                getApp().globalData.FloatUniModule.setStreamVolumeTypeMusic(
                  Number(item.volume)
                );
              }
            });
            // 分机回传音量
            this.radioVolumeHandler(info, "6");
          }
        } else if (info.type == this.$config.controlType.AUDIO) {
          if (info.msg == "0") {
            // 开始播放音频
            if (this.isCalling || this.eduPlayState) {
              return;
            }
            if (this.showRecognitionDialogs) {
              this.closeRecognitionDialogs();
            }
            if (this.radioPlayState) {
              uni.$emit("video-player", "radio", "stop");
            }
            if (this.videoPlayState) {
              uni.$emit("video-player", "video", "stop");
            }
            this.radioPlayState = false;
            this.audioPlayState = true;
            this.videoPlayState = false;
            let extend = JSON.parse(info.extend);
            this.audioList = extend.audioList;
            let audioIndex = 0;
            let terminalObj = {
              maindevno: info.maindevno,
              devno: uni.getStorageSync("terminalInfo").terminalCode,
              type: "300",
              msg: "3",
              extend: {},
            };
            clearInterval(this.audioTimer);
            this.audioInfo = this.audioList[audioIndex];
            if (extend.hasOwnProperty("duration")) {
              // 后台控制音频
              let duration = extend.duration;
              this.audioTimer = setInterval(() => {
                duration--;
                if (duration == 0) {
                  // 停止播放音频
                  clearInterval(this.audioTimer);
                  duration = extend.duration;
                  innerAudioContext.stop();
                }
              }, 1000);
            } else {
              // 主机播放音频
              getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic(
                (e) => {
                  terminalObj.extend = {
                    devno: uni.getStorageSync("terminalInfo").terminalCode,
                    audio: this.audioInfo.name,
                    volume: e.value,
                  };
                  this.sendWebsocket(JSON.stringify(terminalObj));
                }
              );
            }
            uni.$emit("video-player", "audio", "start", this.audioInfo.url);
            uni.$on("onEnded", () => {
              audioIndex++;
              if (audioIndex >= this.audioList.length) {
                // 列表循环播放
                audioIndex = 0;
              }
              this.audioInfo = this.audioList[audioIndex];
              uni.$emit("video-player", "audio", "start", this.audioInfo.url);
              if (!extend.hasOwnProperty("duration")) {
                getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic(
                  (e) => {
                    terminalObj.extend = {
                      devno: uni.getStorageSync("terminalInfo").terminalCode,
                      audio: this.audioInfo.name,
                      volume: e.value,
                    };
                    this.sendWebsocket(JSON.stringify(terminalObj));
                  }
                );
              }
            });
            this.receiveTask("audio", "start");
            this.disabledState = false;
          } else if (info.msg == "1") {
            // 停止播放音频
            this.stopAudioHandler("stop", true);
          } else if (info.msg == "4") {
            if (info.extend == "0") {
              // 继续播放音频
              uni.$emit("video-player", "audio", "resume");
              this.disabledState = false;
            } else if (info.extend == "1") {
              // 暂停播放音频
              uni.$emit("video-player", "audio", "pause");
              this.disabledState = false;
            }
          } else if (info.msg == "5") {
            // 回传主机音量
            let { volumeList } = JSON.parse(info.extend);
            volumeList.forEach((item) => {
              if (item.terminalCode == info.devno) {
                getApp().globalData.FloatUniModule.setStreamVolumeTypeMusic(
                  Number(item.volume)
                );
              }
            });
            getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic((e) => {
              uni.setStorageSync("mediaDefaultVolume", e.value);
              const { terminalCode } = uni.getStorageSync("terminalInfo");
              let terminalObj = {
                maindevno: info.maindevno,
                devno: terminalCode,
                type: "300",
                msg: "6",
                extend: e.value,
              };
              this.sendWebsocket(JSON.stringify(terminalObj));
            });
          }
        } else if (info.type == this.$config.controlType.VIDEO) {
          if (info.msg == "0") {
            // 开始播放视频
            if (this.isCalling || this.eduPlayState) {
              return;
            }
            if (this.showRecognitionDialogs) {
              this.closeRecognitionDialogs();
            }
            if (this.radioPlayState) {
              uni.$emit("video-player", "radio", "stop");
            }
            if (this.audioPlayState) {
              uni.$emit("video-player", "audio", "stop");
            }
            this.radioPlayState = false;
            this.audioPlayState = false;
            this.videoPlayState = true;
            let extend = JSON.parse(info.extend);
            if (extend.videoList.length) {
              let videoInfo = extend.videoList[0];
              uni.$emit("video-player", "video", "start", videoInfo.url);
              clearInterval(this.videoTimer);
              if (extend.hasOwnProperty("duration")) {
                // 后台控制视频
                let { endTime } = extend;
                let seconds = convertTimeToSeconds(endTime);
                if (!!seconds) {
                  this.videoTimer = setInterval(() => {
                    seconds--;
                    if (seconds <= 0) {
                      // 停止播放音频
                      this.stopVideoHandler("stop");
                    }
                  }, 1000);
                  this.receiveTask("video", "start");
                  this.disabledState = true;
                } else {
                  // 停止播放视频
                  this.stopVideoHandler("stop");
                }
              } else {
                getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic(
                  (e) => {
                    // 主机播放视频
                    let terminalObj = {
                      maindevno: info.maindevno,
                      devno: uni.getStorageSync("terminalInfo").terminalCode,
                      type: "400",
                      msg: "3",
                      extend: {
                        devno: uni.getStorageSync("terminalInfo").terminalCode,
                        video: videoInfo.name,
                        volume: e.value,
                      },
                    };
                    this.sendWebsocket(JSON.stringify(terminalObj));
                  }
                );
                this.receiveTask("video", "start");
                this.disabledState = true;
              }
            } else {
              this.handleShowToast("当前视频列表为空");
            }
          } else if (info.msg == "1") {
            // 停止播放视频
            this.stopVideoHandler("stop", true);
          } else if (info.msg == "4") {
            if (info.extend == "0") {
              // 继续播放视频
              uni.$emit("video-player", "video", "resume");
            } else if (info.extend == "1") {
              // 暂停播放视频
              uni.$emit("video-player", "video", "pause");
            }
          } else if (info.msg == "6") {
            // 回传主机音量
            let { volumeList } = JSON.parse(info.extend);
            volumeList.forEach((item) => {
              if (item.terminalCode == info.devno) {
                getApp().globalData.FloatUniModule.setStreamVolumeTypeMusic(
                  Number(item.volume)
                );
              }
            });
            getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic((e) => {
              uni.setStorageSync("mediaDefaultVolume", e.value);
              const { terminalCode } = uni.getStorageSync("terminalInfo");
              let terminalObj = {
                maindevno: info.maindevno,
                devno: terminalCode,
                type: "400",
                msg: "7",
                extend: e.value,
              };
              this.sendWebsocket(JSON.stringify(terminalObj));
            });
          }
        } else if (info.type == this.$config.controlType.ALARM) {
          // 声光报警线路输出
          if (info.msg == "2" || info.msg == "3") {
            this.voiceBroadcast("对方正忙，请稍后再拨");
            this.intercomState = false;
            this.setIsWaitingIntercom(false);
            // 结束人脸拍照
            this.stopTakePicture();
            if (this.isCalling) {
              this.setCurrentTab(6);
            }
          } else if (info.msg == "4") {
            // 报警超时
            this.intercomState = false;
            this.setIsWaitingIntercom(false);
            // 结束人脸拍照
            this.stopTakePicture();
            if (this.isCalling) {
              this.setCurrentTab(6);
            }
          } else if (info.msg == "7") {
            this.setIsWaitingIntercom(true);
          } else if (info.msg == "8") {
          } else if (info.msg == "9") {
            // 分机报警中
            this.voiceBroadcast("正在报警中，请勿重复操作");
          } else if (info.msg == "10") {
            this.voiceBroadcast("正在发起应急报警");
            this.setIsWaitingIntercom(true);
            // 按键报警人脸抓拍
            if (Reflect.has(info, "extend")) {
              const { alarmId } = JSON.parse(info.extend);
              this.faceParams.alarmId = alarmId;
              this.startTakePicture();
            }
            if (this.isCalling && this.currentTab == 6) {
              this.$refs.call.discontinueCall(true);
            }
          }
        } else if (info.type == this.$config.controlType.ROLLCALL) {
          if (this.isIntercom || this.isWaitingIntercom) {
            return;
          }
          this.closeModal("RecognitionDialogs");
          this.handleLogout();
          clearInterval(this.videoTimer);
          if (this.radioPlayState) {
            this.stopRadioHandler("0", true);
          }
          if (this.audioPlayState) {
            this.stopAudioHandler("0", true);
          }
          if (this.videoPlayState) {
            this.stopVideoHandler("0", true);
          }
          if (this.currentTab == 18) {
            // 停止视频点播
            this.$refs.video.stopPlayVideo(false);
          }
          if (info.msg == "0") {
            // 临时|在线点名
            let extend = JSON.parse(info.extend);
            this.setRollInfo(extend);
            // 停止智能谈话
            if (this.isConversation) {
              this.setIsConversation(false);
            }
            // 停止心理测评
            if (this.isEvaluation) {
              this.setIsEvaluation(false);
            }
            // 停止播放电教
            this.stopEduPlay();
            setTimeout(() => {
              this.setCurrentTab(6);
            }, 1500);
          } else if (info.msg == "2") {
            if (this.currentTab == 6) {
              this.$refs.call.stopRollCall();
            }
            // 开始播放电教
            this.startEduPlay();
          }
        } else if (info.type == this.$config.controlType.DEVICE) {
          if (info.msg == "0") {
            let options = {
              content: info.extend,
            };
            getApp().globalData.Base.speech(options);
          } else if (info.msg == "1") {
            getApp().globalData.Base.speechStop();
          } else if (info.msg == "2") {
            console.log("设备校时");
            this.timing = info.extend;
            getApp().globalData.FloatUniModule.setSystemTime(info.extend);
          } else if (info.msg == "3") {
            // 关闭视频
            clearInterval(this.videoTimer);
            uni.$emit("video-player", "video", "stop");
            // 设备重启
            uni.closeSocket();
            getApp().globalData.FloatUniModule.rebootSystem();
          } else if (info.msg == "4") {
            if (!!info.extend) {
              let ids = info.extend;
              // 删除在押人员指纹ID
              this.delPrisonerFingerId(ids);
            } else {
              // 同步在押人员指纹
              this.syncPrisonerFinger();
            }
          } else if (info.msg == "5") {
            // 同步民警指纹
            this.syncPoliceFinger();
          } else if (info.msg == "6") {
            // 同步配置信息
            this.configInfoSync();
          } else if (info.msg == "7") {
            // 自动升级APP
            this.getUpdateAppInfo(1);
          } else if (info.msg == "8") {
            this.closeModal("RecognitionDialogs");
            // 关闭视频
            clearInterval(this.videoTimer);
            uni.$emit("video-player", "video", "stop");
            // 应用重启
            getApp().globalData.Base.rebootApp("com.gksc.terminal");
          } else if (info.msg == "9") {
            if (this.currentTab == 1) {
              this.initHomeData(true);
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
            Log.uploadLogFile(info.extend);
          } else if (info.msg == "14") {
            // this.setTemperatureRange(info.extend);
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
          } else if (info.msg == "17") {
            // 停止播放电教
            this.stopEduPlay();
            uni.$emit("video-player", "video", "stop");
          } else if (info.msg == "18") {
            if (Reflect.has(info, "extend") && Object.keys(info.extend).length) {
              let extend = JSON.parse(info.extend);
              this.loginStatusHanlder(extend);
              this.setCurrentTab(2);
            } else {
              let admin = {
                name: "管理员",
                dabh: "099",
                rybh: "0999",
              };
              this.loginStatusHanlder(admin);
            }
          } else if (info.msg == "19") {
            clearInterval(this.timer);
            this.loginStatusHanlder();
            this.setCurrentTab(1);
          } else if (info.msg == "23") {
            // 开始屏保
            this.startScreenSaver();
          } else if (info.msg == "24") {
            // 停止屏保
            this.stopScreenSaver();
          }
        } else if (info.type == this.$config.controlType.DUTY) {
          if (info.msg == "2") {
            let extend = JSON.parse(info.extend);
            this.setDutyList(extend.personList);
          }
        } else if (info.type == this.$config.controlType.CONVERSATION) {
          // 智能谈话
          this.taskHandler(info, 0);
        } else if (info.type == this.$config.controlType.EVALUATION) {
          // 心理测评
          this.taskHandler(info, 1);
        }
      });
    },
    // 智能谈话|心理测评处理方法
    taskHandler(info, type) {
      if (info.msg == "0") {
        if (this.isCalling || this.isConversation || this.isEvaluation) {
          return;
        }
        // 开始智能谈话|心理测评
        clearInterval(this.timer);
        this.setTaskId(info.extend);
        this.voiceBroadcast(type == 0 ? "开始智能谈话" : "开始心理测评");
        setTimeout(() => {
          this.setCurrentTab(type == 0 ? 19 : 21);
        }, 3000);
      } else if (info.msg == "1") {
        if (type == 0) {
          // 结束智能谈话
          this.setIsConversation(false);
        } else {
          // 结束心理测评
          this.setIsEvaluation(false);
        }
        this.voiceBroadcast(type == 0 ? "谈话已结束" : "测评已结束");
        this.closeModal("RecognitionDialogs");
        if (![6].includes(this.currentTab)) {
          this.setCurrentTab(1);
        }
      }
    },
    // 停止广播
    stopRadioHandler(status, state) {
      if (this.radioPlayState) {
        uni.$emit("video-player", "radio", "stop");
      }
      this.receiveTask("radio", `${status}`);
      this.radioPlayState = false;
      this.disabledState = false;
      if (state) {
        // 开始播放电教
        this.startEduPlay();
      }
    },
    // 停止播放音频
    stopAudioHandler(status, state) {
      clearInterval(this.audioTimer);
      if (this.audioPlayState) {
        uni.$emit("video-player", "audio", "stop");
      }
      uni.$off("onEnded");
      this.receiveTask("audio", `${status}`);
      this.audioPlayState = false;
      this.disabledState = false;
      if (state) {
        // 开始播放电教
        this.startEduPlay();
      }
    },
    // 停止播放视频
    stopVideoHandler(status, state) {
      clearInterval(this.videoTimer);
      if (this.videoPlayState) {
        uni.$emit("video-player", "video", "stop");
      }
      this.receiveTask("video", `${status}`);
      this.videoPlayState = false;
      this.disabledState = false;
      if (state) {
        // 开始播放电教
        this.startEduPlay();
      }
    },
    // 分机广播回传音量
    radioVolumeHandler(info, msg) {
      getApp().globalData.FloatUniModule.getStreamVolumeTypeMusic((e) => {
        uni.setStorageSync("mediaDefaultVolume", e.value);
        const { terminalCode } = uni.getStorageSync("terminalInfo");
        let terminalObj = {
          maindevno: info.maindevno,
          devno: terminalCode,
          type: "200",
          msg,
          extend: e.value,
        };
        this.sendWebsocket(JSON.stringify(terminalObj));
      });
    },
    // 获取首页数据
    initHomeData(state) {
      // 获取警官信息
      this.getPoliceInfo();
      // 获取监室人数
      this.getPrisonerNum();
      // 获取动态信息
      this.getDynamicInfo(state);
    },
    // 打开监室等级时间周期弹框
    openRoomLevelModal() {
      if (this.roomLevel == "严管监室") {
        this.showLevelTimeModal = true;
        this.levelTimer = setTimeout(() => {
          clearTimeout(this.levelTimer);
          this.showLevelTimeModal = false;
        }, 8000);
      }
    },
    webSocketReConnect() {
      clearTimeout(this.socketTimer);
      // 重置会话，如不重置，重复创建会话对象，不知资源是否会释放
      if (this.socketTask != null) {
        this.socketTask.close({
          success: (res) => {
            console.log(JSON.stringify(res), "关闭WebSocket成功！");
          },
          fail: (err) => {
            console.log(JSON.stringify(err), "关闭WebSocket失败！");
          },
        });
        this.socketTask = null;
      }
      this.webSocketOff();
      this.showVideoConnect = false;
      this.reconnectCount++;
      this.socketTimer = setTimeout(() => {
        const { terminalCode } = uni.getStorageSync("terminalInfo");
        console.log(
          "create，清除this.socketTimer定时器，触发重连机制",
          terminalCode
        );
        this.connectWebSocketInit(terminalCode);
      }, this.websocketTime);
    },
    webSocketOff() {
      // 离线标记
      this.showDevOffline = true;
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
      // 获取APP配置菜单
      this.getAppMenuList();
    },
    // 删除在押人员指纹
    delPrisonerFingerId(ids) {
      // 打开指纹设备
      getApp().globalData.FloatUniModule.fingerModuleStop();
      getApp().globalData.FloatUniModule.syncStartFinger((e) => {
        if (e.code == 0) {
          let res = 0;
          for (let i = 0; i < ids.length; i++) {
            getApp().globalData.FloatUniModule.clearFingerprintById(ids[i]);
            res++;
          }
          if (res > 0) {
            this.handleShowToast("删除在押人员指纹成功");
            console.log("删除在押人员指纹成功");
          } else {
            this.handleShowToast("删除在押人员指纹失败");
            console.log("删除在押人员指纹失败");
          }
          getApp().globalData.FloatUniModule.syncStopFinger((e) => {
            if (e.code == 0) {
              console.log("关闭指纹");
              getApp().globalData.FloatUniModule.fingerModuleStop();
            }
          });
        } else {
          this.voiceBroadcast("指纹设备未打开");
          console.log("指纹设备未打开");
        }
      });
    },
    // 同步在押人员指纹
    syncPrisonerFinger() {
      // 打开指纹设备
      getApp().globalData.FloatUniModule.fingerModuleStop();
      getApp().globalData.FloatUniModule.syncStartFinger((e) => {
        if (e.code == 0) {
          console.log("打开指纹");
          getApp().globalData.FloatUniModule.clearAllFingerprint();
          // 同步在押人员信息
          this.syncPrisonerFingerInfo();
          console.log("删除全部指纹成功");
        } else {
          this.voiceBroadcast("指纹设备未打开");
          console.log("指纹设备未打开");
        }
      });
    },
    // 同步在押人员指纹信息
    async syncPrisonerFingerInfo() {
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall("get", Api.index.syncRoomPersonFingerInfo, {
        roomNo,
      });
      if (res.state.code == 200) {
        if (res.data.length) {
          let successNum = 0,
            failNum = 0,
            successList = [],
            failList = [];
          res.data.map((item) => {
            getApp().globalData.FloatUniModule.fingerprintFeatureInput(
              item.mKey,
              item.pHint
            );
            successNum++;
            successList.push(item.mKey);
          });
          this.closeModal("PrisonerFinger");
          this.handleShowToast(
            `同步在押人员指纹成功${successNum}个，失败${failNum}个`
          );
          console.log(`同步在押人员指纹成功${successNum}个，失败${failNum}个`);
          let content = `设备指纹特征同步结果：监室号：${roomNo}，成功：${successList}，失败：${failList}`;
          this.saveFingerStateInfo(content, "06");
        } else {
          this.closeModal("PrisonerFinger");
          this.handleShowToast("同步在押人员指纹为空");
          console.log("在押人员指纹为空");
        }
        getApp().globalData.FloatUniModule.syncStopFinger((e) => {
          if (e.code == 0) {
            console.log("关闭指纹");
            getApp().globalData.FloatUniModule.fingerModuleStop();
          }
        });
      }
    },
    // 同步民警指纹信息
    syncPoliceFinger() {
      // 打开指纹设备
      getApp().globalData.FloatUniModule.syncStartFinger((e) => {
        if (e.code == 0) {
          console.log("指纹设备已打开");
          getApp().globalData.FloatUniModule.clearAllFingerprint();
          // 同步民警信息
          this.syncPoliceFingerInfo();
          console.log("删除全部指纹成功");
        } else {
          this.voiceBroadcast("指纹设备未打开");
          console.log("指纹设备未打开");
        }
      });
    },
    // 民警指纹信息
    async syncPoliceFingerInfo() {
      const { roomId } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall("get", Api.police.getPoliceFingerInfo, {
        roomId,
      });
      if (res.state.code == 200) {
        if (res.data.length) {
          let successNum = 0,
            failNum = 0,
            successList = [],
            failList = [];
          res.data.map((item) => {
            if (!!item.mKey) {
              getApp().globalData.FloatUniModule.fingerprintFeatureInput(
                item.mKey,
                item.pHint
              );
              successNum++;
              successList.push(item.mKey);
            }
            if (!!item.mKey2) {
              getApp().globalData.FloatUniModule.fingerprintFeatureInput(
                item.mKey2,
                item.pHint2
              );
              successNum++;
              successList.push(item.mKey2);
            }
          });
          this.closeModal("PoliceFinger");
          console.log(`同步民警指纹成功${successNum}个，失败${failNum}个`);
          this.handleShowToast(
            `同步民警指纹成功${successNum}个，失败${failNum}个`
          );
          const { roomNo } = uni.getStorageSync("terminalInfo");
          let content = `设备指纹特征同步结果：监室号：${roomNo}，成功：${successList}，失败：${failList}`;
          this.saveFingerStateInfo(content, "07");
        } else {
          this.closeModal("PoliceFinger");
          this.handleShowToast("同步民警指纹为空");
          console.log("民警指纹为空");
        }
        getApp().globalData.FloatUniModule.syncStopFinger((e) => {
          if (e.code == 0) {
            console.log("指纹设备已关闭");
            getApp().globalData.FloatUniModule.fingerModuleStop();
          }
        });
      }
    },
    // 保存指纹同步状态（成功|失败）信息
    async saveFingerStateInfo(content, type) {
      let res = await Api.apiCall(
        "post",
        Api.index.saveFingerState + `?content=${content}&logType=${type}`,
        null
      );
      if (res.state.code == 200) {
        this.handleShowToast("保存同步指纹信息成功");
      }
    },
    // 视频通话弹框
    handleVideoConnect() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 3000);
        if (!getApp().globalData.webSocketConnected) {
          this.showVideoCall = false;
          this.showVideoConnect = false;
          this.showDevOffline = true;
          return;
        }
        this.voiceBroadcast("正在发起视频通话");
        this.showVideoCall = false;
        this.showVideoConnect = true;
        const { terminalCode } = uni.getStorageSync("terminalInfo");
        this.sendWebsocket(
          `{maindevno:'', devno:'${terminalCode}', type:'100', msg:'4'}`
        );
      }
    },
    // 应急报警弹框
    handleAlarmConfirm() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 3000);
        if (!getApp().globalData.webSocketConnected) {
          this.showAlarmInit = false;
          this.showVideoConnect = false;
          this.showDevOffline = true;
          return;
        }
        if (this.alarmCount == 0) {
          this.voiceBroadcast("正在发起应急报警");
          this.saveAlarmInfo();
        } else {
          this.showAlarmInit = false;
          return;
        }
        this.alarmTimer = setInterval(() => {
          this.alarmCount++;
          if (this.alarmCount == this.keyAlarmTime) {
            clearInterval(this.alarmTimer);
            this.alarmCount = 0;
          }
        }, 1000);
      }
    },
    // 获取应急报警信息
    async saveAlarmInfo() {
      const { terminalId } = uni.getStorageSync("terminalInfo");
      let params = {
        alarmEvents: "1",
        alarmLevel: "1",
        status: "n",
        terminalId,
      };
      let res = await Api.apiCall(
        "post",
        Api.index.saveAlarmInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        const { terminalCode } = uni.getStorageSync("terminalInfo");
        const { roomName } = uni.getStorageSync("terminalInfo");
        let alarmId = res.data.id;
        this.sendWebsocket(
          `{maindevno:'', devno:'${terminalCode}', type:'500', msg:'0',extend:{'roomName':'${roomName}', 'alarmId':'${alarmId}'}}`
        );
        this.closeModal("AlarmInit");
      }
    },
    // 返回首页
    onClickHome() {
      clearInterval(this.timer);
      this.closeModal("RecognitionDialogs");
      if (this.person.id != "0999") {
        this.loginStatusHanlder();
      }
      if (![6].includes(this.currentTab)) {
        this.setCurrentTab(1);
      }
    },
    // 页面回退
    onClickBack() {
      this.initCountTimeout();
      let tabs = this.policeList.map((item) => item.index);
      if (tabs.includes(this.currentTab)) {
        this.setCurrentTab(3);
      } else {
        this.setCurrentTab(2);
      }
    },
    // 登出
    handleLogout() {
      clearInterval(this.timer);
      this.closeModal("RecognitionDialogs");
      this.loginStatusHanlder();
      if (![6].includes(this.currentTab)) {
        this.setCurrentTab(1);
      }
    },
    // 登录状态处理方法
    loginStatusHanlder(info = {}) {
      this.setPersonInfo(info);
      if (Object.keys(info).length) {
        this.person.name = info.name;
        this.person.id = this.currentTab == 3 ? info.userId : info.rybh;
        this.setLoginState(true);
      } else {
        this.person.id = "";
        this.person.name = "";
        this.setLoginState(false);
      }
    },
    // 底栏设置
    handleSetUp() {
      if (this.currentTab == 1) {
        if (this.clickNums == 3) {
          this.clickNums = 0;
          this.setupState = true;
          this.showSystemPwd = true;
        } else {
          this.clickNums = this.clickNums + 1;
        }
      }
    },
    // 清理缓存
    clearALLCache() {
      uni.showModal({
        title: "提示",
        content: "是否确定清除App所有数据存储缓存？",
        success: res => {
          if (res.confirm) {
            uni.clearStorageSync();
            uni.removeStorageSync("saveCartList");
            this.sysCacheInfo = "";
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
    // 新增(防拆报警)动态信息
    async setAlarmDynamic() {
      let operationTime = dateFormat("YYYY-MM-DD", new Date());
      let terminalInfo = uni.getStorageSync("terminalInfo");
      let { controlId, areaName, roomName } = terminalInfo;
      let content = `${areaName}${roomName}发生防拆报警`;
      let params = {
        type: "700",
        controlId,
        operationTime,
        content,
      };
      let res = await Api.apiCall("post", Api.index.setDynamicInfo, params);
      if (res.state.code == 200) {
        this.handleShowToast("防拆报警动态保存成功");
        // 推送主机(防拆报警)动态消息
        this.sendControlMsg();
      }
    },
    // 推送主机(防拆报警)动态消息
    async sendControlMsg() {
      let params = {
        type: "700",
        msg: "9",
        maindevno: "",
        devno: "",
        extend: "",
      };
      const { controlCode } = uni.getStorageSync("terminalInfo");
      await Api.apiCall(
        "post",
        Api.index.sendMsgToControl + `?devNo=${controlCode}`,
        params
      );
    },
    // 人脸认证成功回调
    faceRecognitionSuccess(res) {
      this.recognitionHanlder(res);
    },
    // 指纹认证成功回调
    fingerRecognitionSuccess(res) {
      this.getLoginPersonInfo(res);
    },
    // 获取指纹认证登录人员信息
    async getLoginPersonInfo(data) {
      let params = {
        mKey: data.mKey,
      };
      let url = "";
      if (this.currentTab == 2) {
        url = Api.index.getOdsPrisonerInfo;
        params.roomNo = uni.getStorageSync("terminalInfo").roomNo;
      }
      if (this.currentTab == 3) {
        url = Api.index.getOdsPoliceInfo;
        params.roomId = uni.getStorageSync("terminalInfo").roomId;
      }
      let res = await Api.apiCall("get", url, params, true);
      if (res.state.code == 200) {
        if (Reflect.has(res, "data")) {
          if (Object.keys(res.data).length) {
            this.voiceBroadcast("指纹识别成功");
            this.recognitionHanlder(res.data);
          } else {
            this.voiceBroadcast("识别失败，指纹不匹配");
            this.onClickHome();
          }
        } else {
          this.voiceBroadcast("识别失败，没有录入该指纹");
          this.onClickHome();
        }
      }
    },
    // 认证成功处理方法
    recognitionHanlder(data) {
      this.closeModal("RecognitionDialogs");
      this.setPersonInfo(data);
      if (this.currentTab == 19) {
        this.setCurrentTab(20);
        return;
      }
      if (this.currentTab == 21) {
        this.setCurrentTab(22);
        return;
      }
      this.loginStatusHanlder(data);
    },
    // 关闭登录弹框
    closeRecognitionDialogs() {
      clearInterval(this.timer);
      this.closeModal("RecognitionDialogs");
      this.loginStatusHanlder();
      if (![6].includes(this.currentTab)) {
        this.setCurrentTab(1);
      }
    },
    // 回传电教播放信息
    async callbackEduVideoInfo(status) {
      const { terminalCode } = uni.getStorageSync("terminalInfo");
      await Api.apiCall(
        "get",
        Api.index.updateEduTaskStatus + `${terminalCode}` + `&status=${status}`,
        null
      );
    },
    receiveTask(task, status) {
      const { terminalCode } = uni.getStorageSync("terminalInfo");
      this.sendWebsocket(
        `{maindevno:'', devno:'${terminalCode}', type:'000', msg:'1',extend:{'task':${task},'status':${status}}}`
      );
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
        let res = getApp().globalData.Base.speech(options);
        if (res.code == 0) {
          // console.log("播报成功");
        } else {
          console.log("播报失败");
        }
      }
    },
    // 打开弹框
    openModal(type) {
      this[`show${type}`] = true;
    },
    // 关闭弹框
    closeModal(type) {
      this[`show${type}`] = false;
      if (type == "FingerInit") {
        clearInterval(this.timer);
        if (![6].includes(this.currentTab)) {
          this.setCurrentTab(1);
        }
      } else if (type == "UpdateApp") {
        this.disabledClick = false;
      } else if (type == "VideoCall") {
        this.intercomState = false;
      } else if (type == "RestartDev") {
        this.intercomState = false;
      } else if (type == "LevelTimeModal") {
        clearTimeout(this.levelTimer);
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
