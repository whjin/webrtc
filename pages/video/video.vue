<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div class="video-left">
        <div class="video-left-box">
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
                  <v-tree showCheckbox :disabledSelect="videoState" :root="terminalList"
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
                  <v-tree ref="vTree" showCheckbox :disabledSelect="videoState" :showGroup="true" :root="groupList"
                    :changeHandler="groupSelect" @group-change="openModifyGroup" @group-delete="openDeleteGroup"></v-tree>
                </scroll-view>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="video-center">
        <div class="video-center-head">
          <div class="center-head-box">
            <div class="head-tabs">
              <div :class="currentPage == 0 ? 'tab-active' : 'tab'" @click="handlePageChange(0)">
                视频播放
              </div>
              <div :class="currentPage == 1 ? 'tab-active' : 'tab'" @click="handlePageChange(1)">
                监室列表
              </div>
            </div>
          </div>
        </div>
        <div class="video-center-table">
          <div class="video-center-content">
            <div class="center-btn-box">
              <div class="center-btn-left">
                <div class="btn-left" v-show="!videoState && currentPage == 1"
                  :class="isRoomAll ? 'btn-active-img' : 'btn-img'" @click="handleSelectAll">
                  <text>全选</text>
                </div>
                <div class="btn-left btn-img" v-show="!videoState && currentPage == 1" @click="handleRemoveAll">
                  <text>移除</text>
                </div>
                <div class="btn-left btn-img" v-show="currentPage == 1" @click="handleAddGroup">
                  <text>添加分组</text>
                </div>
                <div class="btn-left btn-img" v-show="videoState && currentPage == 1" @click="decreaseVolume">
                  <text>音量－</text>
                </div>
                <div class="btn-left btn-img" v-show="videoState && currentPage == 1" @click="increaseVolume">
                  <text>音量＋</text>
                </div>
              </div>
              <div class="center-btn-right">
                <div class="btn-right btn-img" @click="handleVideoModal">
                  <text>{{ videoState ? "分机停止" : "分机播放" }}</text>
                </div>
              </div>
            </div>
            <div class="center-table-container">
              <div v-if="currentPage == 0">
                <div class="center-video-box">
                  <scroll-view scroll-y="true" class="center-video-scroll" @scrolltolower="scrollToLower">
                    <div class="video-list">
                      <div class="video-item" :class="videoId == item.id ? 'video-select-img' : 'video-img'
                        " v-for="(item, index) in videoTableList" :key="index" @click="selectVideoChange(item)">
                        <image :src="item.imgUrl"></image>
                        <text>{{ item.name }}</text>
                        <div class="video-playing" v-if="videoPlayId == item.id && videoState">
                          <common-icons type="iconplaying" size="28" color="#35FFFA" />
                          <text>播放中...</text>
                        </div>
                      </div>
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
                    <div class="video-head-item" v-for="(item, index) in videoColumns" :key="index">
                      {{ item.title }}
                    </div>
                  </div>
                  <scroll-view scroll-y="true" class="video-table-scroll">
                    <div class="video-table-main" v-for="(item, index) in roomTableList" :key="index">
                      <div class="table-content">
                        <div class="content-checkbox" @click="checkRoomChange(item, index)">
                          <common-icons :type="item.isSelectRoom
                            ? 'iconcheckbox'
                            : 'iconcheck-unselect'
                            " color="#2A4273" size="24"></common-icons>
                        </div>
                        <div class="video-table-item" style="flex: 1">
                          {{ item.name }}
                        </div>
                        <div class="video-table-item" style="flex: 1">
                          {{ item.status == "0" ? "连接成功" : "连接失败" }}
                        </div>
                        <div class="video-table-item" style="flex: 1">
                          {{ item.video }}
                        </div>
                        <div class="video-table-item" style="flex: 1">
                          {{ item.volume }}
                        </div>
                        <div class="video-table-item" style="flex: 1">
                          <div class="control-button" v-if="videoState">
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
      <div class="video-right">
        <div v-if="currentPage == 0" class="video-right-container">
          <div class="video-title">视频简介</div>
          <div class="video-content">
            <scroll-view class="video-right-scroll" scroll-y show-scrollbar>
              <div class="right-info-list">
                <div class="info-item">
                  <common-icons type="iconname" size="22" color="#00C6FF" />
                  <text>名称：{{ videoInfo.name }}</text>
                </div>
                <div class="info-item">
                  <common-icons type="iconsinger" size="22" color="#00C6FF" />
                  <text>主演：{{ videoInfo.leadActor }}</text>
                </div>
                <div class="info-item">
                  <common-icons type="icontype" size="22" color="#00C6FF" />
                  <text>类型：{{ videoInfo.type }}</text>
                </div>
                <div class="info-item">
                  <common-icons type="iconduration" size="22" color="#00C6FF" />
                  <text>时长：{{ videoInfo.duration }}</text>
                </div>
              </div>
            </scroll-view>
            <div v-if="isPlay" class="video-right-box">
              <video class="preview-video" :src="videoUrl" codec="software" autoplay @ended="videoPlayEnded"></video>
            </div>
            <div class="video-right-btn">
              <div class="video-btn" :class="isPlay ? 'btn-active-img' : 'btn-img'" @click="previewVideo">
                <text>{{ isPlay ? "关闭" : "预览" }}</text>
              </div>
            </div>
          </div>
          <div class="video-dynamic-box">
            <scroll-view scroll-y="true" class="video-dynamic-scroll">
              <vtimeLine title="视频动态信息" :messageList="messageList"></vtimeLine>
            </scroll-view>
          </div>
        </div>
        <div v-if="currentPage == 1" class="room-right-container">
          <scroll-view scroll-y="true" class="room-dynamic-scroll">
            <vtimeLine title="视频动态信息" :messageList="messageList"></vtimeLine>
          </scroll-view>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <!-- 视频确认弹框 -->
      <neil-modal :show="showVideoConfirm" @close="closeModal('VideoConfirm')">
        <div class="video-modal-container">
          <div class="neil-modal-label">
            确认{{ videoState ? "关闭" : "播放" }}视频？
          </div>
          <div class="neil-modal-btn">
            <div class="cancel-btn" @click="closeModal('VideoConfirm')">
              <span>取消</span>
            </div>
            <div class="confirm-btn" @click="handleOpenVideo">
              <span>确定</span>
            </div>
          </div>
        </div>
      </neil-modal>
      <!-- 添加分组弹框 -->
      <neil-modal :show="showAddGroup" @close="closeModal('AddGroup')">
        <div class="video-modal-container">
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
        <div class="video-modal-container">
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
        <div class="video-modal-container">
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
import commonIcons from "@/components/common-icons/common-icons.vue";
import vTree from "@/components/v-tree/v-tree.vue";
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import Api from "@/common/api.js";
import {
  unique,
  uniqueArr,
  timeFormat,
  dateFormat,
  currentPages
} from "@/common/utils/util.js";
import videoColumns from "@/static/mock/videoColumns.json";

