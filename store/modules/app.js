import { uniqueArr } from "@/common/utils/util.js";

const state = {
  // 对讲信息
  intercomInfo: {},
  // 视频对讲状态
  openIntercom: false,
  // 挂断按钮状态
  hangupState: false,
  // 监视监听轮巡状态
  isPolling: false,
  // 监视监听状态
  monitorState: false,
  // 监室离线状态
  offlineState: false,
  // 对讲弹框状态
  isOpenModal: false,
  // 报警弹框状态
  isOpenAlarm: false,
  // 报警监室名
  alarmName: "",
  // 主机静音状态
  muted: false,
  // 监视监听显隐
  showPlayer: false,
  // 视频流地址
  nodePlayUrl: "",
  // 未接来电列表
  missCallList: [],
  // 未接来电状态
  missCallState: false,
  // 未接来电数
  missCallNum: 0,
  // 未接来电监室名
  missCallName: "",
  // 视频通话列表
  chatList: [],
  // 应急报警列表
  alarmList: [],
  // 呼叫方状态（控制监听|对讲切换，重要）
  callState: false,
  // Tab状态列表
  tabList: [],
  // 菜单列表
  menuList: [],
  // 禁止Tab切换
  disableTab: false,
};

const mutations = {
  // TAB状态列表
  SET_TABLIST(state, list) {
    state.tabList = list;
  },
  // 菜单列表
  SET_MENULIST(state, list) {
    state.menuList = list;
  },
  // 保存对讲信息
  SET_INTERCOMINFO(state, info) {
    state.intercomInfo = info;
  },
  // 设置视频对讲状态
  SET_OPENINTERCOM(state, bool) {
    state.openIntercom = bool;
  },
  // 设置挂断按钮状态
  SET_HANGUPSTATE(state, bool) {
    state.hangupState = bool;
  },
  // 设置监视监听轮巡状态
  SET_ISPOLLING(state, bool) {
    state.isPolling = bool;
  },
  // 设置监视监听状态
  SET_MONITORSTATE(state, bool) {
    state.monitorState = bool;
  },
  // 设置监室离线状态
  SET_OFFLINESTATE(state, bool) {
    state.offlineState = bool;
  },
  // 设置对讲弹框状态
  SET_ISOPENMODAL(state, bool) {
    state.isOpenModal = bool;
  },
  // 设置报警弹框状态
  SET_ISOPENALARM(state, bool) {
    state.isOpenAlarm = bool;
  },
  // 设置报警监室名
  SET_ALARMNAME(state, info) {
    state.alarmName = info;
  },
  // 主机静音状态
  SET_MUTED(state, bool) {
    state.muted = bool;
  },
  // 设置监视监听显隐
  SET_SHOWPLAYER(state, bool) {
    state.showPlayer = bool;
  },
  // 视频流地址
  SET_NODEPLAYURL(state, info) {
    state.nodePlayUrl = info;
  },
  // 保存未接来电列表
  SET_MISSCALLLIST(state, list) {
    state.missCallList = list;
  },
  // 设置未接来电状态
  SET_MISSCALLSTATE(state) {
    state.missCallState =
      state.isOpenAlarm ||
      state.isOpenModal ||
      state.openIntercom ||
      state.disableTab ||
      !!state.chatList.length ||
      !!state.alarmList.length;
  },
  // 未接来电数
  SET_MISSCALLNUM(state, num) {
    state.missCallNum = num;
  },
  // 未接来电监室名
  GET_MISSCALLNAME(state) {
    if (state.alarmList.length) {
      state.missCallName = `${state.alarmList[0].name}发起应急报警请求`;
    } else if (state.chatList.length) {
      state.missCallName = `${state.chatList[0].name}发起视频通话请求`;
    } else {
      state.missCallName = "";
    }
  },
  // 新增应急报警信息
  ADD_ALARMLIST(state, info) {
    state.alarmList.push(info);
    state.alarmList = uniqueArr(state.alarmList, "devno");
  },
  // 新增视频通话信息
  ADD_CHATLIST(state, info) {
    state.chatList.push(info);
    state.chatList = uniqueArr(state.chatList, "devno");
  },
  // 删除未接来电信息
  DELETE_MISSCALLINFO(state) {
    if (state.alarmList.length) {
      state.alarmList.shift();
    }
    if (state.chatList.length) {
      state.chatList.shift();
    }
  },
  // 删除超时请求信息
  DELETE_OVERTIMEINFO(state, info) {
    if (state.alarmList.length) {
      state.alarmList.map((item, index) => {
        if (info.devno == item.devno) {
          state.alarmList.splice(index, 1);
        }
      });
    }
    if (state.chatList.length) {
      state.chatList.map((item, index) => {
        if (info.devno == item.devno) {
          state.chatList.splice(index, 1);
        }
      });
    }
  },
  // 删除未接来电列表
  DELETE_MISSCALLLIST(state, index) {
    state.missCallList.splice(index, 1);
  },
  // 设置呼叫方状态
  SET_CALLSTATE(state, bool) {
    state.callState = bool;
  },
  // 设置Tab切换状态
  SET_DISABLETAB(state, bool) {
    state.disableTab = bool;
  },
};

const actions = {
  // 新增未接报警信息
  addMissAlarmInfo({ commit }, info) {
    return new Promise(() => {
      commit("ADD_ALARMLIST", info);
      commit("GET_MISSCALLNAME");
      commit("SET_MISSCALLSTATE");
    });
  },
  // 新增未接来电信息
  addMissCallInfo({ commit }, info) {
    return new Promise(() => {
      commit("ADD_CHATLIST", info);
      commit("GET_MISSCALLNAME");
      commit("SET_MISSCALLSTATE");
    });
  },
  // 删除未接来电信息
  deleteMissCall({ commit }) {
    return new Promise(() => {
      commit("DELETE_MISSCALLINFO");
      commit("GET_MISSCALLNAME");
      commit("SET_MISSCALLSTATE");
    });
  },
  // 删除超时请求信息
  deleteOvertimeCall({ commit }, info) {
    return new Promise(() => {
      commit("DELETE_OVERTIMEINFO", info);
      commit("GET_MISSCALLNAME");
      commit("SET_MISSCALLSTATE");
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
