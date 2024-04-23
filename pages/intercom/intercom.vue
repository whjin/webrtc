<template>
  <div class="intercom-container">
    <div class="intercom-wrapper">
      <div class="intercom-left">
        <div class="intercom-left-box">
          <div class="left-tab">
            <div :class="page == 0 ? 'tab-active' : 'tab'" @click="handleTabChange(0)">
              分机列表
            </div>
            <div :class="page == 1 ? 'tab-active' : 'tab'" @click="handleTabChange(1)">
              主机列表
            </div>
          </div>
          <div class="left-content">
            <div v-if="page == 0" class="terminal-list">
              <div class="terminal-search rectangle-img">
                <input class="input-search" v-model="searchTerminal" @input="searchTerminalChange" />
                <common-icons type="iconsearch" color="#fff" size="20" @click="searchTerminalRoom"></common-icons>
              </div>
              <div class="terminal-room-box">
                <scroll-view scroll-y="true">
                  <!-- 监视监听轮巡 -->
                  <v-tree v-if="isPolling" showCheckbox :disabledSelect="openIntercom" :root="terminalList"
                    :changeHandler="terminalCheck"></v-tree>
                  <v-tree v-else showRadio :disabledSelect="openIntercom" leaf-only :root="terminalList"
                    :changeHandler="terminalSelect"></v-tree>
                </scroll-view>
              </div>
            </div>
            <div v-if="page == 1" class="control-list">
              <div class="terminal-search rectangle-img">
                <input class="input-search" v-model="searchControl" @input="searchControlChange" />
                <div class="search-btn" @click="searchControlRoom">
                  <common-icons type="iconsearch" color="#fff" size="20"></common-icons>
                </div>
              </div>
              <div class="terminal-room-box">
                <scroll-view scroll-y="true">
                  <v-tree showRadio :disabledSelect="openIntercom" leaf-only :root="controlList"
                    :changeHandler="controlSelect"></v-tree>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
        <div v-if="page == 0" class="terminal-left-footer">
          <!-- 监视监听轮巡 -->
          <div v-if="isPolling" class="intercom-box" :class="[
            !!checked && monitorSelect.id == monitorList[0].id
              ? 'rectangle-active-img'
              : 'rectangle-img',
            openIntercom ? 'disabled-select' : '',
          ]" @click="monitorControl(monitorList[0])">
            <div class="intercom-item" :class="!!checked && monitorSelect.id == monitorList[0].id
              ? ''
              : 'intercom-item'
              ">
              <common-icons :type="monitorList[0].type" :color="!!checked && monitorSelect.id == monitorList[0].id
                ? '#35FFFA'
                : '#fff'
                " size="20"></common-icons>
              <div class="intercom-content" :class="!!checked && monitorSelect.id == monitorList[0].id
                ? 'intercom-content-active'
                : 'intercom-content'
                ">
                {{ monitorList[0].name }}
              </div>
            </div>
          </div>
          <div v-else class="intercom-box" v-for="(item, index) in monitorList" :key="index" :class="!!checked && monitorSelect.id == item.id
            ? 'rectangle-active-img'
            : 'rectangle-img'
            " @click="monitorControl(item)">
            <div class="intercom-item" :class="!!checked && monitorSelect.id == item.id ? '' : 'intercom-item'
              ">
              <common-icons :type="item.type" :color="!!checked && monitorSelect.id == item.id ? '#35FFFA' : '#fff'
                " size="20"></common-icons>
              <div class="intercom-content" :class="!!checked && monitorSelect.id == item.id
                ? 'intercom-content-active'
                : 'intercom-content'
                ">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="page == 1" class="control-left-footer">
          <div class="intercom-box" :class="!!checked && monitorSelect.id == monitorList[1].id
            ? 'rectangle-active-img'
            : 'rectangle-img'
            " @click="monitorControl(monitorList[1])">
            <div class="intercom-item" :class="!!checked && monitorSelect.id == monitorList[1].id
              ? ''
              : 'intercom-item'
              ">
              <common-icons :type="monitorList[1].type" :color="!!checked && monitorSelect.id == monitorList[1].id
                ? '#35FFFA'
                : '#fff'
                " size="20"></common-icons>
              <div class="intercom-content" :class="!!checked && monitorSelect.id == monitorList[1].id
                ? 'intercom-content-active'
                : 'intercom-content'
                ">
                {{ monitorList[1].name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="intercom-center">
        <div class="intercom-center-box">
          <div class="room-control">
            <div v-if="checked.name" class="room-control-item">
              <div>{{ checked.name }}</div>
              <div class="monitor-selected">{{ monitorSelect.name }}</div>
            </div>
            <div class="intercom-control-box">
              <!-- 静音 -->
              <div v-show="openIntercom" class="intercom-control" @click="handleVideoMute">
                <common-icons type="iconaudio" size="24" :color="isMute ? '#35FFFA' : '#fff'"></common-icons>
                <text :style="{ color: isMute ? '#35FFFA' : '#fff' }">静音</text>
              </div>
              <!-- 音量 -->
              <div class="intercom-control" :class="{ 'control-disabled': !openIntercom }" @click="volumeControl">
                <common-icons type="iconvolume" size="24" :color="isVolume ? '#35FFFA' : '#fff'"></common-icons>
                <text :style="{ color: isVolume ? '#35FFFA' : '#fff' }">音量</text>
              </div>
              <!-- 录像 -->
              <div v-show="!openIntercom" class="intercom-control" @click="openRecordModal">
                <common-icons type="iconvideorecord" size="24" color="#fff"></common-icons>
                <text>录像</text>
              </div>
              <!-- 轮巡 -->
              <div v-show="!page" class="intercom-control" :class="{ 'control-disabled': openIntercom }"
                @click="togglePolling">
                <common-icons type="iconxunhuanbofang" size="24" :color="isPolling ? '#35FFFA' : '#fff'"></common-icons>
                <text :style="{ color: isPolling ? '#35FFFA' : '#fff' }">轮巡</text>
              </div>
              <!-- 挂断 -->
              <div class="intercom-control" :class="{ 'control-disabled': !openIntercom || !hangupState }"
                @click="hangupIntercom()">
                <common-icons type="iconhangup" size="24"
                  :color="openIntercom && hangupState ? '#f33' : '#fff'"></common-icons>
                <text :style="{
                  color: openIntercom && hangupState ? '#f33' : '#fff',
                }">挂断</text>
              </div>
            </div>
          </div>
          <div class="center-content-box">
            <div v-show="openIntercom" class="content-intercom">
              <video ref="localVideo" id="localVideo" autoplay playsinline object-fit="fill" :controls="false"
                codec="sofeware" :enable-progress-gesture="false" :show-center-play-btn="false"></video>
            </div>
            <div v-show="!openIntercom" class="intercom-icon">
              <common-icons type="iconmonitor" size="168" color="#fff"></common-icons>
            </div>
          </div>
        </div>
      </div>
      <div class="intercom-right">
        <div class="intercom-right-title">人员信息</div>
        <div class="right-personel-box">
          <scroll-view class="right-personel-scroll" scroll-y @scrolltolower="scrollToLower">
            <div class="right-info-list">
              <div v-for="(pitem, pindex) in prisonerList" :key="pitem.id">
                <div class="right-info-item" :style="pindex % 2 ? 'margin-left: 16.66upx' : ''">
                  <div class="info-img prisoner-img">
                    <image v-if="loadState" :src="pitem.imgUrl" @load="handleLoadImage"></image>
                    <image v-else src="/static/images/intercom/default.jpg" @load="handleLoadImage"></image>
                  </div>
                  <div class="info-img">
                    <div class="content">
                      名称：<span>{{ pitem.xm }}</span>
                    </div>
                  </div>
                  <div class="info-img">
                    <div class="content">
                      犯号：<span>{{ pitem.pdabh }}</span>
                    </div>
                  </div>
                  <div class="info-img">
                    <div class="content">
                      床位号：<span>{{ pitem.cwh }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
        <div class="right-dynamic-box">
          <scroll-view scroll-y="true" class="right-dynamic-scroll">
            <vtimeLine title="对讲动态信息" :messageList="messageList"></vtimeLine>
          </scroll-view>
        </div>
      </div>
      <div class="intercom-notice" v-if="noticeList.length">
        <div class="notice-content">{{ missCallName }}</div>
        <div class="notice-btn-box">
          <div class="btn-item btn-img" :class="{ 'btn-disabled': disableAnswerBtn }" @click="handleAnswerCall">
            <text>接听</text>
          </div>
          <div class="btn-item btn-img" @click="missCallHandler(0)">
            <text class="btn-refuse">拒绝</text>
          </div>
          <div class="btn-item btn-img" @click="missCallHandler(1)">
            <text class="btn-divert">转移</text>
          </div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <!-- 主机对讲分机弹框 -->
      <neil-modal :show="showTerminalMonitor">
        <div class="monitor-modal-box">
          <div class="monitor-modal-label">
            {{ `确认开启${monitorSelect.name}？` }}
          </div>
          <div class="monitor-modal-btn">
            <div class="cancel-btn" @click="closeModal('TerminalMonitor')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="terminalChatConfirm">
              <span>确认</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 主机对讲主机弹框 -->
      <neil-modal :show="showControlMonitor">
        <div class="monitor-modal-box">
          <div class="monitor-modal-label">
            {{ `确认开启${monitorSelect.name}？` }}
          </div>
          <div class="monitor-modal-btn">
            <div class="cancel-btn" @click="closeModal('ControlMonitor')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="controlChatConfirm">
              <span>确认</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 仓外屏视频通话弹框 -->
      <neil-modal :show="showManageMonitor">
        <div class="monitor-modal-box">
          <div class="monitor-modal-label">
            {{ videoChatLabel }}
          </div>
          <div class="monitor-modal-btn">
            <div class="cancel-btn" @click="closeModal('ManageMonitor')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="managerChatConfirm">
              <span>确认</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 主分机视频通话弹框 -->
      <neil-modal :show="showVideoCallModal">
        <div class="monitor-modal-box">
          <div class="monitor-modal-label">{{ videoChatLabel }}</div>
          <div class="monitor-modal-btn">
            <div class="cancel-btn" @click="closeModal('VideoCallModal')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="videoChatConfirm">
              <span>确认</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 调节音量弹框 -->
      <neil-modal :show="showVolumeModal">
        <div class="volume-modal-box">
          <div class="modal-header">
            <div class="modal-title">音量调节</div>
            <div class="modal-close" @click="closeModal('VolumeModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="modal-horizontal-divider"></div>
          <div class="volume-modal-content">
            <div class="volume-modal-section">
              <div class="volume-text">本机音量</div>
              <common-icons type="iconvolume" size="32" color="#fff"></common-icons>
              <div class="volume-slider">
                <slider :value="controlVolume" min="0" max="100" show-value block-size="46" @change="setControlVolume" />
              </div>
            </div>
            <div class="volume-modal-section">
              <div class="volume-text">分机音量</div>
              <common-icons type="iconvolume" size="32" color="#fff"></common-icons>
              <div class="volume-slider">
                <slider :value="terminalVolume" min="0" max="100" show-value block-size="46"
                  @change="setTerminalVolume" />
              </div>
            </div>
          </div>
          <div class="volume-modal-btn">
            <div class="cancel-btn" @click="closeModal('VolumeModal')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="intercomVolume">
              <span>确认</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 分机离线弹框 -->
      <neil-modal :show="showTerOffline">
        <div class="terminal-modal-container">
          <div class="modal-header">
            <div class="modal-title">温馨提示</div>
            <div class="modal-close" @click="closeModal('TerOffline')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="page-horizontal-divider"></div>
          <div class="terminal-modal-box">
            <common-icons type="iconalarm" size="86" color="#fff"></common-icons>
            <text class="terminal-content">{{ offlineContent }}</text>
          </div>
        </div>
      </neil-modal>
      <!-- 未接来电弹框 -->
      <neil-modal :show="showMissCallModal">
        <div class="misscall-modal-container">
          <div class="modal-header">
            <div class="modal-title">未接来电提醒</div>
            <div class="modal-close" @click="closeModal('MissCallModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="misscall-table-container">
            <div class="misscall-table-box">
              <div class="table-head">
                <div class="misscall-head-item" v-for="(item, index) in missCallColumns" :key="index">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="misscall-table-scroll">
                <div class="misscall-table-main" v-for="(item, index) in missCallList" :key="index">
                  <div class="table-content">
                    <div class="misscall-table-item" style="flex: 1">
                      {{ item.time }}
                    </div>
                    <div class="misscall-table-item" style="flex: 1">
                      {{ item.name }}
                    </div>
                    <div class="misscall-table-item" style="flex: 1">
                      {{ item.type }}
                    </div>
                    <div class="misscall-table-item" style="flex: 1">
                      <div class="misscall-btn-box">
                        <div class="misscall-btn" @click="rejectMissCall(item, index, 1)">
                          忽略
                        </div>
                        <div class="misscall-btn" @click="dialbackMissCall(item, index)">
                          回拨
                        </div>
                      </div>
                    </div>
                  </div>
                  <image class="table-line" src="@/static/images/table/bottom.png"></image>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 录像确认弹框 -->
      <neil-modal :show="showRecordModal">
        <div class="misscall-modal-container">
          <div class="modal-header">
            <div class="modal-title">{{ videoRecordTitle }}</div>
            <div v-if="isPlayRecord" class="button-close" @click="closePlayRecord">
              关闭
            </div>
            <div v-else class="modal-close" @click="closeModal('RecordModal')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div v-if="isPlayRecord" class="record-modal-container">
            <video :src="videoRecordUrl" codec="software" autoplay></video>
          </div>
          <div v-else class="misscall-table-container">
            <div class="record-form-content">
              <div class="record-form-box">
                <div class="form-select">
                  <label>监室号：</label>
                  <input type="text" v-model="recordRoomNo" class="select-input input-img" clearable
                    placeholder="请输入监室号" />
                </div>
                <div class="form-select">
                  <label>录像时间：</label>
                  <e-picker mode="date" class="select-picker picker-img" @change="selectRecordDate"
                    :placeholder="'请选择查询日期'">
                    <span>{{ recordDate }}</span>
                  </e-picker>
                </div>
              </div>
              <div class="form-search-btn btn-img" @click="videoRecordSearch">
                查询
              </div>
            </div>
            <div class="misscall-table-box">
              <div class="table-head">
                <div class="misscall-head-item" v-for="(item, index) in recordColumns" :key="index"
                  :style="{ flex: item.flex }">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view v-if="recordList.length" scroll-y="true" class="misscall-table-scroll">
                <div class="misscall-table-main" v-for="(item, index) in recordList" :key="index">
                  <div class="table-content">
                    <div class="misscall-table-item" style="flex: 1">
                      {{ item.roomNo }}
                    </div>
                    <div class="misscall-table-item" style="flex: 1">
                      {{ item.time }}
                    </div>
                    <div class="misscall-table-item" style="flex: 2">
                      {{ item.name }}
                    </div>
                    <div class="misscall-table-item" style="flex: 1">
                      <div class="misscall-btn-box">
                        <div class="misscall-btn" @click="handlePlayRecord(item)">
                          查看
                        </div>
                      </div>
                    </div>
                  </div>
                  <image class="table-line" src="@/static/images/table/bottom.png"></image>
                </div>
              </scroll-view>
              <div v-else class="record-empty">暂无数据</div>
            </div>
          </div>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import commonIcons from "@/components/common-icons/common-icons.vue";
import vTree from "@/components/v-tree/v-tree.vue";
import ePicker from "@/components/e-picker-intercom/e-picker.vue";
import Api from "@/common/api.js";
import { mapState, mapMutations, mapActions } from "vuex";
import {
  hasKey,
  dateFormat,
  readDirectory,
  uniqueArr,
  currentPages
} from "@/common/utils/util.js";
import { startRtcVideo, stopRtcVideo } from "@/static/js/webrtc.js";
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import monitorList from "@/static/mock/monitorList.json";
import missCallColumns from "@/static/mock/missCallColumns.json";
import recordColumns from "@/static/mock/recordColumns.json";

export default {
  components: {
    vTree,
    commonIcons,
    vtimeLine,
    ePicker,
  },
  data() {
    return {
      // 0分机列表|1主机列表
      page: 0,
      // 分机列表标识
      terminalState: false,
      // 已选分机信息
      checked: {},
      isMute: false, // 是否静音
      isVolume: false, // 调整音量
      monitorList: monitorList, // 底栏状态列表
      // 视频对讲信息
      monitorSelect: {},
      // 视频通话信息
      videoChatObj: {},
      // 视频通话提示文本
      videoChatLabel: "",
      // 对讲播报定时器
      callTimer: null,
      // 监室对讲状态
      intercomState: false,
      // 分机视频对讲弹框
      showTerminalMonitor: false,
      // 仓外屏视频通话弹框
      showManageMonitor: false,
      // 主机视频对讲弹框
      showControlMonitor: false,
      // 主分机视频通话弹框
      showVideoCallModal: false,
      // 人员信息页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
      // 监室人员信息
      prisonerList: [],
      // 人员图片加载状态
      loadState: true,
      // 动态信息
      messageList: [],
      // 搜索分机列表
      searchTerminal: "",
      // 搜索主机列表
      searchControl: "",
      // 分机列表
      terminalList: {},
      // 主机列表
      controlList: {},
      // 分机号
      terminalCode: "",
      // 调节音量弹框
      showVolumeModal: false,
      // 本机音量值
      controlVolume: 20,
      // 分机音量值
      terminalVolume: 20,
      // 操作动态内容
      operateContent: "",
      // 分机离线弹框
      showTerOffline: false,
      // 分机离线提示信息
      offlineContent: "",
      // 禁止重复操作
      isRepeatState: false,
      // 禁止重复操作(挂断)
      isHangupRepeat: false,
      // 未接来电弹框
      showMissCallModal: false,
      // 未接来电表头
      missCallColumns: missCallColumns,
      // 录像弹框
      showRecordModal: false,
      // 对讲录像表头
      recordColumns: recordColumns,
      // 对讲录像列表
      recordList: [],
      // 是否播放录像
      isPlayRecord: false,
      // 录像播放路径
      videoRecordUrl: "",
      // 录像查询监室号
      recordRoomNo: "",
      // 录像查询日期
      recordDate: dateFormat("YYYY-MM-DD", new Date()),
      // 轮巡时间
      pollingTime: uni.getStorageSync("pollingTime") || 60,
      // 轮巡定时器
      timer: null,
      // 已选轮巡监室列表
      roomSelectList: [],
      // 轮巡索引
      pollingIndex: 0,
      // 禁止频繁点击接听
      disableAnswerBtn: false,
      videoNode: null,
    };
  },
  computed: {
    ...mapState({
      // 对讲信息
      intercomInfo: (state) => state.app.intercomInfo,
      // 视频对讲状态
      openIntercom: (state) => state.app.openIntercom,
      // 挂断按钮状态
      hangupState: (state) => state.app.hangupState,
      // 监视监听轮巡状态
      isPolling: (state) => state.app.isPolling,
      // 监室离线状态
      offlineState: (state) => state.app.offlineState,
      // 未接来电列表
      missCallList: (state) => state.app.missCallList,
      // 未接来电状态
      missCallState: (state) => state.app.missCallState,
      // 视频通话列表
      chatList: (state) => state.app.chatList,
      // 应急报警列表
      alarmList: (state) => state.app.alarmList,
      // 未接来电监室名
      missCallName: (state) => state.app.missCallName,
      // 禁止Tab切换
      disableTab: (state) => state.app.disableTab,
    }),
    // 通知栏信息
    noticeList() {
      return this.alarmList.concat(this.chatList);
    },
    // 录像弹框标题
    videoRecordTitle() {
      return this.isPlayRecord ? "查看录像" : "对讲录像";
    },
  },
  created() {
    // 获取分机列表
    this.getTerminalInfo();
    // 获取主机列表
    this.getControlInfo();
    // 获取动态信息
    this.getDynamicInfo();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.hangupIntercom();
  },
  methods: {
    ...mapMutations({
      // 保存对讲信息
      setIntercomInfo: "app/SET_INTERCOMINFO",
      // 设置视频对讲状态
      setOpenIntercom: "app/SET_OPENINTERCOM",
      // 设置挂断按钮状态
      setHangupState: "app/SET_HANGUPSTATE",
      // 设置监视监听轮巡状态
      setIsPolling: "app/SET_ISPOLLING",
      // 设置监视监听状态
      setMonitorState: "app/SET_MONITORSTATE",
      // 设置监室离线状态
      setOfflineState: "app/SET_OFFLINESTATE",
      // 设置对讲弹框状态
      setIsOpenModal: "app/SET_ISOPENMODAL",
      // 设置未接来电数
      setMissCallNum: "app/SET_MISSCALLNUM",
      // 设置未接来电状态
      setMissCallState: "app/SET_MISSCALLSTATE",
      // 删除未接来电列表
      deleteMissCallList: "app/DELETE_MISSCALLLIST",
      // 设置呼叫方状态
      setCallState: "app/SET_CALLSTATE",
      // 设置主机静音
      setMuted: "app/SET_MUTED",
      // 设置禁止Tab切换
      setDisableTab: "app/SET_DISABLETAB",
    }),
    ...mapActions({
      // 新增未接来电信息
      addMissCallInfo: "app/addMissCallInfo",
      // 删除未接来电信息
      deleteMissCall: "app/deleteMissCall",
    }),
    // 获取分机列表
    async getTerminalInfo() {
      const { areaId: id } = uni.getStorageSync("controlInfo");
      let res = await Api.apiCall("get", Api.index.getRoomByAreaId, { id });
      if (res.state.code == 200) {
        let result = [];
        res.data.map((item) => {
          if (!!item) {
            // 清除null数据
            result.push(item);
          }
        });
        this.terminalList = { children: result };
      }
    },
    // 获取主机列表
    async getControlInfo() {
      const { id: controlId } = uni.getStorageSync("controlInfo");
      let res = await Api.apiCall("get", Api.index.getAllControlInfo, {
        controlId,
      });
      if (res.state.code == 200) {
        let result = [];
        res.data.map((item) => {
          if (!!item) {
            // 清除null数据
            result.push(item);
          }
        });
        this.controlList = { children: result };
      }
    },
    // 获取人员信息
    async getPrisonerInfo(index) {
      let params = {
        data: {
          roomId: this.checked.id,
        },
        pageParam: {
          pageIndex: index,
          pageSize: 6,
        },
      };
      let res = await Api.apiCall("post", Api.index.getPrisonerInfo, params);
      if (res.state.code == 200) {
        this.loadState = false;
        if (res.data.length) {
          this.totalPage = res.page.totalPage;
          res.data.map((item) => {
            item.pdabh = (item.dabh && item.dabh.slice(-4)) || "";
          });
          this.prisonerList = this.prisonerList.concat(res.data);
        }
      }
    },
    // 人员图片加载完毕
    handleLoadImage(e) {
      this.loadState = true;
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        this.getPrisonerInfo(this.pageIndex);
      }
    },
    // 获取视频对讲动态信息
    async getDynamicInfo() {
      let params = {
        controlId: uni.getStorageSync("controlInfo").id,
        type: "100",
      };
      let res = await Api.apiCall("get", Api.index.getDynamicInfo, params);
      if (res.state.code == 200) {
        this.messageList = res.data;
      }
    },
    // 新增对讲操作动态
    async setDynamicInfo(type, content) {
      if (content) {
        if (content.includes("挂断") && !this.openIntercom) {
          return;
        }
        let controlId = uni.getStorageSync("controlInfo").id;
        let operationTime = dateFormat("YYYY-MM-DD", new Date());
        let params = {
          type,
          content,
          controlId,
          operationTime,
        };
        let res = await Api.apiCall(
          "post",
          Api.index.saveDynamicInfo,
          JSON.stringify(params)
        );
        if (res.state.code == 200) {
          // 刷新动态信息
          this.getDynamicInfo();
        } else {
          currentPages().handleShowToast("请求错误", "center");
        }
      }
    },
    // 切换主分机列表
    handleTabChange(page) {
      if (this.openIntercom) {
        currentPages().handleShowToast("请先挂断视频", "center", 5000);
        return;
      }
      this.page = page;
      this.$nextTick(() => {
        // 初始化主分机列表
        this.initIntercomData();
      });
      if (this.page == 1) {
        this.pageIndex = 1;
        this.prisonerList = [];
      }
    },
    // 搜索分机监室
    searchTerminalChange(e) {
      this.searchTerminal = e.detail.value;
      if (!this.isPolling) {
        // 初始化分机搜索列表
        uni.$emit("init-select");
      }
    },
    // 搜索分机监室
    searchTerminalRoom() {
      if (!this.searchTerminal) {
        currentPages().handleShowToast("请输入搜索内容", "center");
        return;
      }
      let reg = new RegExp(this.searchTerminal);
      if (this.isPolling) {
        // 搜索轮巡分机列表
        let roomItem = {};
        this.terminalList.children.map((list) => {
          list.children.map((item) => {
            if (reg.test(item.name) && !Object.keys(roomItem).length) {
              list._expand = true;
              item._checked = true;
              roomItem = item;
            }
          });
        });
        this.roomSelectList.push(roomItem);
        this.roomSelectList = uniqueArr(this.roomSelectList, "name");
      } else {
        let roomList = [];
        this.terminalList.children.map((list) => {
          list.children.map((item) => {
            if (reg.test(item.name) && !roomList.length) {
              item._selected = true;
              roomList.push(item);
              return;
            }
          });
        });
        this.terminalSelect(roomList);
      }
    },
    // 搜索主机监室
    searchControlChange(e) {
      this.searchControl = e.detail.value;
      // 初始化主机搜索列表
      uni.$emit("init-select");
    },
    // 搜索主机监室
    searchControlRoom() {
      if (!this.searchControl) {
        currentPages().handleShowToast("请输入搜索内容", "center");
        return;
      }
      let reg = new RegExp(this.searchControl);
      let roomList = [];
      this.controlList.children.map((list) => {
        list.children.map((item) => {
          if (reg.test(item.name) && !roomList.length) {
            item._selected = true;
            roomList.push(item);
            return;
          }
        });
      });
      this.controlSelect(roomList);
    },
    // 选择分机列表
    terminalSelect(item) {
      this.searchTerminal = "";
      this.getCheckedTerminal(item);
    },
    // 选择轮巡分机列表
    terminalCheck(list) {
      this.roomSelectList = list;
    },
    // 选择主机列表
    controlSelect(item) {
      this.searchControl = "";
      this.getCheckedTerminal(item);
    },
    // 选择主分机列表
    getCheckedTerminal(selected) {
      selected.forEach((item) => {
        if (hasKey(item, "children")) {
          this.getCheckedTerminal(item.children);
        } else {
          this.setIntercomInfo(item);
          this.checked = item;
        }
      });
      this.setMissCallState();
      if (!this.missCallState) {
        const { controlCode } = uni.getStorageSync("controlInfo");
        if (this.page == 0) {
          this.terminalDeviceStatus(this.checked.terminalCode, controlCode);
        } else {
          this.controlIntercomState(this.checked.controlCode, controlCode);
        }
      }
    },
    // 获取分机状态
    async terminalDeviceStatus(code, controlCode) {
      let res = await Api.apiCall(
        "get",
        Api.index.terminalDeviceStatus +
        `?code=${code}&controlCode=${controlCode}`,
        null
      );
      if (res.state.code == 200) {
        this.pageIndex = 1;
        this.prisonerList = [];
        if (this.isPolling) {
          if (res.data.status == 1) {
            this.intercomState = false;
            // 获取人员信息
            this.getPrisonerInfo(this.pageIndex);
            this.startPollingModitor();
          } else {
            this.pollingTimer();
          }
        } else {
          res.data.status = 1;
          switch (res.data.status) {
            case 0:
              this.intercomState = true;
              this.getCurTerminal(0, res.data.code);
              break;
            case 1:
              this.intercomState = false;
              // 获取人员信息
              this.getPrisonerInfo(this.pageIndex);
              break;
            case 2:
              this.intercomState = true;
              this.getCurTerminal(2, res.data.code);
              break;
          }
        }
      }
    },
    // 获取主机状态
    async controlIntercomState(controlCode, mainControlCode) {
      let res = await Api.apiCall(
        "get",
        Api.index.getControlIntercomState +
        `?controlCode=${controlCode}&mainControlCode=${mainControlCode}`,
        null
      );
      if (res.state.code == 200) {
        switch (res.data.status) {
          case 0:
            this.intercomState = true;
            this.getCurControl(0, res.data.code);
            break;
          case 1:
            this.intercomState = false;
            break;
          case 2:
            this.intercomState = true;
            this.getCurControl(2, res.data.code);
            break;
        }
      }
    },
    // 分机列表查询
    getCurTerminal(type, code) {
      this.terminalList.children.forEach((list) => {
        list.children.forEach((item) => {
          if (code == item.terminalCode) {
            this.getRootState(type, item);
          }
        });
      });
    },
    // 主机列表查询
    getCurControl(type, code) {
      this.controlList.children.map((list) => {
        list.children.map((item) => {
          if (code == item.controlCode) {
            this.getRootState(type, item);
          }
        });
      });
    },
    // 主分机列表查询
    getRootState(type, item) {
      switch (type) {
        case 0:
          this.offlineContent = `${item.name}已离线！`;
          break;
        case 2:
          this.offlineContent = `${item.name}对讲中！`;
          break;
      }
      this.setOfflineState(true);
      this.showTerOffline = true;
    },
    // 选择主分机视频对讲
    monitorControl(obj) {
      if (this.isPolling) {
        if (!this.roomSelectList.length) {
          currentPages().handleShowToast("请先选择监室", "center");
          return;
        }
      } else {
        if (!Object.keys(this.checked).length) {
          currentPages().handleShowToast("请先选择监室", "center");
          return;
        }
      }
      if (this.openIntercom) {
        currentPages().handleShowToast("请先挂断视频", "center", 5000);
        return;
      }
      this.monitorSelect = obj;
      this.setIsOpenModal(true);
      if (this.page == 0) {
        this.showTerminalMonitor = true;
      } else {
        this.showControlMonitor = true;
      }
    },
    // 视频通话请求
    videoChatModal(info) {
      this.isRepeatState = false;
      switch (info.type) {
        // 视频通话
        case this.$config.controlType.INTERCOM:
          if (Reflect.has(info, "extend")) {
            // 仓外屏视频通话
            let extend = JSON.parse(info.extend);
            this.checked = {
              name: extend.roomName,
              devno: info.devno,
              terminalCode: info.devno,
              masterSipAccount: extend.masterSipAccount,
              sipAccount: extend.sipAccount,
              managerType: true,
            };
            this.setIntercomInfo(this.checked);
            this.manageVideoChat();
          } else {
            if (info.devno.startsWith("terminal")) {
              // 仓内屏视频通话
              if (
                this.monitorSelect.id == "1" &&
                this.checked.terminalCode == info.devno &&
                this.openIntercom
              ) {
                return;
              }
              // 分机视频通话，设置未接来电信息
              let callInfo = {};
              this.terminalList.children.forEach((list) => {
                list.children.forEach((item) => {
                  if (info.devno == item.terminalCode) {
                    callInfo = info;
                    callInfo.name = item.name;
                  }
                });
              });
              this.setMissCallState();
              if (this.missCallState) {
                // 对讲状态，保存信息
                this.addMissCallInfo(callInfo);
              } else {
                // 空闲状态，拨通对讲
                this.page = 0;
                this.setIntercomInfo(callInfo);
                this.handleVideoChat();
              }
            } else {
              // 主机视频通话
              this.page = 1;
              this.setIntercomInfo(info);
              this.handleVideoChat();
            }
          }
          break;
        // 应急报警
        case this.$config.controlType.ALARM:
          this.page = 0;
          this.videoChatObj = {
            id: "1",
            type: "videochat",
            name: "视频通话",
          };
          this.setIntercomInfo(info);
          this.videoChatConfirm();
          break;
      }
    },
    // 仓外屏视频通话请求
    manageVideoChat() {
      this.startCallTimer(`${this.checked.name}发起视频通话请求`);
      this.videoChatLabel = `${this.checked.name}发起视频通话请求`;
      let alarmObj = {
        id: "1",
        type: "videochat",
        name: "视频通话",
      };
      this.monitorSelect = alarmObj;
      this.setIsOpenModal(true);
      this.setDisableTab(true);
      this.showManageMonitor = true;
    },
    // 主分机视频通话请求
    handleVideoChat() {
      this.setIsOpenModal(true);
      if (this.page == 0) {
        // 分机视频通话
        this.terminalList.children.forEach((list) => {
          list.children.forEach((item) => {
            if (this.intercomInfo.devno == item.terminalCode) {
              this.startCallTimer(`${item.name}发起视频通话请求`);
              this.videoChatObj = {
                id: "1",
                type: "videochat",
                name: "视频通话",
              };
              this.videoChatLabel = `${item.name}发起视频通话请求`;
            }
          });
        });
      } else {
        // 主机视频通话
        this.controlList.children.map((list) => {
          list.children.map((item) => {
            if (this.intercomInfo.devno == item.controlCode) {
              this.startCallTimer(`${item.name}发起视频通话请求`);
              this.videoChatObj = {
                id: "1",
                type: "videochat",
                name: "视频通话",
              };
              this.videoChatLabel = `${item.name}发起视频通话请求`;
            }
          });
        });
      }
      this.setDisableTab(true);
      this.showVideoCallModal = true;
    },
    // 主分机|应急报警视频通话
    async videoChatConfirm() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1000);
        // 初始化主分机列表
        uni.$emit("init-select");
        // getApp().globalData.Base.speechStop();
        let roomList = [];
        this.monitorSelect = this.videoChatObj;
        this.setIsOpenModal(false);
        this.showVideoCallModal = false;
        if (this.page == 0) {
          this.terminalList.children.map((list) => {
            list.children.map((item) => {
              if (this.intercomInfo.devno == item.terminalCode) {
                item._selected = true;
                roomList.push(item);
              }
            });
          });
          await this.terminalSelect(roomList);
        } else {
          this.controlList.children.map((list) => {
            list.children.map((item) => {
              if (this.intercomInfo.devno == item.controlCode) {
                item._selected = true;
                roomList.push(item);
              }
            });
          });
          await this.controlSelect(roomList);
        }
        await this.handleIntercomComfirn();
        this.disableAnswerBtn = false;
      }
    },
    // 对讲状态处理
    handleIntercomComfirn() {
      if (this.intercomState) {
        // 离线|对讲状态
        this.clearCallTimer();
        this.showIntercom();
        if (this.page == 0) {
          // 拦截分机视频通话
          this.cancelTerminalChat(1);
        } else {
          // 拦截主机视频通话
          this.cancelControlChat(1);
        }
      } else {
        // 空闲状态
        this.handleCheckMonitor();
      }
    },
    // 开启分机视频对讲
    terminalChatConfirm() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1000);
        this.page = 0;
        if (this.isPolling) {
          this.startPolling();
        } else {
          this.handleCheckMonitor();
        }
      }
    },
    // 开始主机视频对讲请求
    controlChatConfirm() {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1000);
        // 视频对讲已打开
        this.setIsOpenModal(false);
        this.showControlMonitor = false;
        currentPages().voiceBroadcast("正在发起视频通话");
        const { controlCode } = uni.getStorageSync("controlInfo");
        currentPages().sendWebsocket(
          `{maindevno:"${this.checked.controlCode}",devno:"${controlCode}",type:"100",msg:"16"}`
        );
      }
    },
    // 开启仓外屏视频对讲
    managerChatConfirm() {
      this.setMissCallState();
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1000);
        this.setDisableTab(true);
        this.page = 0;
        this.handleCheckMonitor();
      }
    },
    // 监视监听轮巡
    togglePolling() {
      this.setIsPolling(!this.isPolling);
      this.initIntercomData();
      this.initPollingData();
    },
    // 开启轮巡
    startPolling() {
      this.pollingIndex = 0;
      this.setDynamicInfo("100", "开始监视监听轮巡");
      this.pollingTimer();
    },
    // 轮巡定时器
    pollingTimer() {
      clearTimeout(this.timer);
      if (this.pollingIndex <= this.roomSelectList.length - 1) {
        this.checked = this.roomSelectList[this.pollingIndex];
        this.pollingIndex++;
        this.setIntercomInfo(this.checked);
        const { controlCode } = uni.getStorageSync("controlInfo");
        this.terminalDeviceStatus(this.checked.terminalCode, controlCode);
        this.timer = setTimeout(() => {
          this.hangupMonitor().then(() => {
            this.pollingTimer();
          });
        }, this.pollingTime * 1000);
      } else {
        this.stopMonitor();
      }
    },
    // 开始监视监听轮巡
    startPollingModitor() {
      this.closeVideoModel();
      if (!this.offlineState) {
        let masterNum = this.checked.masterSipAccount;
        let slaveNum = this.checked.sipAccount;
        this.setCallState(false);
        this.setMonitorState(true);
        console.log("开始轮巡：", 0, masterNum, slaveNum, 0);
        getApp().globalData.FloatUniModule.deviceClick(
          0,
          masterNum,
          slaveNum,
          0
        );
        this.setHangupState(true);
      }
    },
    // 挂断监视监听轮巡
    async hangupMonitor() {
      let masterNum = this.checked.masterSipAccount;
      let slaveNum = this.checked.sipAccount;
      this.setMonitorState(false);
      this.setCallState(false);
      this.setOpenIntercom(false);
      console.log("挂断轮巡：", 0, masterNum, slaveNum, 0);
      await getApp().globalData.FloatUniModule.nativeHangup(
        0,
        masterNum,
        slaveNum,
        0
      );
    },
    // 停止监视监听轮巡
    stopMonitor() {
      this.setDisableTab(false);
      this.setIsPolling(false);
      clearTimeout(this.timer);
      this.closeVideoModel(true);
      this.initPollingData();
      this.setDynamicInfo("100", "停止监视监听轮巡");
    },
    // 开启视频对讲
    handleCheckMonitor() {
      this.closeVideoModel();
      if (!this.offlineState) {
        this.getRadioStatusInfo("200");
        this.setDisableTab(true);
        let textType = this.monitorSelect.id == "0" ? "监视监听" : "视频对讲";
        this.operateContent = `开启${this.checked.name}${textType}`;
        const { controlCode } = uni.getStorageSync("controlInfo");
        this.setOpenIntercom(true);
        this.setHangupState(true);
        this.videoNode = this.$refs.localVideo.$refs.video;
        switch (this.monitorSelect.id) {
          // 监视监听
          case "0":
            this.setCallState(false);
            startRtcVideo(this.videoNode, controlCode, this.checked.terminalCode, 0);
            break;
          // 视频对讲
          case "1":
            this.setCallState(true);
            startRtcVideo(this.videoNode, controlCode, this.checked.terminalCode, 1);
            break;
        }
        setTimeout(() => {
          if (!this.openIntercom) {
            this.setDisableTab(false);
          }
        }, 3000);
      }
    },
    // 挂断视频对讲
    async hangupIntercom(cb) {
      if (!this.isHangupRepeat) {
        this.isHangupRepeat = true;
        setTimeout(() => {
          this.isHangupRepeat = false;
        }, 3000);
        if (this.openIntercom || this.disableTab) {
          if (this.isPolling) {
            await this.hangupMonitor().then(() => {
              this.stopMonitor();
            });
          } else {

            switch (this.monitorSelect.id) {
              // 挂断监视监听
              case "0":
                this.setMonitorState(false);
                this.setCallState(false);
                this.operateContent = `停止${this.checked.name}监视监听`;
                stopRtcVideo();
                break;
              // 挂断视频对讲
              case "1":
                const { controlCode } = uni.getStorageSync("controlInfo");
                this.operateContent = `挂断${this.checked.name}视频对讲`;
                if (this.page == 0) {
                  // 挂断分机|仓外屏
                  currentPages().sendWebsocket(
                    `{maindevno:"${controlCode}",devno:"${this.checked.terminalCode}",type:"100",msg:"1"}`
                  );
                  stopRtcVideo();
                } else {
                  // 挂断主机
                  currentPages().sendWebsocket(
                    `{maindevno:"${controlCode}",devno:"${this.checked.controlCode}",type:"100",msg:"26"}`, () => {
                      console.log("挂断主机：", 0, masterNum, slaveNum, 0);
                      getApp().globalData.FloatUniModule.nativeHangup(
                        0,
                        masterNum,
                        slaveNum,
                        0
                      );
                    }
                  );
                }
                break;
            }
            await this.stopIntercomHandler();
          }
          this.setCallState(false);
          this.setHangupState(false);
          this.setDisableTab(false);
          await cb && cb();
        }
      }
    },
    // 挂断视频通话处理
    stopIntercomHandler() {
      // currentPages().voiceBroadcast("对讲已挂断");
      this.clearCallTimer();
      this.hangupDinamicInfo(true);
      this.setOpenIntercom(false);
    },
    // 挂断视频对讲动态
    hangupDinamicInfo(state) {
      if (state) {
        this.setDynamicInfo("100", this.operateContent);
      }
      this.isMute = false;
      this.isVolume = false;
    },
    // 取消分机视频通话
    cancelTerminalChat(type) {
      this.isRepeatState = false;
      this.setOpenIntercom(false);
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = "";
      if (type) {
        // 拦截分机视频通话
        terminalCode = this.intercomInfo.terminalCode;
      } else {
        // 取消分机视频通话
        terminalCode = this.intercomInfo.devno;
      }
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"6"}`
      );
      this.terminalList.children.forEach((list) => {
        list.children.forEach((item) => {
          if (terminalCode == item.terminalCode) {
            this.setDynamicInfo("100", `取消${this.intercomInfo.name}视频对讲`);
            let masterNum = item.masterSipAccount;
            let slaveNum = item.sipAccount;
            console.log("取消分机对讲：", 0, masterNum, slaveNum, 0);
            getApp().globalData.FloatUniModule.nativeHangup(
              0,
              masterNum,
              slaveNum,
              0
            );
          }
        });
      });
    },
    // 取消主机视频通话
    cancelControlChat(type) {
      this.isRepeatState = false;
      this.setOpenIntercom(false);
      const { controlCode, controlName } = uni.getStorageSync("controlInfo");
      let terminalCode = "";
      if (type) {
        // 拦截主机视频通话
        terminalCode = this.intercomInfo.terminalCode;
      } else {
        // 取消主机视频通话
        terminalCode = this.intercomInfo.devno;
      }
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"6",extend:"${controlName}"}`
      );
      this.controlList.children.map((list) => {
        list.children.map((item) => {
          if (terminalCode == item.controlCode) {
            this.setDynamicInfo("100", `取消${item.name}视频对讲`);
          }
        });
      });
    },
    // 获取广播播放状态信息
    async getRadioStatusInfo(type) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        type,
        controlCode,
      };
      let res = await Api.apiCall("get", Api.index.getMediaStatusInfo, params);
      if (res.state.code == 200) {
        const { status, roomList } = res.data;
        if (status == "start") {
          this.setMuted(false);
          let terminalCode = roomList.map((item) => item.terminalCode);
          let terminalName = roomList.map((item) => item.name);
          currentPages().sendWebsocket(
            `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"200",msg:"1"}`
          );
          this.setDynamicInfo("200", `停止${terminalName}广播`);
          this.saveRadioPlayStatus(controlCode, "stop");
        }
      }
    },
    // 保存广播播放状态
    async saveRadioPlayStatus(controlCode, status) {
      let params = {
        data: {
          controlCode,
          type: "200",
          status,
        },
      };
      params.data.endTime = dateFormat("YYYY-MM-DD hh:mm", new Date());
      let res = await Api.apiCall(
        "post",
        Api.index.saveMediaPlayStatus,
        params
      );
      if (res.state.code == 200) {
        currentPages().handleShowToast("保存状态成功", "bottom");
      }
    },
    // 关闭对讲语音播报定时器
    clearCallTimer() {
      // getApp().globalData.Base.speechStop();
      clearInterval(this.callTimer);
    },
    // 开启对讲播报定时器
    startCallTimer(content) {
      currentPages().voiceBroadcast(content);
      this.callTimer = setInterval(() => {
        currentPages().voiceBroadcast(content);
      }, 5000);
    },
    // 关闭视频通话弹框
    closeVideoModel(bool = false) {
      // 关闭对讲播报定时器
      this.clearCallTimer();
      this.showTerminalMonitor = false;
      this.showControlMonitor = false;
      this.showManageMonitor = false;
      this.showVideoCallModal = false;
      this.showTerOffline = false;
      this.setOfflineState(false);
      this.setCallState(false);
      this.setIsOpenModal(false);
      if (bool) {
        this.setOpenIntercom(false);
      }
    },
    // 关闭视频对讲弹框
    closeIntercomModal() {
      this.showTerminalMonitor = false;
      this.showControlMonitor = false;
      this.showVolumeInit = false;
      this.showMissCallModal = false;
      this.showRecordModal = false;
      this.showTerOffline = false;
      this.setOfflineState(false);
      this.showIntercom();
    },
    // 接听未接来电
    handleAnswerCall() {
      if (this.openIntercom) {
        if (this.isPolling) {
          this.hangupMonitor().then(() => {
            this.stopMonitor();
          });
          this.answerCallHandler();
        } else {
          currentPages().handleShowToast("请先挂断当前对讲", "center");
        }
      } else {
        if (!currentPages().isAlarmRepeat && !this.isHangupRepeat && !this.isRepeatState) {
          this.answerCallHandler();
        }
      }
    },
    // 未接来电处理
    answerCallHandler() {
      if (this.noticeList.length) {
        this.disableAnswerBtn = true;
        this.setDisableTab(true);
        this.isRepeatState = false;
        if (this.alarmList.length) {
          const { controlCode } = uni.getStorageSync("controlInfo");
          currentPages().sendWebsocket(
            `{maindevno:"${controlCode}",devno:"${this.alarmList[0].devno}",type:"500",msg:"5"}`
          );
        }
        this.videoChatObj = {
          id: "1",
          type: "videochat",
          name: "视频通话",
        };
        this.page = 0;
        this.setIntercomInfo(this.noticeList[0]);
        this.deleteMissCall();
        this.videoChatConfirm();
      } else {
        this.disableAnswerBtn = false;
      }
    },
    // 处理拒绝|转移未接来电
    missCallHandler(type) {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1000);
        const { controlCode } = uni.getStorageSync("controlInfo");
        let terminalCode = "";
        let terminalName = "";
        if (this.alarmList.length) {
          terminalCode = this.alarmList[0].devno;
          if (type == 0) {
            // 拒绝未接来电
            terminalName = this.alarmList[0].name;
            currentPages().sendWebsocket(
              `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"500",msg:"2"}`
            );
            this.setDynamicInfo("500", `取消${terminalName}应急报警`);
          } else {
            // 转移未接来电
            let extend = JSON.parse(this.alarmList[0].extend);
            currentPages().sendWebsocket(
              `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"500",msg:"6",extend:{'roomName':'${extend.roomName}', 'alarmId':'${extend.alarmId}'}}`
            );
          }
          this.deleteMissCall();
        }
        if (this.chatList.length) {
          terminalCode = this.chatList[0].devno;
          if (type == 0) {
            // 拒绝未接来电
            terminalName = this.chatList[0].name;
            currentPages().sendWebsocket(
              `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"6"}`
            );
            this.setDynamicInfo("100", `取消${terminalName}视频对讲`);
          } else {
            // 转移未接来电
            currentPages().sendWebsocket(
              `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"14"}`
            );
          }
          this.deleteMissCall();
        }
        // 挂断拒绝|转移未接来电
        this.hangupMissCall(terminalCode);
        if (!this.chatList.length &&
          !this.alarmList.length &&
          !this.openIntercom) {
          this.setDisableTab(false);
        }
      }
    },
    // 挂断拒绝|转移未接来电
    hangupMissCall(terminalCode) {
      this.terminalList.children.forEach((list) => {
        list.children.forEach((item) => {
          if (terminalCode == item.terminalCode) {
            let masterNum = item.masterSipAccount;
            let slaveNum = item.sipAccount;
            console.log("拒绝/转移：", 0, masterNum, slaveNum, 0);
            getApp().globalData.FloatUniModule.nativeHangup(
              0,
              masterNum,
              slaveNum,
              0
            );
          }
        });
      });
    },
    // 打开未接来电弹框
    toggleMissCallModal() {
      this.hideIntercom();
      this.openModal("MissCallModal");
    },
    // 回拨未接来电
    dialbackMissCall(item, index) {
      if (this.openIntercom) {
        if (this.isPolling) {
          this.hangupMonitor().then(() => {
            this.stopMonitor();
          });
          this.callBackHandler(item, index);
        } else {
          currentPages().handleShowToast("请先挂断当前对讲", "center");
        }
      } else {
        if (!currentPages().isAlarmRepeat && !this.isHangupRepeat && !this.isRepeatState) {
          this.callBackHandler(item, index);
        }
      }
    },
    // 回拨处理方法
    async callBackHandler(info, index) {
      this.setIntercomInfo(info);
      this.videoChatObj = {
        id: "1",
        type: "videochat",
        name: "视频通话",
      };
      this.setDisableTab(true);
      this.isRepeatState = false;
      if (info.devno.includes("terminal")) {
        this.page = 0;
        await this.videoChatConfirm();
      } else {
        this.page = 1;
        let roomList = [];
        this.controlList.children.map((list) => {
          list.children.map((item) => {
            if (item.controlCode == this.intercomInfo.devno) {
              item._selected = true;
              roomList.push(item);
            }
          });
        });
        this.monitorSelect = this.videoChatObj;
        await this.controlSelect(roomList);
        await this.controlChatConfirm();
      }
      this.rejectMissCall(info, index, 2);
    },
    // 忽略未接来电
    rejectMissCall(item, index, status) {
      let params = {
        data: {
          id: item.id,
          status,
        },
      };
      this.updateMissCallInfo(params, index);
    },
    // 更新忽略|回拨数据
    async updateMissCallInfo(params, index) {
      let res = await Api.apiCall("post", Api.index.updateMissCallInfo, params);
      if (res.state.code == 200) {
        this.deleteMissCallList(index);
        this.setMissCallNum(this.missCallList.length);
        if (!this.missCallList.length) {
          this.closeModal("MissCallModal");
        }
      }
    },
    // 设置对讲静音
    handleVideoMute() {
      this.isMute = !this.isMute;
      if (this.isMute) {
        // 开启静音
        getApp().globalData.FloatUniModule.setExtMicEna(false);
      } else {
        // 关闭静音
        getApp().globalData.FloatUniModule.setExtMicEna(true);
      }
    },
    // 设置本机音量进度条
    setControlVolume(e) {
      this.controlVolume = e.detail.value;
    },
    // 设置分机音量进度条
    setTerminalVolume(e) {
      this.terminalVolume = e.detail.value;
    },
    // 音量调节弹框
    volumeControl() {
      this.isVolume = true;
      // 获取本地音量
      getApp().globalData.FloatUniModule.getStreamVolumeTypeVoiceCall((e) => {
        this.controlVolume = e.value;
      });
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = "";
      if (Reflect.has(this.checked, "controlCode")) {
        // 获取主机音量
        terminalCode = this.checked.controlCode;
      } else {
        // 获取分机音量
        terminalCode = this.checked.terminalCode;
      }
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"100",msg:"8",extend:""}`
      );
      // 隐藏视频画面
      this.hideIntercom();
      this.openModal("VolumeModal");
    },
    // 确认音量调节
    intercomVolume() {
      // 本机对讲音量调节
      getApp().globalData.FloatUniModule.setStreamVolumeTypeVoiceCall(
        Number(this.controlVolume)
      );
      // 分机音量调节
      if (Object.keys(currentPages().terminalInfo).length) {
        const { maindevno, devno } = currentPages().terminalInfo;
        currentPages().sendWebsocket(
          `{maindevno:"${maindevno}",devno:"${devno}",type:"100",msg:"8",extend:"${this.terminalVolume}"}`
        );
        this.closeModal("VolumeModal");
      }
    },
    // 打开录像弹框
    openRecordModal() {
      this.recordRoomNo = "";
      this.recordDate = dateFormat("YYYY-MM-DD", new Date());
      this.videoRecordSearch();
    },
    // 选择录像查询日期
    selectRecordDate(e) {
      this.recordDate = e;
    },
    // 查询录像记录
    videoRecordSearch() {
      this.recordList = [];
      let date = dateFormat("YYYYMMDD", new Date(this.recordDate));
      let dirPath = `/storage/1AB6-BDFF/Rec/${date}/`;
      this.openModal("RecordModal");
      readDirectory(dirPath).then(
        (res) => {
          if (res.length) {
            this.videoRecordHandler(res);
          } else {
            this.getVideoRecordInfo(date);
          }
        },
        (err) => {
          this.getVideoRecordInfo(date);
        }
      );
    },
    // 查询服务器录像记录
    async getVideoRecordInfo(date) {
      const { sipAccount } = uni.getStorageSync("controlInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getIntercomRecord +
        `?dateString=${date}&masterNumber=${sipAccount}`,
        null
      );
      if (res.state.code == 200) {
        if (res.data.length) {
          this.videoRecordHandler(res.data);
        }
      }
    },
    // 查询录像记录数据处理
    videoRecordHandler(res) {
      let list = [];
      res.forEach((item) => {
        let record = item.name.slice(0, item.name.indexOf(".")).split("_");
        let roomNo = parseInt(record[1].slice(3));
        let date1 = record[3].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        let date2 = record[4].replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
        let time = `${date1} ${date2}`;
        let name = item.name;
        let path = item.fullPath;
        list.push({ roomNo, time, name, path });
      });
      list.sort((a, b) => {
        return b.time.localeCompare(a.time);
      });
      this.recordList = list;
      if (!!this.recordRoomNo) {
        this.recordList = this.recordList.filter(
          (item) => item.roomNo == parseInt(this.recordRoomNo)
        );
      }
    },
    // 查看录像
    handlePlayRecord(item) {
      this.videoRecordUrl = item.path;
      this.isPlayRecord = true;
    },
    // 关闭录像
    closePlayRecord() {
      this.videoRecordUrl = "";
      this.isPlayRecord = false;
    },
    // 初始化主分机列表
    initIntercomData() {
      uni.$emit("init-select");
      this.checked = {};
      this.monitorSelect = {};
    },
    // 初始化轮巡分机列表
    initPollingData() {
      this.pollingIndex = 0;
      this.roomSelectList = [];
      this.terminalList.children.map((list) => {
        list._checked = false;
        list.children.map((item) => {
          item._checked = false;
        });
      });
    },
    // 显示视频画面
    showIntercom() {
      if (this.openIntercom) {
        getApp().globalData.FloatUniModule.setTalkViewPosition(
          364,
          178,
          1156,
          760
        );
      }
    },
    // 隐藏视频画面
    hideIntercom() {
      if (this.openIntercom) {
        getApp().globalData.FloatUniModule.setTalkViewPosition(364, 178, 1, 1);
      }
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
      // 取消主分机视频对讲|主分机视频通话|仓外屏视频通话
      if (["ControlMonitor", "TerminalMonitor", "VideoCallModal", "ManageMonitor"].includes(type)) {
        this.setIsOpenModal(false);
        if (!this.chatList.length &&
          !this.alarmList.length &&
          !this.openIntercom) {
          this.setDisableTab(false);
        }
      }
      // 取消主分机视频通话
      if (type == "VideoCallModal") {
        // 关闭对讲播报定时器
        this.clearCallTimer();
        if (this.page == 0) {
          // 取消分机视频通话
          this.cancelTerminalChat(0);
        } else {
          // 取消主机视频通话
          this.cancelControlChat(0);
        }
      }
      // 取消仓外屏视频通话
      if (type == "ManageMonitor") {
        // 关闭对讲播报定时器
        this.clearCallTimer();
        const { controlCode } = uni.getStorageSync("controlInfo");
        let managerCode = this.intercomInfo.terminalCode;
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${managerCode}",type:"100",msg:"6"}`
        );
        this.setDynamicInfo("100", `取消${this.intercomInfo.name}视频对讲`);
      }
      if (type == "VolumeModal") {
        // 调节分机音量
        this.isVolume = false;
      }
      if (type == "RecordModal") {
        // 录像弹框
        this.recordList = [];
      }
      if (type == "TerOffline") {
        // 初始化主机列表
        this.setOfflineState(false);
      }
      if (
        [
          "VideoCallModal",
          "MissCallModal",
          "VolumeModal",
          "RecordModal",
          "TerOffline",
        ].includes(type)
      ) {
        this.showIntercom();
      }
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
