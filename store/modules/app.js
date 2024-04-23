const state = {
  // 当前页面
  currentTab: 1,
  // 点名信息
  rollInfo: {},
  // 人脸|指纹认证人员信息
  personInfo: {},
  // 首页状态栏显隐
  showBottomBar: true,
  // 返回首页状态
  homeState: true,
  // 后退状态
  backState: true,
  // 登录状态
  loginState: false,
  // 是否正在点名
  isCalling: false,
  // 是否正在对讲
  isIntercom: false,
  // 值班人员列表
  dutyList: [],
  // 是否对讲等待接听中
  isWaitingIntercom: false,
  // 谈话|测评任务ID
  taskId: "",
  // 正在智能谈话
  isConversation: false,
  // 正在心理测评
  isEvaluation: false,
  // 来邦服务状态
  IPCState: false,
  // rtcVideo对讲组件ref
  rtcVideoRef: null,
};

const mutations = {
  // 当前页面
  SET_CURRENTTAB(state, num) {
    state.currentTab = num;
  },
  // 临时点名信息
  SET_ROLLINFO(state, info) {
    state.rollInfo = info;
  },
  // 指纹认证人员信息
  SET_PERSONINFO(state, info) {
    state.personInfo = info;
  },
  // 设置状态栏显隐
  SET_BOTTOMBAR(state, bool) {
    state.showBottomBar = bool;
  },
  // 设置返回首页状态
  SET_HOMESTATE(state, bool) {
    state.homeState = bool;
  },
  // 设置后退状态
  SET_BACKSTATE(state, bool) {
    state.backState = bool;
  },
  // 设置登录状态
  SET_LOGINSTATE(state, bool) {
    state.loginState = bool;
  },
  // 设置是否正在点名
  SET_ISCALLING(state, bool) {
    state.isCalling = bool;
  },
  // 设置是否正在对讲
  SET_ISINTERCOM(state, bool) {
    state.isIntercom = bool;
  },
  // 值班人员列表
  SET_DUTYLIST(state, info) {
    state.dutyList = info;
  },
  // 设置是否对讲等待接听中
  SET_ISWAITINGINTERCOM(state, bool) {
    state.isWaitingIntercom = bool;
  },
  // 设置谈话|测评ID
  SET_TASKID(state, id) {
    state.taskId = id;
  },
  // 设置智能谈话状态
  SET_ISCONVERSATION(state, bool) {
    state.isConversation = bool;
  },
  // 设置心理测评状态
  SET_ISEVALUATION(state, bool) {
    state.isEvaluation = bool;
  },
  // 来邦服务状态
  SET_IPCSTATE(state, bool) {
    state.IPCState = bool;
  },
  // 设置rtcVideo对讲组件Ref
  SET_RTCVIDEOREF(state, ref) {
    state.rtcVideoRef = ref;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
