<template>
  <div class="manager-container">
    <div class="manager-wrapper">
      <div class="manager-left">
        <div class="manager-left-box">
          <div class="left-tab">
            <div :class="page == 0 ? 'tab-active' : 'tab'" @click="handleTabChange(0)">
              分机列表
            </div>
            <div :class="page == 1 ? 'tab-active' : 'tab'" @click="handleTabChange(1)">
              分组列表
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
                  <v-tree showCheckbox :root="terminalList" :changeHandler="terminalSelect"></v-tree>
                </scroll-view>
              </div>
            </div>
            <div v-if="page == 1" class="groups-list">
              <div class="terminal-search rectangle-img">
                <input class="input-search" v-model="searchGroup" @input="searchGroupChange" />
                <div class="search-btn" @click="searchGroupRoom">
                  <common-icons type="iconsearch" color="#fff" size="20"></common-icons>
                </div>
              </div>
              <div class="terminal-room-box">
                <scroll-view scroll-y="true">
                  <v-tree ref="vTree" showCheckbox :showGroup="true" :root="groupList" :changeHandler="groupSelect"
                    @group-change="openModifyGroup" @group-delete="openDeleteGroup"></v-tree>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="manager-center">
        <div class="manager-center-head">
          <div class="center-head-box">
            <div class="head-tabs" v-for="item in managerList" :key="item.index">
              <div :class="currentPage == item.index
                ? 'tab-active bottom-tab-active'
                : 'tab'
                " @click="handlePageChange(item.index)">
                <common-icons :type="item.type" :color="currentPage == item.index ? '#35fffa' : '#fff'"
                  size="24"></common-icons>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="manager-center-table">
          <div class="manager-center-content">
            <div class="center-btn-box">
              <div class="center-btn-left">
                <div class="btn-left" :class="isAudioAll ? 'btn-active-img' : 'btn-img'" @click="handleSelectAll">
                  <text>全选</text>
                </div>
                <div v-if="currentPage !== 2" class="btn-left btn-img" @click="handleAddGroup(true)">
                  <text>{{ currentPage >= 5 ? "一键读取" : "一键开启" }}</text>
                </div>
                <div class="btn-left btn-img" @click="handleAddGroup(false)">
                  <text>{{ currentPage >= 5 ? "一键上传" : "一键关闭" }}</text>
                </div>
                <div v-if="currentPage === 0" class="btn-left btn-img" @click="openModifyGroup">
                  <text>{{ "一键布防" }}</text>
                </div>
                <div v-if="currentPage === 0" class="btn-left btn-img" @click="closeModifyGroup">
                  <text>{{ "一键撤防" }}</text>
                </div>
              </div>
              <div class="center-btn-right" style="font-size: 18upx" @click="showAlarmModal">
                已选中：<text style="color: #21cdc5; font-size: 18upx">{{
                  selectSongNum
                }}</text>
              </div>
            </div>
            <div class="center-table-container">
              <div>
                <div class="manager-table-box">
                  <div class="table-head">
                    <div class="head-checkbox" @click="checkAudioAll">
                      <common-icons :type="isAudioAll ? 'iconcheckbox' : 'iconcheck-unselect'
                        " color="#2A4273" size="24"></common-icons>
                    </div>
                    <div class="manager-head-item" v-for="(item, index) in columns" :key="index">
                      {{ item.title }}
                    </div>
                  </div>
                  <scroll-view scroll-y="true" class="manager-table-scroll">
                    <div class="manager-table-main" v-for="(item, index) in audioTableList" :key="index">
                      <div class="table-content">
                        <div class="content-checkbox" @click="checkAudioChange(item, index)">
                          <common-icons :type="item.isSelectAudio
                            ? 'iconcheckbox'
                            : 'iconcheck-unselect'
                            " color="#2A4273" size="24"></common-icons>
                        </div>
                        <div class="manager-table-item" style="flex: 1">
                          {{ item.site }}
                        </div>
                        <div class="manager-table-item" style="flex: 1"
                          :class="{ red: currentPage === 2 && item.status }">
                          {{
                            currentPage > 4
                            ? item.status
                              ? "在线"
                              : "离线"
                            : item.status
                              ? currentPage === 2
                                ? "报警中"
                                : "已开启"
                              : "已关闭"
                          }}
                        </div>
                        <template v-if="currentPage === 0">
                          <div class="manager-table-item" style="flex: 1">
                            {{ item.startTime || "-" }}
                          </div>
                          <div class="manager-table-item" style="flex: 1">
                            {{ item.endTime || "-" }}
                          </div>
                        </template>
                        <template v-if="currentPage === 5">
                          <div class="manager-table-item" style="flex: 1">
                            {{ item.tem }}℃
                          </div>
                          <div class="manager-table-item" style="flex: 1">
                            {{ item.hum }}%
                          </div>
                        </template>
                        <template v-if="currentPage > 5">
                          <div class="manager-table-item" style="flex: 1">
                            {{ item.value }}{{ currentPage === 6 ? "kWh" : "m³" }}
                          </div>
                        </template>
                        <div class="manager-table-item" style="flex: 1">
                          <common-icons v-if="currentPage <= 4" :type="type" :color="item.status
                            ? currentPage === 2
                              ? 'red'
                              : '#21cdc5'
                            : '#ccc'
                            " size="24" @click="handleItemChange(item, !item.status)"></common-icons>
                          <template v-else>
                            <button type="primary" style="margin-left: 5upx; margin-right: 5upx"
                              @click="readingDate(index)">
                              读取
                            </button>
                            <button type="primary" style="margin-left: 5upx; margin-right: 5upx"
                              @click="handleItemChange">
                              上传
                            </button>
                          </template>
                        </div>
                      </div>
                      <image class="table-line" src="@/static/images/table/bottom.png"></image>
                    </div>
                  </scroll-view>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="manager-right" @click="changeStatus">
        <div class="manager-right-title">人员信息</div>
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
                      犯号：<span>{{ pitem.dabh.slice(-4) }}</span>
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
    </div>
    <div class="neil-modal-container">
      <!-- 音频确认弹框 -->
      <neil-modal :show="showAudioConfirm" @close="closeModal('AudioConfirm')">
        <div class="manager-modal-container">
          <div class="neil-modal-label">
            确认{{ audioState ? "关闭" : "播放" }}音频？
          </div>
          <div class="neil-modal-btn">
            <div class="cancel-btn" @click="closeModal('AudioConfirm')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="handleOpenAudio">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 添加分组弹框 -->
      <neil-modal :show="showAddGroup" @close="closeModal('AddGroup')">
        <div class="manager-modal-container" style="width: 480upx; height: 320upx">
          <div class="neil-modal-label">
            确认{{
              currentPage > 4
              ? isRead
                ? "读取"
                : "上传"
              : addGroupName
                ? "开启"
                : "关闭"
            }}？
          </div>
          <div class="neil-modal-btn">
            <div class="cancel-btn" @click="closeModal('AddGroup')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="addGroupConfirm">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 修改分组弹框 -->
      <neil-modal :show="showModifyGroup" @close="closeModal('ModifyGroup')">
        <div class="manager-modal-container">
          <view class="modal-header">
            <view class="modal-title">布防设置</view>
            <div class="modal-close" @click="closeModal('ModifyGroup')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="group-name-box" style="margin-top: 15upx">
            <checkbox-group @change="weekChange">
              <label class="group-modal-label">
                <checkbox value="一" color="#fff" />周一
              </label>
              <label class="group-modal-label">
                <checkbox value="二" color="#fff" />周二
              </label>
              <label class="group-modal-label">
                <checkbox value="三" color="#fff" />周三
              </label>
              <label class="group-modal-label">
                <checkbox value="四" color="#fff" />周四
              </label>
              <label class="group-modal-label">
                <checkbox value="五" color="#fff" />周五
              </label>
              <label class="group-modal-label">
                <checkbox value="六" color="#fff" />周六
              </label>
              <label class="group-modal-label">
                <checkbox value="日" color="#fff" />周日
              </label>
            </checkbox-group>
            <div class="label-wrapper">
              <div class="group-modal-label">定时开启时间：</div>
              <div class="group-content rectangle-img">
                <e-picker mode="dateTime" class="picker-img" @change="handleSelectStartDate">
                  <div class="group-name">{{ startTime || "-" }}</div>
                </e-picker>
              </div>
            </div>
            <div class="label-wrapper">
              <div class="group-modal-label">定时关闭时间：</div>
              <div class="group-content rectangle-img">
                <e-picker mode="dateTime" class="picker-img" @change="handleSelectEndDate">
                  <div class="group-name">{{ endTime || "-" }}</div>
                </e-picker>
              </div>
            </div>
          </div>
          <div class="group-modal-btn">
            <div class="cancel-btn" @click="closeModal('ModifyGroup')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="modifyGroupConfirm">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 删除分组弹框 -->
      <neil-modal :show="showDeleteGroup" @close="closeModal('DeleteGroup')">
        <div class="manager-modal-container">
          <div class="neil-modal-label">确认删除分组？</div>
          <div class="neil-modal-btn">
            <div class="cancel-btn" @click="closeModal('DeleteGroup')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="handleDeleteConfirm">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <div class="emergence-alarm-modal">
        <!-- 应急报警弹框 -->
        <div v-if="isShowAlarm" class="emergence-alarm-main">
          <v-alarm ref="vAlarm" @close-alarm="closeAlarmModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import vTree from "@/components/v-tree/v-tree.vue";
