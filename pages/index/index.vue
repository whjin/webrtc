<template>
  <div class="home-container">
    <div class="home-wrapper">
      <div class="home-content-left">
        <div class="home-content-wrapper">
          <div class="home-content-box">
            <div class="home-content-header">
              <text>在线报警情况</text>
            </div>
            <div class="home-content-one">
              <div class="content-one-list">
                <div class="rectangle-active-img content-one-item">
                  <text class="content-text">主机在线情况</text>
                  <view class="content-num">
                    <view class="content-num-one">
                      {{ onlineAlarmList.controlOnLine || 0 }}</view>
                    <view class="content-num-two">{{
                      `/${onlineAlarmList.controlCount || 0}`
                    }}</view>
                  </view>
                  <view class="content-total">在线数/总数</view>
                </div>
                <view class="rectangle-active-img content-one-item" @click="handleShowTerminalStateDialog">
                  <text class="content-text">分机在线情况</text>
                  <view class="content-num">
                    <view class="content-num-one">
                      {{ onlineAlarmList.terminalOnLine || 0 }}</view>
                    <view class="content-num-two">
                      {{ `/${onlineAlarmList.terminalCount || 0}` }}</view>
                  </view>
                  <view class="content-total">在线数/总数</view>
                </view>
                <view class="rectangle-active-img content-one-item">
                  <text class="content-text">报警情况</text>
                  <view class="content-num">
                    <view class="content-num-one">{{
                      onlineAlarmList.intraDayAlarmNumber || 0
                    }}</view>
                  </view>
                  <view class="content-total">总数</view>
                </view>
              </div>
            </div>
          </div>
          <div class="home-content-box">
            <div class="home-content-header">
              <text>报警数走势图</text>
            </div>
            <div class="home-content-two">
              <div class="content-two-list">
                <div class="content-title"><text>报警数量</text></div>
                <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
              </div>
            </div>
          </div>
          <div class="home-content-box">
            <div class="home-content-header">
              <text>监区分机在线/离线图</text>
              <div class="state-bar">
                <block v-for="(item, index) in piearr" :key="index">
                  <div class="state-bar-item">
                    <div class="point" :style="{ 'background-color': item.color }"></div>
                    <div class="text">{{ item.name }}</div>
                  </div>
                </block>
              </div>
            </div>
            <div class="home-content-three" :class="{ 'canvas-pie-center': canvasPieState }">
              <div class="content-three-list">
                <div class="content-three-item" v-for="(item, index) in onlineStatusList" :key="index">
                  <text class="rectangle-active-img content-text">{{
                    item.areaName
                  }}</text>
                  <div class="charts-pie-box">
                    <canvas :canvas-id="'canvasPie' + index" class="canvas-pie"
                      @touchstart="touchPie($event, index)"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="home-content-box">
            <div class="home-content-header">
              <text>分机报警数排行</text>
            </div>
            <view class="home-content-four">
              <view class="content-four-list">
                <div class="content-title"><text>报警数量</text></div>
                <canvas canvas-id="canvasColumnE" id="canvasColumnE" class="charts" @touchstart="touchColumnE"></canvas>
              </view>
            </view>
          </div>
        </div>
      </div>
      <div class="home-content-right">
        <scroll-view scroll-y="true" class="right-content-scroll">
          <vtimeLine title="动态信息" :messageList="messageList"></vtimeLine>
        </scroll-view>
      </div>
    </div>
    <tableDialog :isShow="showTerminalStateDialog" title="分机在线详情" :headers="terminalOnlineStateList.headers"
      :contents="terminalOnlineStateList.contents" @scrolltolower="handleTerminalStateScrolltolower"
      @clickHeadItem="handleTerminalStateSort" @close="handleTerminalStateDialogClose"></tableDialog>
  </div>
</template>
<script>
import Api from "@/common/api.js";
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import tableDialog from "@/components/table-dialog/table-dialog.vue";
import uCharts from "@/components/u-charts/u-charts.js";
import { dateFormat, currentPages } from "@/common/utils/util.js";

let canvaColumn = null;
let canvaColumnE = null;
let canvasPieData = null;

