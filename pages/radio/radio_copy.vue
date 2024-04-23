<template>
  <div class="radio-container">
    <div class="radio-wrapper">
      <div class="radio-left">
        <div class="radio-left-box">
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
                  <v-tree showCheckbox :disabledSelect="radioState" :root="terminalList"
                    :changeHandler="terminalSelect"></v-tree>
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
                  <v-tree ref="vTree" showCheckbox :disabledSelect="radioState" :showGroup="true" :root="groupList"
                    :changeHandler="groupSelect" @group-change="openModifyGroup" @group-delete="openDeleteGroup"></v-tree>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="radio-center">
        <div class="radio-center-head">
          <div class="center-head-box">
            <div class="head-label">已选监室列表</div>
            <div class="head-content">
              <div>
                已选中:<text style="color: #21cdc5">{{ selectedNum }}</text>个监室
              </div>
              <div>
                已连接:<text style="color: #0267df">{{ connectedNum }}</text>个监室
              </div>
              <div>
                未连接:<text style="color: #e30c12">{{ disconnectNum }}</text>个监室
              </div>
            </div>
          </div>
        </div>
        <div class="radio-center-table">
          <div class="radio-center-content">
            <div class="center-btn-box">
              <div class="center-btn-left">
                <div class="btn-left" v-show="!radioState" :class="isRoomAll ? 'btn-active-img' : 'btn-img'"
                  @click="handleSelectAll">
                  <text>全选</text>
                </div>
                <div class="btn-left btn-img" v-show="!radioState" @click="handleRemoveAll">
                  <text>移除</text>
                </div>
                <div class="btn-left btn-img" @click="handleAddGroup">
                  <text>添加分组</text>
                </div>
                <div class="btn-left btn-img" v-show="radioState" @click="decreaseVolume">
                  <text>音量－</text>
                </div>
                <div class="btn-left btn-img" v-show="radioState" @click="increaseVolume">
                  <text>音量＋</text>
                </div>
              </div>
              <div class="center-btn-right">
                <div class="btn-right btn-img" @click="handleRadioModal">
                  <text>{{ radioState ? "关闭广播" : "开启广播" }}</text>
                </div>
              </div>
            </div>
            <div class="center-table-box">
              <div class="table-head">
                <div class="head-checkbox" @click="checkRoomAll">
                  <common-icons :type="isRoomAll ? 'iconcheckbox' : 'iconcheck-unselect'" color="#2A4273"
                    size="24"></common-icons>
                </div>
                <div class="radio-head-item" v-for="(item, index) in radioColumns" :key="index">
                  {{ item.title }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="center-table-scroll" :style="{ height: tableHeight + 'upx' }">
                <div class="radio-table-main" v-for="(item, index) in roomTableList" :key="index">
                  <div class="table-content">
                    <div class="content-checkbox" @click="checkRoomChange(item, index)">
                      <common-icons :type="item.isSelectRoom
                          ? 'iconcheckbox'
                          : 'iconcheck-unselect'
                        " color="#2A4273" size="24"></common-icons>
                    </div>
                    <div class="radio-table-item" style="flex: 1">
                      {{ item.name }}
                    </div>
                    <div class="radio-table-item" style="flex: 1">
                      {{ item.status == "0" ? "已连接" : "未连接" }}
                    </div>
                    <div class="radio-table-item" style="flex: 1">
                      {{ item.volume }}
                    </div>
                    <div class="radio-table-item" style="flex: 1">
                      <div class="control-button" v-if="radioState">
                        <image class="image-button" v-if="item.muted" src="@/static/images/common/button/stoped.png"
                          @click="handleMutedChange(item, index)"></image>
                        <image class="image-button" v-else src="@/static/images/common/button/started.png"
                          @click="handleMutedChange(item, index)"></image>
                      </div>
                      <div class="delete-button" v-else>
                        <image class="image-button" src="@/static/images/common/button/removed.png"
                          @click="handleDeleteRoom(item, index)"></image>
                      </div>
                    </div>
                  </div>
                  <image class="table-line" src="@/static/images/table/bottom.png"></image>
                </div>
              </scroll-view>
              <div class="sound-wave-box" v-if="radioState">
                <div class="sound-wave-image">
                  <image class="wave-img" v-if="isMuted" src="@/static/images/radio/radio.png"></image>
                  <image class="wave-img" v-else :src="gifUrl" @load="loadGifImage"></image>
                </div>
                <div class="sound-wave-button" :class="isMuted ? 'btn-active-img' : 'btn-img'"
                  @click="handleControlMuted">
                  <text>静音</text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="radio-right">
        <scroll-view scroll-y="true" class="right-dynamic-scroll">
          <vtimeLine title="广播动态信息" :messageList="messageList"></vtimeLine>
        </scroll-view>
      </div>
    </div>
    <div class="neil-modal-container">
      <!-- 广播确认弹框 -->
      <neil-modal :show="showRadioConfirm" @close="closeModal('RadioConfirm')">
        <div class="radio-modal-container">
          <div class="neil-modal-label">
            确认{{ radioState ? "关闭" : "开启" }}广播？
          </div>
          <div class="neil-modal-btn">
            <div class="cancel-btn" @click="closeModal('RadioConfirm')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="openRadio">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 添加分组弹框 -->
      <neil-modal :show="showAddGroup" @close="closeModal('AddGroup')">
        <div class="radio-modal-container">
          <div class="group-name-box">
            <div class="group-modal-label">请输入添加分组名称：</div>
            <div class="group-content rectangle-img">
              <input class="group-name" v-model="addGroupName" @input="addGroupChange" />
            </div>
          </div>
          <div class="group-modal-btn">
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
        <div class="radio-modal-container">
          <div class="group-name-box">
            <div class="group-modal-label">请输入修改分组名称：</div>
            <div class="group-content rectangle-img">
              <input class="group-name" v-model="modifyGroupName" @input="modifyGroupChange" />
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
        <div class="radio-modal-container">
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
    </div>
  </div>
</template>

<script>
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import vTree from "@/components/v-tree/v-tree.vue";
import Api from "@/common/api.js";
import { mapMutations } from "vuex";
import { unique, uniqueArr, dateFormat } from "@/common/utils/util.js";
import radioColumns from "@/static/mock/radioColumns.json";

// 设备按键
export default {
  name: "control-radio",
  components: {
    vtimeLine,
    vTree,
  },
  data() {
    return {
      // 0分机列表，1分组列表
      page: 0,
      // 分机列表
      terminalList: {},
      // 分组列表
      groupList: {},
      messageList: [],
      // 搜索分机监室
      searchTerminal: "",
      // 搜索分组监室
      searchGroup: "",
      // 已选监室
      selectedNum: 0,
      // 已连接
      connectedNum: 0,
      // 未连接
      disconnectNum: 0,
      // 表头信息
      radioColumns: radioColumns,
      // 分机监室列表
      roomTableList: [],
      // 已选监室列表
      roomSelectList: [],
      // 广播确认弹框
      showRadioConfirm: false,
      // 广播状态
      radioState: false,
      // 全选监室
      isRoomAll: false,
      // 监区名称
      rootName: "",
      // 监室名称
      prisonName: "",
      // 添加分组弹框
      showAddGroup: false,
      // 添加分组名称
      addGroupName: "",
      // 修改分组弹框
      showModifyGroup: false,
      // 修改分组名称
      modifyGroupName: "",
      // 修改|删除分组ID
      groupId: "",
      // 删除分组弹框
      showDeleteGroup: false,
      // 主机静音
      isMuted: false,
      // 声纹动画线上地址
      gifUrl: uni.getStorageSync("baseUrl") + "terminal/static/gif/radio.gif",
    };
  },
  computed: {
    // 表格动态高度
    tableHeight() {
      return this.radioState ? "375.5" : "438";
    },
  },
  created() {
    // 获取分机列表
    this.getTerminalInfo();
    // 获取分组列表信息
    this.getGroupList();
    // 获取动态信息
    this.getDynamicInfo();
  },
  mounted() {
    // 获取广播播放状态信息
    this.getRadioStatusInfo("200");
  },
  beforeDestroy() {
    this.setMuted(false);
  },
  methods: {
    ...mapMutations({
      // 设置主机静音
      setMuted: "app/SET_MUTED",
    }),
    loadGifImage(e) {
      let gifUrl;
      if (this.gifUrl.includes("?")) {
        gifUrl = this.gifUrl.substr(0, this.gifUrl.indexOf("?"));
      } else {
        gifUrl = this.gifUrl;
      }
      setTimeout(() => {
        this.gifUrl = gifUrl + `?${e.timeStamp}`;
      }, 3000);
    },
    // 切换分机、分组列表
    handleTabChange(page) {
      if (this.radioState) {
        currentPages().handleShowToast("请先停止广播", "center", 5000);
        return;
      }
      this.page = page;
    },
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
    // 获取分组列表
    async getGroupList() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let res = await Api.apiCall("get", Api.index.getGroupList, {
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
        this.groupList = { children: result };
      }
    },
    // 获取广播动态列表
    async getDynamicInfo() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let params = {
        controlId,
        type: "200",
      };
      let res = await Api.apiCall("get", Api.index.getDynamicInfo, params);
      if (res.state.code == 200) {
        this.messageList = res.data;
      }
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
            item.status = "1";
            item.muted = false;
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
      this.selectedNum = this.roomSelectList.length;
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
            item.status = "1";
            item.muted = false;
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
      this.selectedNum = this.roomSelectList.length;
    },
    // 选择分机列表
    terminalSelect(list) {
      if (this.radioState) {
        currentPages().handleShowToast("请先停止广播", "center", 5000);
        return;
      }
      list.map((item) => {
        item.status = "1";
        item.muted = false;
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
      this.selectedNum = this.roomSelectList.length;
    },
    // 选择分组列表
    groupSelect(list) {
      list.map((item) => {
        item.status = "1";
        item.muted = false;
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
      this.selectedNum = this.roomSelectList.length;
    },
    // 全选监室
    handleSelectAll() {
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
      this.selectedNum = this.roomSelectList.length;
    },
    // 移除已选择监室
    handleRemoveAll() {
      this.isRoomAll = false;
      this.roomTableList = [];
      this.roomSelectList = [];
      this.selectedNum = 0;
      this.connectedNum = 0;
      this.disconnectNum = 0;
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
      this.selectedNum = this.roomSelectList.length;
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
      this.selectedNum = this.roomSelectList.length;
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
      this.selectedNum = this.roomSelectList.length;
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
    // 打开广播弹框
    handleRadioModal() {
      if (!this.roomSelectList.length) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.showRadioConfirm = true;
    },
    // 打开广播
    openRadio() {
      this.showRadioConfirm = false;
      this.radioState = !this.radioState;
      if (this.radioState) {
        // 开始广播
        this.radioHandler("start");
      } else {
        // 停止广播
        this.radioHandler("stop");
      }
    },
    // 开始|停止播放
    radioHandler(status) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = this.roomSelectList
        .map((item) => {
          return item.terminalCode;
        })
        .join(",");
      this.rootName = this.roomSelectList[0].rootName;
      this.prisonName = this.roomSelectList
        .map((item) => {
          return item.name;
        })
        .join(",");
      switch (status) {
        case "start":
          // 开始广播
          getApp().globalData.FloatUniModule.setExtMicEna(true);
          // this.getRadioStatusInfo("300");
          // this.getRadioStatusInfo("400");

          // currentPages().startLivePusher();

          // 开始喊话广播
          // 添加喊话广播设备
          getApp().globalData.FloatUniModule.addBroadcastObj(3, (result) => {
            // 设置喊话广播设备
            // await getApp().globalData.FloatUniModule.setSpeakBroadcastDevice();
            // await getApp().globalData.FloatUniModule.startSpeakBroadcast(
            //   (data) => {
            //   }
            // );
          });

          // setTimeout(() => {
          //   currentPages().sendWebsocket(
          //     `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"200",msg:"0"}`
          //   );
          //   this.setDynamicInfo("200", `开始${this.prisonName}广播`);
          // }, 0);
          // setTimeout(() => {
          //   // 保存广播播放状态
          //   this.saveRadioPlayStatus("start");
          // }, 1500);
          break;
        case "stop":
          // 停止广播
          this.isMuted = false;
          this.setMuted(false);
          // currentPages().sendWebsocket(
          //   `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"200",msg:"1"}`
          // );

          // currentPages().stopLivePusher();

          // this.setDynamicInfo("200", `停止${this.prisonName}广播`);
          // // 保存广播播放状态
          // this.saveRadioPlayStatus("stop");

          // 停止喊话广播
          getApp().globalData.FloatUniModule.stopSpeakBroadcast((data) => {
            // 清空喊话广播设备
            getApp().globalData.FloatUniModule.clearBroadcastObj();
          });
          break;
      }
    },
    // 新增广播操作动态
    async setDynamicInfo(type, content) {
      let controlId = uni.getStorageSync("controlInfo").id;
      let operationTime = dateFormat("YYYY-MM-DD", new Date());
      let params = { controlId, type, content, operationTime };
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
    // 保存广播播放状态
    async saveRadioPlayStatus(status) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        data: {
          controlCode,
          type: "200",
          status,
        },
      };
      if (status == "start") {
        params.data.roomList = this.roomSelectList;
        params.data.startTime = dateFormat("YYYY-MM-DD hh:mm", new Date());
      } else {
        params.data.endTime = dateFormat("YYYY-MM-DD hh:mm", new Date());
      }
      let res = await Api.apiCall(
        "post",
        Api.index.saveMediaPlayStatus,
        params
      );
      if (res.state.code == 200) {
        currentPages().handleShowToast("保存状态成功", "bottom");
      }
    },
    // 获取广播播放状态信息
    async getRadioStatusInfo(type) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        controlCode,
        type,
      };
      let res = await Api.apiCall("get", Api.index.getMediaStatusInfo, params);
      if (res.state.code == 200) {
        if (res.data.roomList.length) {
          switch (type) {
            case "200":
              currentPages().startLivePusher();
              this.radioState = res.data.status == "start" ? true : false;
              this.roomTableList = res.data.roomList;
              this.roomSelectList = this.roomTableList;
              this.roomTableList.forEach((room) => {
                if (room.status == "0") {
                  this.connectedNum++;
                } else {
                  this.disconnectNum++;
                }
              });
              this.isRoomAll = true;
              this.selectedNum = this.roomSelectList.length;
              this.terminalList.children.map((list) => {
                if (this.roomTableList.length == list.children.length) {
                  list._checked = true;
                }
                list.children.map((item) => {
                  item._checked = false;
                  this.roomTableList.map((room) => {
                    if (item.terminalCode == room.terminalCode) {
                      item._checked = true;
                    }
                  });
                });
              });
              break;
            case "300":
              let audioRoomName = res.data.roomList
                .map((item) => {
                  return item.name;
                })
                .join(",");
              this.setDynamicInfo("300", `停止播放${audioRoomName}音频`);
              break;
            case "400":
              let videoRoomName = res.data.roomList
                .map((item) => {
                  return item.name;
                })
                .join(",");
              this.setDynamicInfo("400", `停止播放${videoRoomName}视频`);
              break;
          }
        }
      }
    },
    // 分机连接状态
    getConnectInfo(data) {
      this.connectedNum = 0;
      this.disconnectNum = 0;
      this.roomTableList.map((item, index) => {
        data.map((res) => {
          if (res.name == item.name) {
            if (res.status == "0") {
              this.connectedNum++;
            }
            if (res.status == "1") {
              this.disconnectNum++;
            }
            item.status = res.status;
            this.roomTableList.splice(index, 1, item);
          }
        });
      });
    },
    // 分机回传音量
    terminalRadioVolume(info) {
      this.roomTableList.map((item, index) => {
        if (item.terminalCode == info.devno) {
          item.volume = info.extend;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 切换分机静音
    handleMutedChange(data, index) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      if (data.muted) {
        // 分机取消静音
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.muted = false;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"200",msg:"3",extend:"0"}`
        );
      } else {
        // 分机开启静音
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.muted = true;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"200",msg:"3",extend:"1"}`
        );
      }
    },
    // 主机静音
    handleControlMuted() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        // 开启主机静音
        this.setMuted(true);
      } else {
        // 取消主机静音
        this.setMuted(false);
      }
    },
    // 添加分组弹框
    handleAddGroup() {
      if (!this.roomSelectList.length) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.addGroupName = "";
      this.showAddGroup = true;
    },
    // 获取添加分组名称
    addGroupChange(e) {
      this.addGroupName = e.detail.value;
    },
    // 确认添加分组
    addGroupConfirm() {
      if (!this.addGroupName) {
        currentPages().handleShowToast("请输入分组名称", "center");
        return;
      }
      this.addGroup();
      this.closeModal("AddGroup");
    },
    // 添加分组
    async addGroup() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let children = [];
      this.roomSelectList.map((item) => {
        let selectItem = {
          name: item.name,
          id: item.id,
          terminalCode: item.terminalCode,
        };
        children.push(selectItem);
      });
      let params = {
        name: this.addGroupName,
        id: controlId,
        children: children,
      };
      let res = await Api.apiCall("post", Api.index.addGroup, params);
      if (res.state.code == 200) {
        // 获取分组列表信息
        this.getGroupList();
      }
    },
    // 修改分组弹框
    openModifyGroup(list) {
      this.groupId = list.id;
      this.modifyGroupName = list.name;
      this.showModifyGroup = true;
    },
    // 获取修改分组名称
    modifyGroupChange(e) {
      this.modifyGroupName = e.detail.value;
    },
    // 确认修改分组名称
    modifyGroupConfirm() {
      if (!this.modifyGroupName) {
        currentPages().handleShowToast("请输入分组名称", "center");
        return;
      }
      this.$refs.vTree.groupChange = false;
      this.updateGroup();
      this.closeModal("ModifyGroup");
    },
    // 修改分组名称
    async updateGroup() {
      let params = {
        name: this.modifyGroupName,
        id: this.groupId,
      };
      let res = await Api.apiCall("post", Api.index.updateGroup, params);
      if (res.state.code == 200) {
        // 获取分组列表信息
        this.getGroupList();
      }
    },
    // 删除分组弹框
    openDeleteGroup(list) {
      this.groupId = list.id;
      this.showDeleteGroup = true;
    },
    // 确认删除分组
    handleDeleteConfirm() {
      this.$refs.vTree.groupChange = false;
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
        // 获取分组列表信息
        this.getGroupList();
      }
    },
    // 减少分机音量
    decreaseVolume() {
      if (this.roomSelectList.length) {
        let volumeList = [];
        this.roomSelectList.forEach((item) => {
          if (Reflect.has(item, "volume")) {
            let { volume, terminalCode } = item;
            if (volume > 0) {
              volume = volume - 20;
              volumeList.push({ volume, terminalCode });
            } else {
              volume = 0;
            }
          }
        });
        if (volumeList.length) {
          this.volumeHandler(volumeList);
        }
      }
    },
    // 增加分机音量
    increaseVolume() {
      if (this.roomSelectList.length) {
        let volumeList = [];
        this.roomSelectList.forEach((item) => {
          if (Reflect.has(item, "volume")) {
            let { volume, terminalCode } = item;
            if (volume < 100) {
              volume = parseInt(volume) + 20;
              volumeList.push({ volume, terminalCode });
            } else {
              volume = 100;
            }
          }
        });
        if (volumeList.length) {
          this.volumeHandler(volumeList);
        }
      }
    },
    // 设置分机音量消息
    volumeHandler(volumeList) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = volumeList.map((item) => item.terminalCode).toString();
      let controlObj = {
        maindevno: controlCode,
        devno: terminalCode,
        type: "200",
        msg: "5",
        extend: { volumeList },
      };
      currentPages().sendWebsocket(JSON.stringify(controlObj));
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
      if (type == "ModifyGroup") {
        this.$refs.vTree.groupChange = false;
      }
      if (type == "DeleteGroup") {
        this.$refs.vTree.groupChange = false;
      }
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
