export default {
  // 主页
  index: {
    // 获取APP配置菜单
    getAppModuleConf: "terminal/terAppModuleConf/getAppModuleConf",
    // 获取主机信息
    getControlInfo: "terminal/terControlInfo/getControlByIp",
    // 获取首页动态信息
    getDynamicInfo: "terminal/common/getRoomDynamicInfo",
    // 新增音视频动态信息
    saveDynamicInfo: "terminal/terOperationInfo/save",
    // 获取在线报警数
    getOnlineAlermInfo: "terminal/alarm/getAreaOnLineAndAlarmInfo",
    // 获取所有报警数
    getAllAlarm: "terminal/alarm/getAllAlarm",
    // 获取分机报警数
    getTerminalAlarm: "terminal/alarm/getTerminalAlarmNumber",
    // 获取监区分机在线离线信息
    getAreaOnlineStatus:
      "terminal/terControlInfo/getAllAreaTerminalOnLineStatus",
    // 获取系统缓存信息
    getSysSetting: "terminal/terSetting/getSystemInfo",
    // 获取主机列表
    getAllControlInfo: "terminal/terControlInfo/getAllControlInfos",
    // 获取分机列表
    getRoomByAreaId: "terminal/pacPrisonAreaInfo/getAreaAndRoomInfos",
    // 获取分组列表
    getGroupList: "terminal/terControlGroup/getGroupList",
    // 添加分组
    addGroup: "terminal/terControlGroup/saveGroup",
    // 修改分组名称
    updateGroup: "terminal/terControlGroup/updateGroup",
    // 删除分组
    deleteGroup: "terminal/terControlGroup/deleteGroup",
    // 获取人员信息
    getPrisonerInfo: "terminal/common/getRoomPrisonerInfo",
    // 获取音频列表信息
    getAudioInfos: "terminal/terAudio/findAll",
    // 获取视频列表
    getAllVideo: "terminal/pacVideo/findAllByParam",
    // 更新应急报警信息
    updateAlarmInfo: "terminal/alarm/updateAlarmInfo",
    // 获取分机设备在线状态
    terminalDeviceStatus: "terminal/device/api/terminalDeviceStatus",
    // 获取主机对讲状态
    getControlIntercomState: "terminal/terControlInfo/getControlIntercomStatus",
    // 获取APP升级信息
    getUpdateInfo: "terminal/update/getUpdateInfo",
    // 修改主机信息
    updateControl: "terminal/common/updateAppVersion",
    // 获取未接来电信息
    getMissCallInfo: "terminal/terCallInfo/getCallInfoList",
    // 忽略回拨未接来电
    updateMissCallInfo: "terminal/terCallInfo/updateCallInfo",
    // 分机在线列表
    terminalOnlineStatusInfo:
      "terminal/terControlInfo/getAllAreaTerminalOnLineStatusInfo",
    // 保存广播|音视频播放状态
    saveMediaPlayStatus: "terminal/pacRoomInfo/saveRoomStatus",
    // 获取广播|音视频播放信息
    getMediaStatusInfo: "terminal/pacRoomInfo/getRoomStatus",
    // 根据来邦slaveNum获取分机信息
    getTerminalBySip: "terminal/terTerminalInfo/getTerminalBySip",
    // 来邦获取录像记录
    getIntercomRecord: "terminal/terControlInfo/getIntercomRecord",
    // 主机临时点名
    tempRollCall: "terminal/pacRollCall/tempRollCall",
    // 查询点名记录
    findRollCallDetail: "terminal/pacRollCall/findRollCallDetailByParams",
  },
  test: {
    controlOut: "terminal/terElectricalControl/controlOut",
  },

  /**
   * 封装请求（async await 封装uni.request）
   * method		post/get
   * endpoint		接口方法名
   * data			所需传递参数
   * load			是否需要loading
   */
  async apiCall(method, endpoint, data, load) {
    const baseUrl = uni.getStorageSync("baseUrl");
    if (baseUrl) {
      let fullUrl = baseUrl + endpoint;
      let Authorization;
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo) {
        let uuid = userInfo.uuid;
        if (uuid) {
          Authorization = userInfo.uuid + " " + userInfo.terminalIP;
        }
      }
      if (endpoint == "permission/terminalCertification") {
        let [error, res] = await uni.request({
          url: fullUrl,
          data: data,
          method: method,
          header: {
            client_id: "app",
            client_secret: "app",
            "content-type": "application/json",
            Authorization: Authorization || "",
          },
        });
        if (res.data.state.code != 200) {
          this.handleShowToast(`请求出错：${res.data.state.msg}`);
        }
        return res.data;
      } else {
        let [error, res] = await uni.request({
          url: fullUrl,
          data: data,
          method: method,
          header: {
            client_id: "app",
            client_secret: "app",
            "content-type": "application/json",
            Authorization: Authorization || "",
          },
        });
        if (res.data.state.code == 503) {
          uni.$emit("serve-Offline", true, res.data.state.msg);
          setTimeout(() => {
            uni.$emit("serve-Offline", false);
          }, 3000);
        }
        return res.data;
      }
    } else {
      this.handleShowToast("请先设置基础baseUrl！");
    }
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
};