export default {
  name: "index",
  components: {
    vtimeLine,
    tableDialog,
  },
  data() {
    return {
      ChartsList: [],
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      serverData: {
        Column: {
          categories: [],
          series: [
            {
              name: "报警数量",
              data: [],
              type: "column",
            },
          ],
        },
      },
      serverDataE: {
        Column: {
          categories: [],
          series: [
            {
              name: "报警数量",
              data: [],
              type: "column",
            },
          ],
        },
      },
      pWidth: "",
      pHeight: "",
      pieData: {
        series: [],
      },
      piearr: {},
      // 在线报警信息
      onlineAlarmList: {},
      // 监区分机在线离线信息
      onlineStatusList: [],
      // 动态信息
      messageList: [],
      // 分机在线列表弹框
      showTerminalStateDialog: false,
      // 分机在线列表
      terminalOnlineStateList: {
        // 列表头
        headers: [
          {
            label: "在线状态",
            key: "status",
            sortConfig: {
              sort: true,
              sortType: "asc",
            },
          },
          {
            label: "分机名称",
            key: "terminalName",
            sortConfig: {
              sort: false,
              sortType: "",
            },
          },
          {
            label: "分机类型",
            key: "terminalType",
            sortConfig: {
              sort: true,
              sortType: "",
            },
          },
          {
            label: "监室名称",
            key: "roomName",
            sortConfig: {
              sort: true,
              sortType: "",
            },
          },
          {
            label: "监区名称",
            key: "areaName",
            sortConfig: {
              sort: false,
              sortType: "",
            },
          },
          {
            label: "分机IP",
            key: "terminalIp",
            sortConfig: {
              sort: false,
              sortType: "",
            },
          },
        ],
        // 列表内容
        contents: [],
        // 获取列表参数
        params: {
          data: {
            areaId: uni.getStorageSync("controlInfo").areaId || "",
            orderField: "status",
            orderType: "asc",
          },
          pageParam: {
            pageIndex: 1,
            pageSize: 500,
          },
        },
        total: 0,
      },
    };
  },
  computed: {
    statusList() {
      let pieList = [];
      this.onlineStatusList.map((item) => {
        pieList.push(item.data);
      });
      return pieList;
    },
    canvasPieState() {
      return (
        this.onlineStatusList.length == 1 || this.onlineStatusList.length == 2
      );
    },
  },
  created() {
    if (!!uni.getStorageSync("baseUrl")) {
      // 获取在线报警情况
      this.getOnlineAlermInfo();
      // 获取分机在线离线图
      this.getAreaOnlineStatus();
      // 获取报警数走势图
      this.getAllAlerm();
      // 获取分机报警数排行
      this.getTerminalAlarm();
      // 获取动态信息
      this.getDynamicInfo();
      // 表格渲染
      this.getServerData();
      // 显示设置
      this.cWidth = uni.upx2px(492);
      this.cHeight = uni.upx2px(195);
    }
  },
  watch: {
    onlineStatusList() {
      this.statusList.map((item, index) => {
        this.pieData.series = [
          { name: "在线", data: item.onLine },
          { name: "离线", data: item.offLine },
        ];
        let chartData = [];
        chartData = this.pieData.series;
        this.showPie(`canvasPie${index}`, chartData);
      });
    },
  },
  methods: {
    // 获取在线报情况
    async getOnlineAlermInfo() {
      const { controlCode } = uni.getStorageSync("controlInfo");
      let params = {
        id: uni.getStorageSync("controlInfo").areaId,
        controlCode,
      };
      let res = await Api.apiCall("get", Api.index.getOnlineAlermInfo, params);
      if (res.state.code == 200) {
        this.onlineAlarmList = res.data;
      }
    },
    // 获取监区分机在线离线信息
    async getAreaOnlineStatus() {
      let params = {
        id: uni.getStorageSync("controlInfo").areaId,
      };
      let res = await Api.apiCall("get", Api.index.getAreaOnlineStatus, params);
      if (res.state.code == 200) {
        this.onlineStatusList = res.data;
      }
    },
    // 获取报警数走势图
    async getAllAlerm() {
      let params = {
        id: uni.getStorageSync("controlInfo").areaId,
      };
      let res = await Api.apiCall("get", Api.index.getAllAlarm, params);
      if (res.state.code == "200") {
        // 获取横坐标日期
        let dateList = [];
        res.data.map((item) => {
          dateList.push(dateFormat("MM-DD", new Date(item.alarmDate)));
        });
        this.serverData.Column.categories = dateList;
        this.serverData.Column.series.map((item) => {
          res.data.map((num) => {
            item.data.push(num.alarmNumber);
          });
        });
        this.getServerData();
      }
    },
    // 获取分机报警数
    async getTerminalAlarm() {
      let params = {
        id: uni.getStorageSync("controlInfo").areaId,
      };
      let res = await Api.apiCall("get", Api.index.getTerminalAlarm, params);
      if (res.state.code == "200") {
        // 获取分机横坐标监室号
        let prisonList = [];
        res.data.map((item) => {
          prisonList.push(item.roomName);
        });
        this.serverDataE.Column.categories = prisonList;
        this.serverDataE.Column.series.map((item) => {
          res.data.map((num) => {
            item.data.push(num.alarmNumber);
          });
        });
        this.getServerData();
      }
    },

    // 获取动态信息
    async getDynamicInfo(showTips) {
      let controlId = uni.getStorageSync("controlInfo").id;
      let res = await Api.apiCall("get", Api.index.getDynamicInfo, {
        controlId: controlId,
      });
      if (res.state.code == 200) {
        if (showTips) {
          currentPages().handleShowToast("刷新成功！");
        }
        this.messageList = res.data;
        this.messageList.map((item) => {
          item.warning = ["500", "700"].includes(item.type) ? true : false;
        });
      }
    },
    // 表格渲染
    getServerData() {
      let Column = { categories: [], series: [] };
      Column.categories = this.serverData.Column.categories;
      Column.series = this.serverData.Column.series;
      this.showColumn("canvasColumn", Column);
      let ColumnE = { categories: [], series: [] };
      ColumnE.categories = this.serverDataE.Column.categories;
      ColumnE.series = this.serverDataE.Column.series;
      this.showColumnE("canvasColumnE", ColumnE);
    },
    // 饼图
    showPie(canvasId, chartData) {
      canvasPieData = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: "pie",
        fontSize: 20,
        legend: { show: false },
        background: "#ffffff",
        pixelRatio: this.pixelRatio,
        series: chartData,
        animation: true,
        width: 330,
        height: 220,
        dataLabel: true,
        padding: [15, 15, 15, 15],
        extra: {
          pie: {
            lableWidth: 15,
          },
        },
      });
      this.ChartsList.push(canvasPieData);
      this.piearr = canvasPieData.opts.series;
    },
    // 点击饼图查看详情
    touchPie(e, index) {
      this.ChartsList[index].showToolTip(e, {
        format: function (item) {
          return item.name + ":" + item.data;
        },
      });
    },
    showColumn(canvasId, chartData) {
      canvaColumn = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: "mix",
        legend: { show: false },
        fontSize: 20,
        color: "#fff",
        background: "#fff",
        pixelRatio: this.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
          scrollShow: true, //新增是否显示滚动条，默认false
          scrollAlign: "left", //滚动条初始位置
          scrollBackgroundColor: "#F7F7FF", //默认为 #EFEBEF
          scrollColor: "#DEE7F7", //默认为 #A6A6A6
          fontColor: "#fff",
          fontSize: 20,
        },
        yAxis: {
          gridColor: "rgba(66,164,255,1)",
          data: [
            {
              fontColor: "#fff",
              max: 30,
              min: 0,
              fontSize: 20,
              format: (val) => {
                return val.toFixed(0);
              },
            },
          ],
        },
        dataLabel: true,
        dataPointShape: true,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          column: {
            type: "group",
            width:
              (this.cWidth * this.pixelRatio * 0.45) /
              chartData.categories.length,
            meter: {
              fillColor: "#1890ff",
            },
          },
          tooltip: {
            bgColor: "#000000",
            bgOpacity: 0.7,
            gridType: "dash",
            dashLength: 8,
            gridColor: "#1890ff",
            fontColor: "#FFFFFF",
            horizentalLine: true,
            xAxisLabel: true,
            yAxisLabel: true,
            labelBgColor: "#DFE8FF",
            labelBgOpacity: 0.95,
            labelAlign: "left",
            labelFontColor: "#666",
          },
        },
      });
    },
    showColumnE(canvasId, chartData) {
      canvaColumnE = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: "mix",
        legend: { show: false },
        fontSize: 20,
        background: "#fff",
        textColor: "#fff",
        pixelRatio: this.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
          scrollShow: true, //新增是否显示滚动条，默认false
          scrollAlign: "left", //滚动条初始位置
          scrollBackgroundColor: "#F7F7FF", //默认为 #EFEBEF
          scrollColor: "#DEE7F7", //默认为 #A6A6A6
          fontColor: "#fff",
          fontSize: 20,
        },
        yAxis: {
          gridColor: "rgba(66,164,255,1)",
          data: [
            {
              fontColor: "#fff",
              max: 30,
              min: 0,
              fontSize: 20,
              format: (val) => {
                return val.toFixed(0);
              },
            },
          ],
        },
        dataLabel: true,
        dataPointShape: true,
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          column: {
            type: "group",
            width:
              (this.cWidth * this.pixelRatio * 0.45) /
              chartData.categories.length,
            meter: {
              fillColor: "#1890ff",
            },
          },
          tooltip: {
            bgColor: "#000",
            bgOpacity: 0.7,
            gridType: "dash",
            dashLength: 8,
            gridColor: "#1890ff",
            fontColor: "#fff",
            horizentalLine: true,
            xAxisLabel: true,
            yAxisLabel: true,
            labelBgColor: "#DFE8FF",
            labelBgOpacity: 0.95,
            labelAlign: "left",
            labelFontColor: "#666",
          },
        },
      });
    },
    touchColumn(e) {
      canvaColumn.showToolTip(e, {
        format: function (item, category) {
          return category + " " + item.name + ":" + item.data;
        },
      });
    },
    touchColumnE(e) {
      canvaColumnE.showToolTip(e, {
        format: function (item, category) {
          return category + " " + item.name + ":" + item.data;
        },
      });
    },
    // 获取分机在线列表
    async getTerminalOnlineStateList() {
      let res = await Api.apiCall(
        "post",
        Api.index.terminalOnlineStatusInfo,
        this.terminalOnlineStateList.params
      );
      if (res.state.code === 200) {
        if (res.data && res.data.length) {
          this.terminalOnlineStateList.total = res.page.total;
          let list = res.data.map((item) => {
            item.status = item.status ? "在线" : "离线";
            item.terminalType = item.terminalType ? "仓外屏" : "仓内屏";
            return item;
          });
          if (res.page.pageIndex === 1) {
            this.terminalOnlineStateList.contents = list;
          } else {
            this.terminalOnlineStateList.contents =
              this.terminalOnlineStateList.contents.concat(list);
          }
        }
      }
    },
    // 显示分机在线列表弹框
    handleShowTerminalStateDialog() {
      this.showTerminalStateDialog = true;
      this.getTerminalOnlineStateList();
    },
    // 分机在线列表上拉加载
    handleTerminalStateScrolltolower() {
      if (
        this.terminalOnlineStateList.contents.length >=
        this.terminalOnlineStateList.total
      ) {
        uni.showToast({
          title: "没有更多的内容",
          icon: "none",
          duration: 3000,
        });
      } else {
        uni.showToast({
          title: "数据加载中",
          icon: "none",
          duration: 3000,
        });
        this.terminalOnlineStateList.params.pageParam.pageIndex += 1;
        this.getTerminalOnlineStateList();
      }
    },
    // 分机在线列表排序
    handleTerminalStateSort(info) {
      if (info.sortConfig && info.sortConfig.sort) {
        // 切换排序字段
        let sortField = info.key;
        // 切换排序方式
        let sortType = info.sortConfig.sortType === "asc" ? "desc" : "asc";
        // 重置列表 & 请求参数
        this.terminalOnlineStateList.contents = [];
        this.resetTerminalOnlineStateListParam(sortField, sortType);
        // 获取列表
        this.getTerminalOnlineStateList();
      }
    },
    // 关闭分机在线列表弹框
    handleTerminalStateDialogClose() {
      this.showTerminalStateDialog = false;
      // 重置列表 & 请求参数
      this.terminalOnlineStateList.contents = [];
      this.resetTerminalOnlineStateListParam();
    },
    // 重置分机在线列表头 & 请求参数
    resetTerminalOnlineStateListParam(sortField, sortType) {
      let curSortField = sortField || "status";
      let curSortType = sortType || "asc";
      this.terminalOnlineStateList.headers.map((item) => {
        item.sortConfig.sortType = "";
        if (item.key === curSortField) {
          item.sortConfig.sortType = curSortType;
        }
        return item;
      });
      this.terminalOnlineStateList.params = {
        data: {
          areaId: uni.getStorageSync("controlInfo").areaId || "",
          orderField: curSortField === "roomName" ? "roomNo" : curSortField,
          orderType: curSortType,
        },
        pageParam: {
          pageIndex: 1,
          pageSize: 500,
        },
      };
    },
  },
};
</script>

<style lang="less">
@import "../../common/less/index.less";
</style>