import commonIcons from "@/components/common-icons/common-icons.vue";
import Api from "@/common/api.js";
import { unique, uniqueArr, dateFormat, currentPages } from "@/common/utils/util.js";
import managerList from "@/static/mock/manager/managerList.json";
import managerColumns from "@/static/mock/manager/managerColumns.json";
import roomColumns from "@/static/mock/roomColumns.json";
import doorColumns from "@/static/mock/manager/doorColumns.json";
import temColumns from "@/static/mock/manager/temColumns.json";
import otherColumns from "@/static/mock/manager/otherColumns.json";
import managerTableList from "@/static/mock/manager/managerTableList.json";
import { mapMutations } from "vuex";

export default {
  name: "manager",
  components: {
    vtimeLine,
    vTree,
    commonIcons,
  },
  data() {
    return {
      audioContext: null,
      isShowAlarm: false,
      isRead: true,
      week: 0,
      startTime: 0,
      endTime: 0,
      // 分机列表
      terminalList: {},
      // 分组列表
      groupList: {},
      // 切换分机|分组列表
      page: 0,
      // 切换音频|监室列表
      currentPage: 0,
      // 搜索分机监室
      searchTerminal: "",
      // 搜索分组监室
      searchGroup: "",
      // 监室列表表头
      roomColumns: roomColumns,
      // 音频列表表头
      managerColumns: managerColumns,
      // 设备列表
      managerList: managerList,
      doorColumns: doorColumns,
      temColumns: temColumns,
      otherColumns: otherColumns,
      // 已选音频数
      selectSongNum: 0,
      // 全选监室
      isRoomAll: false,
      // 全选音频
      isAudioAll: false,
      // 分机状态
      audioState: false,
      // 监区名称
      rootName: "",
      // 监室名称
      prisonName: "",
      // 添加分组弹框
      showAddGroup: false,
      // 添加分组名称
      addGroupName: true,
      // 修改分组弹框
      showModifyGroup: false,
      // 修改分组名称
      modifyGroupName: "",
      // 修改|删除分组ID
      groupId: "",
      // 删除分组弹框
      showDeleteGroup: false,
      // 监室表格列表
      roomTableList: [],
      // 已选监室列表
      roomSelectList: [],
      // 音频确认弹框
      showAudioConfirm: false,
      // 音频列表
      audioTableList: [],
      // 已选音频列表
      audioSelectList: [],
      // 音频列表选择状态
      checked: false,
      // 动态列表
      messageList: [],
      // 页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
      loadState: true,
      // 监室人员信息
      prisonerList: [],
      tableList: managerTableList,
      // 当前信息
      currentInfo: {},
    };
  },
  computed: {
    type() {
      let type = "iconentrance";
      switch (this.currentPage) {
        case 0:
          type = "iconmen";
          break;
        case 1:
          type = "iconlamp";
          break;
        case 2:
          type = "iconalarmbtn";
          break;
        case 3:
          type = "iconfancontrol";
          break;
        case 4:
          type = "icondianshi";
          break;
        case 5:
          type = "iconset";
          break;
        default:
          type = "iconentrance";
          break;
      }
      return type;
    },
    columns() {
      let columns = this.managerColumns;
      if (this.currentPage === 0) {
        columns = this.doorColumns;
      } else if (this.currentPage < 5) {
        columns = this.managerColumns;
      } else if (this.currentPage === 5) {
        columns = this.temColumns;
      } else {
        columns = this.otherColumns;
      }
      return columns;
    },
  },
  created() {
    if (uni.getStorageSync("baseUrl")) {
      // 获取分机列表
      this.getTerminalInfo();
      // 获取分组列表
      this.getGroupList();
      // 获取动态列表
      this.getDynamicInfo();
      this.getPrisonerInfo(this.pageIndex);
      this.audioTableList = this.tableList[this.currentPage];
    }
  },
  destroyed() {
    // 停止播放音频
    if (this.audioState) {
      this.hanleStopAudio();
    }
  },
  methods: {
    ...mapMutations({
      // 设置报警监室名
      setAlarmName: "app/SET_ALARMNAME",
    }),
    weekChange(e) {
      this.week = e.detail.value[0];
    },
    handleSelectStartDate(e) {
      this.startTime = e;
    },
    handleSelectEndDate(e) {
      this.endTime = e;
    },
    // 切换分机|分组列表
    handleTabChange(page) {
      this.page = page;
    },
    // 获取分机列表
    async getTerminalInfo() {
      const { areaId } = uni.getStorageSync("controlInfo");
      let res = await Api.apiCall("get", Api.index.getRoomByAreaId, {
        id: areaId,
      });
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
    // 获取分组列表
    async getGroupList() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let res = await Api.apiCall("get", Api.index.getGroupList, {
        controlId: controlId,
      });
      if (res.state.code == 200) {
        let result = [];
        res.data.map((item) => {
          if (!!item) {
            // 清除null数据
            result.push(item);
          }
        });
        this.groupList = { children: result };
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
        this.totalPage = (res.page && res.page.totalPage) || 0;
        this.prisonerList = this.prisonerList.concat(res.data);
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
    // 切换监室|音频列表
    handlePageChange(tab) {
      this.tableList[this.currentPage].map((i) => {
        i.isSelectAudio = false;
        return i;
      });
      this.selectSongNum = 0;
      this.audioTableList = this.tableList[tab];
      this.audioSelectList = [];
      this.currentPage = tab;
      this.isAudioAll = false;
    },
    // 搜索分机监室
    searchTerminalChange(e) {
      this.searchTerminal = e.detail.value;
    },
    // 搜索分机监室
    searchTerminalRoom() {
      if (!this.searchTerminal) {
        currentPages().handleShowToast("请输入搜索内容", "center");
        return;
      }
      let reg = new RegExp(this.searchTerminal);
      let roomItem = {};
      let repeatNum = 0;
      this.terminalList.children.map((list) => {
        // 监区名称
        this.rootName = list.name;
        list.children.map((item) => {
          if (reg.test(item.name) && !Object.keys(roomItem).length) {
            list._expand = true;
            item._checked = true;
            // 监区名称
            item.rootName = this.rootName;
            // 监室名称
            this.prisonName = item.name;
            // 连接状态
            item.status = "未连接";
            item.pause = false;
            roomItem = item;
          }
        });
      });
      if (Object.keys(roomItem).length) {
        this.roomTableList.push(roomItem);
        this.roomTableList = unique(this.roomTableList);
        this.roomTableList.map((item, index) => {
          if (item.name == roomItem.name) {
            repeatNum++;
            if (repeatNum == 2) {
              this.roomTableList.splice(index, 1);
            }
          }
        });
      }
      this.isRoomAll = true;
      this.roomTableList.map((item) => {
        item.isSelectRoom = true;
      });
      this.roomSelectList = this.roomTableList;
    },
    // 搜索分组监室
    searchGroupChange(e) {
      this.searchGroup = e.detail.value;
    },
    // 搜索分组监室
    searchGroupRoom() {
      if (!this.searchGroup) {
        currentPages().handleShowToast("请输入搜索内容", "center");
        return;
      }
      let reg = new RegExp(this.searchGroup);
      let roomItem = {};
      let repeatNum = 0;
      let isSelect = false;
      this.roomTableList.map((item) => {
        isSelect = reg.test(item.name);
      });
      if (isSelect) {
        this.groupList.children.map((list) => {
          list._expand = true;
        });
        return;
      }
      this.groupList.children.map((list) => {
        list.children.map((item) => {
          if (reg.test(item.name) && !Object.keys(roomItem).length) {
            list._expand = true;
            // 监区名称
            this.rootName = list.name;
            item._checked = true;
            // 监区名称
            item.rootName = this.rootName;
            // 监室名称
            this.prisonName = item.name;
            // 连接状态
            item.status = "未连接";
            item.pause = false;
            roomItem = item;
          }
        });
      });
      if (Object.keys(roomItem).length) {
        this.roomTableList.push(roomItem);
        this.roomTableList = unique(this.roomTableList);
        this.roomTableList.map((item, index) => {
          if (item.name == roomItem.name) {
            repeatNum++;
            if (repeatNum == 2) {
              this.roomTableList.splice(index, 1);
            }
          }
        });
      }
      this.isRoomAll = true;
      this.roomTableList.map((item) => {
        item.isSelectRoom = true;
      });
      this.roomSelectList = this.roomTableList;
    },
    // 选择分机列表
    terminalSelect(list) {
      list.map((item) => {
        item.status = "未连接";
        item.pause = false;
      });
      this.roomTableList = list;
      this.roomTableList = unique(this.roomTableList);
      if (!list.length) {
        this.isRoomAll = false;
      } else {
        this.isRoomAll = true;
      }
      this.roomTableList.map((item) => {
        item.isSelectRoom = true;
      });
      this.roomSelectList = this.roomTableList;
    },
    // 选择分组列表
    groupSelect(list) {
      list.map((item) => {
        item.status = "未连接";
        item.pause = false;
      });
      this.roomTableList.map((item) => {
        item.isSelectRoom = false;
      });
      if (list.length > this.roomTableList.length) {
        this.roomTableList.map((room) => {
          list.map((item, index) => {
            if (
              room.name == item.name &&
              room != item &&
              room.parentId != item.parentId
            ) {
              item._checked = false;
              list.splice(index, 1);
            }
          });
        });
        this.groupList.children.map((list) => {
          list.children.map((item) => {
            if (!item._checked) {
              list._checked = false;
            }
          });
        });
      }
      this.roomTableList = list;
      this.roomTableList = uniqueArr(this.roomTableList, "name");
      if (!list.length) {
        this.isRoomAll = false;
      } else {
        this.isRoomAll = true;
      }
      this.roomTableList.map((item) => {
        item.isSelectRoom = true;
      });
      this.roomSelectList = this.roomTableList;
    },
    // 全选音频|监室
    handleSelectAll() {
      if (!this.audioTableList.length) {
        return;
      }
      this.isAudioAll = !this.isAudioAll;
      if (this.isAudioAll) {
        this.audioTableList.map((item) => {
          item.isSelectAudio = true;
        });
        this.audioSelectList = this.audioTableList;
        this.selectSongNum = this.audioSelectList.length;
      } else {
        this.audioTableList.map((item) => {
          item.isSelectAudio = false;
        });
        this.audioSelectList = [];
        this.selectSongNum = 0;
      }
    },
    // 全选音频表格行
    checkAudioAll() {
      if (this.audioState) {
        currentPages().handleShowToast("请先停止分机播放", "center");
        return;
      }
      if (!this.audioTableList.length) {
        return;
      }
      this.isAudioAll = !this.isAudioAll;
      if (this.isAudioAll) {
        this.audioTableList.map((item) => {
          item.isSelectAudio = true;
        });
        this.audioSelectList = this.audioTableList;
        this.selectSongNum = this.audioSelectList.length;
      } else {
        this.audioTableList.map((item) => {
          item.isSelectAudio = false;
        });
        this.audioSelectList = [];
        this.selectSongNum = 0;
      }
    },
    // 移除已选择监室
    handleRemoveAll() {
      this.isRoomAll = false;
      this.roomTableList = [];
      this.roomSelectList = [];
      if (!this.page) {
        this.terminalList.children.map((list) => {
          list._checked = false;
          list.children.map((item) => {
            item._checked = false;
            item._expand = false;
          });
        });
      } else {
        this.groupList.children.map((list) => {
          list._checked = false;
          list.children.map((item) => {
            item._checked = false;
          });
        });
      }
    },
    // 选择音频表格行
    checkAudioChange(audio, index) {
      if (this.audioState) {
        currentPages().handleShowToast("请先停止分机播放", "center");
        return;
      }
      this.audioSelectList = [];
      if (audio.isSelectAudio) {
        audio.isSelectAudio = false;
        this.audioTableList.splice(index, 1, audio);
      } else {
        audio.isSelectAudio = true;
        this.audioTableList.splice(index, 1, audio);
      }
      this.audioTableList.map((item) => {
        if (item.isSelectAudio) {
          this.audioSelectList.push(item);
        }
      });
      if (this.audioSelectList.length == this.audioTableList.length) {
        this.isAudioAll = true;
      } else {
        this.isAudioAll = false;
      }
      this.selectSongNum = this.audioSelectList.length;
    },
    // 全选监室表格行
    checkRoomAll() {
      if (!this.roomTableList.length) {
        return;
      }
      this.isRoomAll = !this.isRoomAll;
      if (this.isRoomAll) {
        this.roomTableList.map((item) => {
          item.isSelectRoom = true;
        });
        this.roomSelectList = this.roomTableList;
      } else {
        this.roomTableList.map((item) => {
          item.isSelectRoom = false;
        });
        this.roomSelectList = [];
      }
    },
    // 选择监室表格行
    checkRoomChange(room, index) {
      this.roomSelectList = [];
      if (room.isSelectRoom) {
        room.isSelectRoom = false;
        this.roomTableList.splice(index, 1, room);
      } else {
        room.isSelectRoom = true;
        this.roomTableList.splice(index, 1, room);
      }
      this.roomTableList.map((item) => {
        if (item.isSelectRoom) {
          this.roomSelectList.push(item);
        }
      });
      if (this.roomSelectList.length == this.roomTableList.length) {
        this.isRoomAll = true;
      } else {
        this.isRoomAll = false;
      }
    },
    // 表格移除监室
    handleDeleteRoom(room, idx) {
      this.roomTableList.splice(idx, 1);
      if (this.roomSelectList.length) {
        this.roomSelectList.map((item, index) => {
          if (item.id == room.id) {
            this.roomSelectList.splice(index, 1);
          }
        });
      }
      if (!this.page) {
        this.handleRemoveRoom(this.terminalList, room);
      } else {
        this.handleRemoveRoom(this.groupList, room);
      }
      if (!this.roomTableList.length) {
        this.isRoomAll = false;
      }
    },
    // 表格移除监室方法
    handleRemoveRoom(list, room) {
      list.children.map((data) => {
        data.children.map((item, index) => {
          if (item.name == room.name) {
            data._checked = false;
            item._checked = false;
            data.children.splice(index, 1, item);
          }
        });
      });
    },
    // 播放分机音频
    handleOpenAudio() {
      this.showAudioConfirm = false;
      this.audioState = !this.audioState;
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = this.roomSelectList
        .map((item) => item.terminalCode)
        .toString();
      this.rootName = this.roomSelectList[0].rootName;
      this.prisonName = this.roomSelectList.map((item) => item.name).toString();
      let audioList = [];
      this.audioSelectList.map((item) => {
        let obj = {
          name: item.name,
          url: item.src,
        };
        audioList.push(obj);
      });
      if (this.audioState) {
        // 开始播放音频
        let controlObj = {
          maindevno: controlCode,
          devno: terminalCode,
          type: "300",
          msg: "0",
          extend: {
            audioList: audioList,
          },
        };
        currentPages().sendWebsocket(JSON.stringify(controlObj));
        let params = {
          controlId: uni.getStorageSync("controlInfo").id,
          type: "300",
          content: `开始播放${this.prisonName}音频`,
          operationTime: dateFormat("YYYY-MM-DD", new Date()),
        };
        this.setDynamicInfo(params);
      } else {
        // 停止播放音频
        this.hanleStopAudio();
      }
    },
    // 停止播放音频
    hanleStopAudio() {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = this.roomSelectList
        .map((item) => item.terminalCode)
        .toString();
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"300",msg:"1"}`
      );
      let params = {
        controlId: uni.getStorageSync("controlInfo").id,
        type: "300",
        content: `停止播放${this.prisonName}音频`,
        operationTime: dateFormat("YYYY-MM-DD", new Date()),
      };
      this.setDynamicInfo(params);
    },
    // 新增音频操作动态
    async setDynamicInfo(params) {
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
    },
    // 分机连接状态
    getConnectInfo(data) {
      this.roomTableList.map((item, index) => {
        data.map((res) => {
          if (res.name == item.name) {
            item.status = res.status == "0" ? "已连接" : "未连接";
            this.roomTableList.splice(index, 1, item);
          }
        });
      });
    },
    // 分机音频播放信息
    getAudioPlayInfo(data) {
      this.roomTableList.map((item, index) => {
        if (item.terminalCode == data.devno) {
          item.audio = data.audio;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 暂停分机音频
    handlePauseChange(data, index) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      if (data.pause) {
        // 分机播放音频
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.pause = false;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"300",msg:"4",extend:"0"}`
        );
      } else {
        // 分机暂停音频
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.pause = true;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"300",msg:"4",extend:"1"}`
        );
      }
    },
    // 添加分组弹框
    handleAddGroup(status) {
      if (!this.selectSongNum) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.isRead = status;
      this.addGroupName = status;
      this.showAddGroup = true;
    },
    // 获取添加分组名称
    addGroupChange(e) {
      this.addGroupName = e.detail.value;
    },
    handleItemChange(item, status) {
      this.currentInfo = item;
      if (this.currentPage < 5) {
        this.addGroupName = status;
        this.audioSelectList = [];
        item.isSelectAudio = true;
        this.audioSelectList.push(item);
      }
      this.isRead = false;
      this.showAddGroup = true;
    },
    // 确认添加分组
    addGroupConfirm() {
      if (this.currentPage < 5) {
        this.addGroup();
      } else {
        currentPages().handleShowToast("上传成功！", "center");
      }
      this.closeModal("AddGroup");
      let status = this.currentInfo.status ? 1 : 0;
      let mode;
      switch (this.currentPage) {
        case 0:
        // 门禁
        case 1:
        // 灯光
        case 2:
        // 报警
        case 3:
        // 风扇
        case 4:
        // 电视
        case 5:
          // 温湿度
          if (this.currentInfo.site == "监室1") {
            mode = 2;
          }
          if (this.currentInfo.site == "监室2") {
            mode = 2;
          }
          break;
      }
      this.controlHandler(`/${mode}/${status}`);
    },
    // 电气化控制设备处理方法
    async controlHandler(uri) {
      let res = await Api.apiCall("get", Api.test.controlOut + uri, null);
      if (res.state.code == 200) {
        currentPages().handleShowToast("指令下发成功！");
      }
    },
    addGroup() {
      this.audioSelectList.forEach((item) => {
        this.tableList[this.currentPage].map((i) => {
          if (i.site == item.site) {
            i.status = this.addGroupName;
            i.isSelectAudio = false;
          }
          return i;
        });
        this.audioTableList.map((i) => {
          if (i.site == item.site) {
            i.status = this.addGroupName;
          }
          return i;
        });
      });
      this.audioTableList.map((i) => {
        i.isSelectAudio = false;
        return i;
      });
      this.selectSongNum = 0;
      this.isAudioAll = false;
    },
    readingDate(num) {
      this.tableList[this.currentPage].map((i, index) => {
        if (num === index) {
          if (this.currentPage === 5) {
            i.tem = 21.5;
            i.hum = 54;
          } else if (this.currentPage === 6) {
            i.value = 65.2;
          } else if (this.currentPage === 7) {
            i.value = 50;
          }
        }
        return i;
      });
    },
    // 修改分组弹框
    openModifyGroup(list) {
      if (!this.selectSongNum) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.showModifyGroup = true;
    },
    closeModifyGroup() {
      if (!this.selectSongNum) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.audioTableList.map((i) => {
        i.isSelectAudio = false;
        return i;
      });
      this.selectSongNum = 0;
      this.isAudioAll = false;
      this.week = 0;
      this.audioSelectList.forEach((item) => {
        this.tableList[this.currentPage].map((i) => {
          if (item.site == i.site) {
            i.startTime = 0;
            i.endTime = 0;
          }
          return i;
        });
      });
      currentPages().handleShowToast("一键撤防成功！", "center");
    },
    // 获取修改分组名称
    modifyGroupChange(e) {
      this.modifyGroupName = e.detail.value;
    },
    // 确认修改分组名称
    modifyGroupConfirm() {
      this.updateGroup();
      this.tableList[this.currentPage].map((i) => {
        i.isSelectAudio = false;
        return i;
      });
      this.audioTableList.map((i) => {
        i.isSelectAudio = false;
        return i;
      });
      this.selectSongNum = 0;
      this.isAudioAll = false;
      currentPages().handleShowToast("一键布防成功！", "center");
      this.closeModal("ModifyGroup");
    },
    // 修改分组名称
    async updateGroup() {
      this.audioSelectList.forEach((item) => {
        this.tableList[this.currentPage].map((i) => {
          if (i.site == item.site) {
            i.startTime = this.week
              ? `每周${this.week} ${this.startTime.split(" ")[1]}`
              : this.startTime || "-";
            i.endTime = this.week
              ? `每周${this.week} ${this.endTime.split(" ")[1]}`
              : this.endTime || "-";
          }
          return i;
        });
      });
    },
    // 删除分组弹框
    openDeleteGroup(list) {
      this.groupId = list.id;
      this.showDeleteGroup = true;
    },
    // 确认删除分组
    handleDeleteConfirm() {
      this.deleteGroup();
      this.closeModal("DeleteGroup");
    },
    // 删除分组
    async deleteGroup() {
      let params = {
        data: {
          id: this.groupId,
        },
      };
      let res = await Api.apiCall("post", Api.index.deleteGroup, params);
      if (res.state.code == 200) {
        // 获取分组列表
        this.getGroupList();
      }
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
      if (type == "ModifyGroup") {
      }
      if (type == "DeleteGroup") {
        this.$refs.vTree.groupChange = false;
      }
    },
    showAlarmModal() {
      this.tableList[this.currentPage].map((i, index) => {
        if (index === 0) {
          i.status = true;
        }
        return i;
      });
      this.audioTableList.map((i, index) => {
        if (index === 0) {
          i.status = true;
        }
        return i;
      });
      this.audioContext = uni.createInnerAudioContext();
      this.audioContext.autoplay = false;
      this.audioContext.src = "/static/alarm/alarm.mp3";
      this.audioContext.play();
      this.setAlarmName("监室1门禁异常开启！");
      this.isShowAlarm = true;
    },
    closeAlarmModal() {
      this.audioContext = uni.createInnerAudioContext();
      this.audioContext.stop();
      this.isShowAlarm = false;
    },
    changeStatus() {
      this.tableList[0].map((i, index) => {
        if (index === 0) {
          i.status = !i.status;
        }
        return i;
      });
      this.audioTableList.map((i, index) => {
        if (index === 0) {
          i.status = !i.status;
        }
        return i;
      });
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
