<template>
  <div class="audio-container">
    <div class="audio-wrapper">
      <div class="audio-left">
        <div class="audio-left-box">
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
                  <v-tree showCheckbox :disabledSelect="audioState" :root="terminalList"
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
                  <v-tree ref="vTree" showCheckbox :disabledSelect="audioState" :showGroup="true" :root="groupList"
                    :changeHandler="groupSelect" @group-change="openModifyGroup" @group-delete="openDeleteGroup"></v-tree>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="audio-center">
        <div class="audio-center-head">
          <div class="center-head-box">
            <div class="head-tabs">
              <div :class="currentPage == 0 ? 'tab-active' : 'tab'" @click="handlePageChange(0)">
                音频列表
              </div>
              <div :class="currentPage == 1 ? 'tab-active' : 'tab'" @click="handlePageChange(1)">
                监室列表
              </div>
            </div>
            <div class="head-content">
              已选中:<text style="color: #21cdc5">{{ selectSongNum }}</text>首
            </div>
          </div>
        </div>
        <div class="audio-center-table">
          <div class="audio-center-content">
            <div class="center-btn-box">
              <div class="center-btn-left">
                <div class="btn-left" v-show="!audioState && currentPage == 0"
                  :class="isAudioAll ? 'btn-active-img' : 'btn-img'" @click="handleSelectAll">
                  <text>全选</text>
                </div>
                <div class="btn-left" v-show="!audioState && currentPage == 1"
                  :class="isRoomAll ? 'btn-active-img' : 'btn-img'" @click="handleSelectAll">
                  <text>全选</text>
                </div>
                <div class="btn-left btn-img" v-show="!audioState && currentPage == 1" @click="handleRemoveAll">
                  <text>移除</text>
                </div>
                <div class="btn-left btn-img" v-show="currentPage == 1" @click="handleAddGroup">
                  <text>添加分组</text>
                </div>
                <div class="btn-left btn-img" v-show="audioState && currentPage == 1" @click="decreaseVolume">
                  <text>音量－</text>
                </div>
                <div class="btn-left btn-img" v-show="audioState && currentPage == 1" @click="increaseVolume">
                  <text>音量＋</text>
                </div>
              </div>
              <div class="center-btn-right">
                <div class="btn-right btn-img" @click="handleAudioModal">
                  <text>{{ audioState ? "分机停止" : "分机播放" }}</text>
                </div>
              </div>
            </div>
            <div class="center-table-container">
              <div v-if="currentPage == 0">
                <div class="audio-table-box">
                  <div class="table-head">
                    <div class="head-checkbox" @click="checkAudioAll">
                      <common-icons :type="isAudioAll ? 'iconcheckbox' : 'iconcheck-unselect'
                        " color="#2A4273" size="24"></common-icons>
                    </div>
                    <div class="audio-head-item" v-for="(item, index) in audioColumns" :key="index">
                      {{ item.title }}
                    </div>
                  </div>
                  <scroll-view scroll-y="true" class="audio-table-scroll" @scrolltolower="scrollToLower">
                    <div class="audio-table-main" v-for="(item, index) in audioTableList" :key="index">
                      <div class="table-content">
                        <div class="content-checkbox" @click="checkAudioChange(item, index)">
                          <common-icons :type="item.isSelectAudio
                              ? 'iconcheckbox'
                              : 'iconcheck-unselect'
                            " color="#2A4273" size="24"></common-icons>
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.name }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.singer }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.duration }}
                        </div>
                      </div>
                      <image class="table-line" src="@/static/images/table/bottom.png"></image>
                    </div>
                  </scroll-view>
                </div>
              </div>
              <div v-if="currentPage == 1">
                <div class="room-table-box">
                  <div class="table-head">
                    <div class="head-checkbox" @click="checkRoomAll">
                      <common-icons :type="isRoomAll ? 'iconcheckbox' : 'iconcheck-unselect'
                        " color="#2A4273" size="24"></common-icons>
                    </div>
                    <div class="audio-head-item" v-for="(item, index) in roomColumns" :key="index">
                      {{ item.title }}
                    </div>
                  </div>
                  <scroll-view scroll-y="true" class="audio-table-scroll">
                    <div class="audio-table-main" v-for="(item, index) in roomTableList" :key="index">
                      <div class="table-content">
                        <div class="content-checkbox" @click="checkRoomChange(item, index)">
                          <common-icons :type="item.isSelectRoom
                              ? 'iconcheckbox'
                              : 'iconcheck-unselect'
                            " color="#2A4273" size="24"></common-icons>
                        </div>
                        <div class="audio-table-item" style="flex: 1; padding-left: 6.88upx">
                          {{ item.name }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.status == "0" ? "连接成功" : "连接失败" }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.audio }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          {{ item.volume }}
                        </div>
                        <div class="audio-table-item" style="flex: 1">
                          <div class="control-button" v-if="audioState">
                            <image class="image-button" v-if="item.pause" src="@/static/images/common/button/stoped.png"
                              @click="handlePauseChange(item)"></image>
                            <image class="image-button" v-else src="@/static/images/common/button/started.png"
                              @click="handlePauseChange(item)"></image>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="audio-right">
        <scroll-view scroll-y="true" class="right-dynamic-scroll">
          <vtimeLine title="音频动态信息" :messageList="messageList"></vtimeLine>
        </scroll-view>
      </div>
    </div>
    <div class="neil-modal-container">
      <!-- 音频确认弹框 -->
      <neil-modal :show="showAudioConfirm" @close="closeModal('AudioConfirm')">
        <div class="audio-modal-container">
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
        <div class="audio-modal-container">
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
        <div class="audio-modal-container">
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
        <div class="audio-modal-container">
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
import commonIcons from "@/components/common-icons/common-icons.vue";
import Api from "@/common/api.js";
import {
  unique,
  uniqueArr,
  timeFormat,
  dateFormat,
  currentPages
} from "@/common/utils/util.js";
import audioColumns from "@/static/mock/audioColumns.json";
import roomColumns from "@/static/mock/roomColumns.json";