export default {
  name: "control-video",
  components: {
    vTree,
    vtimeLine,
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
      // 切换视频|监室列表
      currentPage: 0,
      // 搜索分机监室
      searchTerminal: "",
      // 搜索分组监室
      searchGroup: "",
      // 监室列表表头
      videoColumns: videoColumns,
      // 全选监室
      isRoomAll: false,
      // 分机状态
      videoState: false,
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
      // 视频确认弹框
      showVideoConfirm: false,
      // 视频列表
      videoTableList: [],
      // 页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
      // 选择视频ID
      videoId: "",
      // 播放视频ID
      videoPlayId: "",
      // 视频地址
      videoUrl: "",
      // 视频名称
      videoName: "",
      // 视频预览状态
      isPlay: false,
      // 视频详情
      videoInfo: {},
      // 动态信息
      messageList: [],
    };
  },
  created() {
    // 获取分机列表
    this.getTerminalInfo();
    // 获取分组列表
    this.getGroupList();
    // 获取视频列表
    this.getVideoInfo(this.pageIndex);
    // 获取动态列表
    this.getDynamicInfo();
  },
  mounted() {
    // 获取视频播放状态信息
    this.getVideoStatusInfo("400");
  },
  methods: {
    // 切换分机|分组列表
    handleTabChange(page) {
      if (this.videoState) {
        currentPages().handleShowToast("请先停止播放视频", "center", 5000);
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
      let res = await Api.apiCall("get", Api.index.getGroupList, { controlId });
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
    // 获取动态信息
    async getDynamicInfo() {
      let controlId = uni.getStorageSync("controlInfo").id;
      let params = {
        controlId,
        type: "400",
      };
      let res = await Api.apiCall("get", Api.index.getDynamicInfo, params);
      if (res.state.code == 200) {
        this.messageList = res.data;
      }
    },
    // 获取所有视频列表
    async getVideoInfo(index) {
      let params = {
        pageParam: {
          pageIndex: index,
          pageSize: 16,
        },
      };
      let res = await Api.apiCall("post", Api.index.getAllVideo, params);
      if (res.state.code == 200) {
        this.totalPage = res.page.totalPage;
        let result = res.data;
        if (result.length) {
          result.map((item) => {
            item.duration = String(item.duration).includes(":")
              ? item.duration
              : timeFormat(item.duration);
          });
          this.videoTableList = [...this.videoTableList, ...result];
          this.videoInfo = this.videoTableList[0];
          this.videoId = this.videoInfo.id;
        }
      }
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        this.getVideoInfo(this.pageIndex);
      }
    },
    // 切换监室|视频列表
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
    // 选择视频
    selectVideoChange(item) {
      this.videoId = item.id;
      this.videoInfo = item;
    },
    // 预览视频
    previewVideo(e) {
      if (!Object.keys(this.videoInfo).length) {
        currentPages().handleShowToast("请先选择视频", "center");
        return;
      }
      this.isPlay = !this.isPlay;
      this.videoUrl = this.videoInfo.videoUrl;
    },
    // 视频播放结束
    videoPlayEnded(e) {
      this.isPlay = false;
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
    handleVideoModal() {
      if (!Object.keys(this.videoInfo).length) {
        currentPages().handleShowToast("请先选择视频", "center");
        return;
      }
      if (!this.roomSelectList.length) {
        currentPages().handleShowToast("请先选择监室", "center");
        return;
      }
      this.showVideoConfirm = true;
    },
    // 播放分机视频
    handleOpenVideo() {
      this.showVideoConfirm = false;
      this.videoState = !this.videoState;
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = this.roomSelectList
        .map((item) => item.terminalCode)
        .toString();
      this.rootName = this.roomSelectList[0].rootName;
      this.prisonName = this.roomSelectList.map((item) => item.name).toString();
      let videoTableList = [];
      let obj = {
        name: this.videoInfo.name,
        url: this.videoInfo.videoUrl,
      };
      videoTableList.push(obj);
      if (this.videoState) {
        // 开始播放视频
        this.videoPlayId = this.videoInfo.id;
        let controlObj = {
          maindevno: controlCode,
          devno: terminalCode,
          type: "400",
          msg: "0",
          extend: {
            videoList: videoTableList,
          },
        };
        this.getVideoStatusInfo("200");
        this.getVideoStatusInfo("300");
        setTimeout(() => {
          currentPages().sendWebsocket(JSON.stringify(controlObj));
          this.setDynamicInfo("400", `开始播放${this.prisonName}视频`);
        }, 0);
        setTimeout(() => {
          // 保存视频播放状态
          this.saveVideoPlayStatus("start");
        }, 1500);
        currentPages().stopLivePusher();
      } else {
        // 停止播放视频
        this.hanleStopVideo();
      }
    },
    // 停止播放视频
    hanleStopVideo() {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let terminalCode = this.roomSelectList
        .map((item) => item.terminalCode)
        .toString();
      currentPages().sendWebsocket(
        `{maindevno:"${controlCode}",devno:"${terminalCode}",type:"400",msg:"1"}`
      );
      this.setDynamicInfo("400", `停止播放${this.prisonName}视频`);
      // 保存视频播放状态
      this.saveVideoPlayStatus("stop");
    },
    // 新增视频操作动态
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
    // 保存视频播放状态
    async saveVideoPlayStatus(status) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        data: {
          controlCode,
          type: "400",
          status,
        },
      };
      if (status == "start") {
        params.data.mediaList = [this.videoInfo];
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
    // 获取视频播放状态信息
    async getVideoStatusInfo(type) {
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
              let audioRoomName = res.data.roomList
                .map((item) => item.name)
                .toString();
              this.setDynamicInfo("300", `停止播放${audioRoomName}音频`);
              break;
            case "400":
              this.videoInfo = res.data.mediaList[0];
              this.videoState = res.data.status == "start" ? true : false;
              this.videoId = this.videoInfo.id;
              this.videoPlayId = this.videoInfo.id;
              this.roomTableList = res.data.roomList;
              this.roomSelectList = this.roomTableList;
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
    // 分机视频播放信息
    getVideoPlayInfo(data) {
      this.roomTableList.map((item, index) => {
        if (item.terminalCode == data.devno) {
          item.video = data.video;
          item.volume = data.volume;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 分机回传音量
    terminalVideoVolume(info) {
      this.roomTableList.map((item, index) => {
        if (item.terminalCode == info.devno) {
          item.volume = info.extend;
          this.roomTableList.splice(index, 1, item);
        }
      });
    },
    // 暂停分机视频
    handlePauseChange(data) {
      const { controlCode } = uni.getStorageSync("controlInfo");
      if (data.pause) {
        // 分机播放视频
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.pause = false;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"400",msg:"4",extend:"0"}`
        );
      } else {
        // 分机暂停视频
        this.roomTableList.map((item, index) => {
          if (item == data) {
            data.pause = true;
            this.roomTableList.splice(index, 1, data);
          }
        });
        currentPages().sendWebsocket(
          `{maindevno:"${controlCode}",devno:"${data.terminalCode}",type:"400",msg:"4",extend:"1"}`
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
        type: "400",
        msg: "6",
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