export default {
  name: "control-audio",
  components: {
    vtimeLine,
    vTree,
    commonIcons,
  },
  data() {
    return {
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
      audioColumns: audioColumns,
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
      addGroupName: "",
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
    };
  },
  created() {
    // 获取分机列表
    this.getTerminalInfo();
    // 获取分组列表
    this.getGroupList();
    // 获取音频列表
    this.getAudioInfo(this.pageIndex);
    // 获取动态列表
    this.getDynamicInfo();
  },
  mounted() {
    // 获取音频播放状态信息
    this.getAudioStatusInfo("300");
  },
  methods: {
    // 切换分机|分组列表
    handleTabChange(page) {
      if (this.audioState) {
        currentPages().handleShowToast("请先停止播放音频", "center", 5000);
        return;
      }
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
    // 获取音频动态列表
    async getDynamicInfo() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let params = {
        controlId: controlId,
        type: "300",
      };
      let res = await Api.apiCall("get", Api.index.getDynamicInfo, params);
      if (res.state.code == 200) {
        this.messageList = res.data;
      }
    },
    // 获取所有音频列表
    async getAudioInfo(index) {
      let params = {
        pageParam: {
          pageIndex: index,
          pageSize: 10,
        },
      };
      let res = await Api.apiCall("post", Api.index.getAudioInfos, params);
      if (res.state.code == 200) {
        this.totalPage = res.page.totalPage;
        let result = res.data;
        if (result.length) {
          result.map((item) => {
            item.duration = String(item.duration).includes(":")
              ? item.duration
              : timeFormat(item.duration);
            item.isSelectAudio = false;
          });
          this.audioTableList = [...this.audioTableList, ...result];
        }
      }
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        this.getAudioInfo(this.pageIndex);
      }
    },
    // 切换监室|音频列表
    handlePageChange(tab) {
      this.currentPage = tab;
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
            item.status = "1";
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
        item.status = "1";
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
        item.status = "1";
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
      if (!this.currentPage) {
        // 全选音频
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
      } else {
        // 全选监室
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
    // 打开分机弹框
    handleAudioModal() {
      if (!this.audioSelectList.length) {
        currentPages().handleShowToast("请先选择音频", "center");
        return;
      }
      if (!this.roomSelectList.length) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.showAudioConfirm = true;
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
        this.getAudioStatusInfo("200");
        this.getAudioStatusInfo("400");
        setTimeout(() => {
          currentPages().sendWebsocket(JSON.stringify(controlObj));
          this.setDynamicInfo("300", `开始播放${this.prisonName}音频`);
        }, 0);
        setTimeout(() => {
          // 保存音频播放状态
          this.saveAudioPlayStatus("start");
        }, 1500);
        currentPages().stopLivePusher();
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
      this.setDynamicInfo("300", `停止播放${this.prisonName}音频`);
      // 保存音频播放状态
      this.saveAudioPlayStatus("stop");
    },
    // 新增音频操作动态
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
    // 保存音频播放状态
    async saveAudioPlayStatus(status) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        data: {
          controlCode,
          type: "300",
          status,
        },
      };
      if (status == "start") {
        params.data.mediaList = this.audioTableList;
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
    // 获取音频播放状态信息
    async getAudioStatusInfo(type) {
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
              let radioRoomName = res.data.roomList
                .map((item) => item.name)
                .toString();
              this.setDynamicInfo("200", `停止${radioRoomName}广播`);
              break;
            case "300":
              this.audioTableList = res.data.mediaList;
              this.audioState = res.data.status == "start" ? true : false;
              this.roomTableList = res.data.roomList;
              this.roomSelectList = this.roomTableList;
              this.audioTableList.forEach((audio) => {
                if (audio.isSelectAudio) {
                  this.audioSelectList.push(audio);
                }
              });
              if (this.audioSelectList.length == this.audioTableList.length) {
                this.isAudioAll = true;
              } else {
                this.isAudioAll = false;
              }
              this.selectSongNum = this.audioSelectList.length;
              this.isRoomAll = true;
              this.terminalList.children.map((list) => {
                if (this.roomTableList.length == list.children.length) {
                  list._checked = true;
                }
                list.children.map((item) => {
                  this.roomTableList.forEach((room) => {
                    if (item.terminalCode == room.terminalCode) {
                      item._checked = true;
                    }
                  });
                });
              });
              break;
            case "400":
              let videoRoomName = res.data.roomList
                .map((item) => item.name)
                .toString();
              this.setDynamicInfo("400", `停止播放${videoRoomName}视频`);
              break;
          }
        }
      }
    },
    // 分机连接状态
    getConnectInfo(data) {
      this.roomTableList.map((item, index) => {
        data.map((res) => {
          if (res.name == item.name) {
            item.status = res.status;
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
          item.volume = data.volume;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 分机回传音量
    terminalAudioVolume(info) {
      this.roomTableList.map((item, index) => {
        if (item.terminalCode == info.devno) {
          item.volume = info.extend;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 暂停分机音频
    handlePauseChange(data) {
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
        // 获取分组列表
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
        // 获取分组列表
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
        // 获取分组列表
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
        type: "300",
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
