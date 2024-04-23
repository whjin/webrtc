<template>
  <view>
    <view class="main-area">
      <view class="mood-title">
        <text>心情记录</text>
        <button type="primary" class="button" @click="openMoodStatusModal">
          登记
        </button>
      </view>
      <view class="uni-flex uni-row">
        <view class="flex-item uni-column" style="font-size: 25upx;">
          <view class="flex-item flex-item-V flex-item-view">
            <view>第一周</view>
          </view>
          <view class="flex-item flex-item-V flex-item-view">
            <view>第二周</view>
          </view>
          <view class="flex-item flex-item-V flex-item-view">
            <view>第三周</view>
          </view>
          <view class="flex-item flex-item-V flex-item-view">
            <view>第四周</view>
          </view>
          <view class="flex-item flex-item-V flex-item-view">
            <view>第五周</view>
          </view>
        </view>
        <view class="flex-item" style="width: 1200upx;padding-right: 27.77upx;">
          <view class="uni-flex" style="text-align: center;" id="weekList">
            <view class="uni-flex-item table-th">
              <view>星期一</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期二</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期三</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期四</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期五</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期六</view>
            </view>
            <view class="uni-flex-item table-th">
              <view>星期日</view>
            </view>
          </view>
          <view v-if="isDataLoading" style="width: 100%; height: 100%; text-align: center; line-height: 500upx;">数据加载中...
          </view>
          <view class="uni-flex table-td-divider" v-for="(week, index) in calendar" :key="index" v-else>
            <view class="uni-flex-item table-td" v-for="(day, index2) in week" :key="index2">
              <view style="height: 90%;" class="item-day"
                :class="{ 'item-today': compareIsSameDate(day.timestamp, new Date().getTime()) }">
                <view v-if="moodStatusList[day.moodId]" class="status-view">{{ moodStatusList[day.moodId].value }}</view>
                <view style="
                    text-align: center;
                    font-size: 30upx;
                    font-family: Microsoft YaHei;
                    font-weight: bold;">
                  {{ day.date }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <neil-modal :show="showMoonStatus" @close="closeMoodStatusModal" :autoClose="true">
      <view class="uni-flex uni-row">
        <view v-for="(item, index) in moodStatusList" :key="index" @click="changeMoodStatus(item)"
          style="margin-left: 13.88upx;" class="flex-item">
          <view class="uni-flex">
            <image :src="item.path" style="width: 70upx; height: 70upx;"
              :class="item.id === selectedMoodId ? 'symptoms-select' : 'symptoms'"></image>
          </view>
          <view class="info" style="text-align: center;">{{ item.value }}</view>
        </view>
      </view>
      <button type="primary" @click="confirm()" style="width: 130upx; line-height: 50upx;font-size: 18upx;">
        确认
      </button>
    </neil-modal>
  </view>
</template>

<script>
import Api from '@/common/api.js';
import { mapState } from "vuex";
import { getDate } from '@/common/utils/tools.js';
import neilModal from "@/components/neil-modal/neil-modal.vue";
import { currentPage } from "@/common/utils/util.js";

export default {
  components: {
    neilModal
  },
  data() {
    return {
      isDataLoading: true,
      selectedMoodId: "",
      showMoonStatus: false,
      // 心情列表
      moodStatusList: [
        {
          id: 0,
          path: "/static/images/talk/0.png",
          value: "喜",
        },
        {
          id: 1,
          path: "/static/images/talk/1.png",
          value: "怒",
        },
        {
          id: 2,
          path: "/static/images/talk/2.png",
          value: "忧",
        },
        {
          id: 3,
          path: "/static/images/talk/3.png",
          value: "思",
        },
        {
          id: 4,
          path: "/static/images/talk/4.png",
          value: "悲",
        },
        {
          id: 5,
          path: "/static/images/talk/5.png",
          value: "恐",
        },
        {
          id: 6,
          path: "/static/images/talk/6.png",
          value: "惊",
        },
      ],
      moodList: [],
      // 日历
      calendar: [],
      calendarOffset: 0,
      saveParams: {
        moodField: '',
        recordTime: ''
      },
      getMoodListParams: {
        startTime: '',
        endTime: ''
      },
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: state => state.app.personInfo
    }),
    // 监室ID
    roomId() {
      return uni.getStorageSync('terminalInfo').roomId;
    }
  },
  methods: {
    // 设置日历偏移量
    setCalendarOffset() {
      let day = new Date();
      this.calendarOffset = day.getDate() - 14 - ((day.getDay() || 7) - 1);
    },
    // 设置获取列表参数
    setMoodListParams() {
      let day = new Date();
      this.saveParams.recordTime = day.getTime();
      this.getMoodListParams.endTime = day.getTime();
      day.setDate(this.calendarOffset - 1);
      this.getMoodListParams.startTime = day.getTime();
    },
    // 获取心情列表
    async getMoodList() {
      let params = Object.assign({}, {
        rybh: this.personInfo.rybh
      }, this.getMoodListParams);
      let res = await Api.apiCall('post', Api.prisoner.mood.getList, {
        data: params
      }, true);
      if (res.state.code == 200) {
        this.moodList = res.data;
        this.setCalendar();
        this.isDataLoading = false;
      }
    },
    // 设置日历
    setCalendar() {
      let it = new Date();
      it.setDate(this.calendarOffset); //偏移量
      let aWeek = [];
      for (let i = 0; i < 42; i++) {
        if (i !== 0 && i % 7 === 0) {
          this.calendar.push(aWeek);
          aWeek = [];
        }
        let aDay = this.setMood(it);
        it.setDate(it.getDate() + 1);
        aWeek.push(aDay);
      }
    },
    setMood(it) {
      let aDay = {};
      let day = new Date(it);
      aDay['date'] = day.getDate();
      aDay['moodId'] = '';
      aDay['timestamp'] = day.getTime();
      this.moodList.forEach(item => {
        if (this.compareIsSameDate(aDay.timestamp, item.recordTime)) {
          aDay.moodId = Number(item.moodField);
        }
      });
      return aDay;
    },
    // 判断两个时间戳是否同一天
    compareIsSameDate(timestamp1, timestamp2) {
      if (getDate(timestamp1, 'date') === getDate(timestamp2, 'date')) {
        return true;
      } else {
        return false;
      }
    },
    // 登记心情
    async saveMood() {
      let params = Object.assign({}, {
        rybh: this.personInfo.rybh,
        roomId: this.roomId
      }, this.saveParams);
      let res = await Api.apiCall('post', Api.prisoner.mood.save, params, true);
      if (res.state.code == 200) {
        uni.showToast({
          title: '登记成功'
        });
      }
    },
    // 登记确认
    confirm() {
      this.calendar[2].forEach(item => {
        if (this.compareIsSameDate(item.timestamp, new Date().getTime())) {
          item.moodId = this.selectedMoodId;
        }
      });
      this.saveParams.moodField = this.selectedMoodId;
      this.selectedMoodId = "";
      this.closeMoodStatusModal();
      this.saveMood();
    },
    // 打开心情登记窗口
    openMoodStatusModal() {
      let todayMoodId = 0;
      this.calendar[2].forEach(item => {
        if (this.compareIsSameDate(item.timestamp, new Date().getTime())) {
          todayMoodId = item.moodId;
        }
      });
      if (todayMoodId === 0 || todayMoodId) {
        return uni.showToast({
          title: '今日已登记'
        });
      }
      this.showMoonStatus = true;
    },
    // 关闭心情登记窗口
    closeMoodStatusModal() {
      this.showMoonStatus = false;
    },
    // 选择心情
    changeMoodStatus(item) {
      this.selectedMoodId = item.id;
    }
  },
  mounted() {
    try {
      this.setCalendarOffset();
      this.setMoodListParams();
      this.getMoodList();
    } catch (error) {
    }
    // 开启倒计时
    currentPage().countTimer();
  },
  destroyed() {
  }
};
</script>

<style scoped>
.mood-title {
  width: 100%;
  box-sizing: border-box;
  height: 83.33upx;
  padding: 0 27.77upx;
  display: flex;
  align-items: center;
  position: relative;
}

.mood-title text {
  white-space: nowrap;
  color: #35fffa;
  font-size: 27.77upx;
  font-weight: bold;
}

.table-td-divider .table-td {
  height: 86upx;
}

.flex-item .table-td-divider {
  border: rgba(17, 62, 141, 0) 1px solid;
}

.flex-item-view {
  margin-bottom: 9upx;
  margin-left: 27.77upx;
  height: 83upx;
  width: 168upx;
  text-align: center;
  background: rgba(19, 42, 78, 0.4);
}

.flex-item-view view {
  padding-top: 23upx;
}

.uni-flex .table-th {
  background: rgb(17, 62, 141, 0);
}

.button {
  width: 84upx;
  height: 42upx;
  font-size: 20upx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 27.77upx;
}

.uni-flex .table-th {
  text-align: center;
}

.item-day {
  border-top: rgba(255, 255, 255, 0.3) 0.5upx solid;
}

.item-today {
  background: rgba(85, 170, 255, 0.3);
}

.symptoms {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABLCAYAAAAf4PsCAAAIp0lEQVR4Xu2cva8dVxXF197nzP14/pAhsSGEgoKGAptINJiCHkoIaZBDQ/4C6FKkgAr+AtJgSxRJ3IYaCcmiQMh+Lihog5ERiS38Pu67c87ZaO2Za/zQszzPQyZc64x1PXPnnXdm7m/WWXufeXe2oC6TEZDJjlQPhAp7QhFU2P8fsC3gK79v8NI5xd4q4EIUHM0V7aEiB8H58+i2D7sLVs4LliooIigrwQGAhQryWqHzOF9YY2eaxhBjsxOiLUJcfG4+m12YNbKj88WOzC6ei4sLF+Ly7FlZLOcag5XGUKIJpEjRefQuA4AIBbQgpWL5IMOsqPHIEC3FNB2s2nbvUFcPH+bVgwdldbRKR+1+u17vy9Hqk3Wb9nKLtEqyTkkepSQi7epgnRDXGbqwx9dAi+FoXoD9bpdmQzMvCNlwuCy+b7Yu2FsVnF1k3F8bPrqbgLcSIP/pB3iKjbxzbwffuvgLKfYjpPIy2GUxf0kGYN227/ft/tTYNd9v1jwAf9YC0ppv8/ACgaogRkETBbOZYtEoPr8jeOmM+PrcXLCMghAFiwZ4ZQl8dQe4OOe5dIdQAA9a4K8HwL1D4LAFcjYcJMOjI8ODleDj/YJP9jIOjwraZP5aJ0PJBv9HqVAj0S8hjJeS+/zVD3zt131bPzD3icA220G6Ewr6T1P5Lf744G28c2nvyYFzso38wX519t79n7x6689/DweHydXqR/dT27AU3+ARer4qZpsLsOHPXzE/M5UiKuafIAhiUJ1HkXlUjUFCozpfRj2zM9PlmSjzWdAQVUyUrWUnCs42kGVQSNhQMCO4fyXYwbqg8CKUYimbrdtihwfrsr/flqODVHKbS1lnK20qZd2apWKCXIKZwXolWTENMLPucyoPw4/HMcPFV1RLcc6+q/tBR0DN0s4y3rv62it7X7z0Lr4Tfvps2Lfs/tdufvhxQ9BPX0xQzEovc540z8vl0qOW48NoQnscd6geNkQJtdO5OHkR5YdyqT813rU7y/iX73/vZXxbLg2BbZdv3Lz7lDM2oXysFNcAx6PApFAdDtqpd36yzYvTBaQDa/Q9DkvlOOOiaqI0jhOh7177wddxdTMCOw4nX51bdiJsQQ+5cG1F3Pg4Boshu6jdzLUbVFsNm75ZHpuJCALhK0GrKd+IQpVSV4NDP7aMgu2gS8mWSxFLxc2RoAvfP+l7cPYbT9tWbRvHqwdBCpKQGT9c0OqgXdlRJaiKavhv4M8N+zjonD26EHJxKyF4ugrthVuMLtut7c4/PBSSrPF/2ggtxZXtgFUkqkkIJwF/XtgGxvdUsljOllMRGnXJrm6UTMlbp25mI5S1mTBQbvHC3B7MQhwygTM2qkCZDhF2oGcHCT3wqAESN4kjngt2BzZlZCZUOUv29wWZqs5doKTC3bS7XITgC1k/zv+2jDonTB1rIvdw6Olq79GQoHD7iGqBBh4CQgzCeZgogT8XbENJyQohM1HlOmdkqjq7h4OWQmV3DtLlrD5XKFsN25hgO2oaiYhR1m4j0T26Ax7UQgiqIVhogmgI0MjpkZxa2e7VOSfklraRqG4UwnbPzrCWiAu5s61Q6ELY4v69ZXo+drr0adA8TMUCJ2PKYOheAmk64CEqCNhVHSIIPITItqeGTbCW2yQlp5IT17kHX1BSZpB0C+EcGVS7J97u3S+EZ3f5dD+hcSV3VqKq4LSX/h2aYBo43Y2mIUpoIi/AaWHvomwU3SaknAiY815aiWckiRlJpl8X2kix7Ip25+7mNdup7s18xrVN/whuI7zxYRpUYp+J0EJCQ+sIiK7s6ArXhrAvn2JS88EuckvrSJYSQSdzG+GrzfBAmanwx6BRujSQZq1bno2ULr/uZpDU8ga40rM9QAZCdYWH6F4tMUYEvpq4e+314bCv3PjgDi2EsEuilVDdtI7MuzkOW3iDEwyUhE7QibNHn+5srao3zu3zF+EskkHRgROyUN0xOmzRPijGGEybqLFx2LSSO9devzJY2Veuv3en5NxKXvOWWZKcCT1LnwJ2wZKBkhZC4Lyj7F5icDt5AfJsCT3wLjC6hVDVStjRUz4LMWhsgoUQNTTRwixqCM2dN984Dez3b5e0dvuQ1LqVWKGdUNUMnJmZSbHSdkHSMu+P+HrbQW/E7RMbCbwv4vd1u+DYMANRCcxCmOpR3Z2FGJWtMWqcxTtv/vAbg5V9+fr7t81hty1SSkI78eCYUi6pKJVN6ATO+8CcSfp9ky7l8zC5xbMaZtce4zv30ELAnmp7VhJKiCH4pCZS0VR4BD1bm0biLO6eCvZv3rttJbXIa3p1B5s2UlLipsPm9N3VnTsLOQab6eD2LgyIx2D3oB229LBjVHMlPwE7zKJobHZ//MYplF1hV9hTjZWq7KlI+98fq41MhrvCngx1VfaEqCvsCrvm2TXPHj0KaoAcjXB4BxX2cFajW1bYoxEO76DCHs5qdMsKezTC4R1U2MNZjW5ZYY9GOLyDCns4q9EtK+zRCId3UGEPZzW6ZYU9GuHwDirs4axGt6ywRyMc3kGFPZzV6JYV9miEwzuosIezGt2ywh6NcHgHFfZwVqNbVtijEQ7voMIezmp0y2lh168MT/eV4SvX65fhJ/syfH3Mo3vqoHuu5tN+zKM+wDTdA0yXb9RH8yZ7NO/yjZv1odPpHjq9ebc+Tj3d49R3a6GAKQsFsCJOLYExTQkMTsNqcZfpiruQdy1bNFXZIlf3scpntSDXp1mQy2/q1FJzE5Wa29xCq0UUJyqi+MQ9y1oe9H9cHrQWvnXvnKbw7S/P3bv/1pdv/elvz6g0vBG8V6j0SpVeYZi1nbe49m1fWthLWIt65cq+bO0zK+mzwvBHV7/56qMvfeHXuCo/e/KvGCf/8u9sjgv4OYBrAI6VJR79J5AXv4N/ALiBh3gb35WjZ8N+8YF8Jp/wmcPiMzmrF/SgFfaEF7bCnhD2vwHZwt4tKoKY0wAAAABJRU5ErkJggg==');
  background-size: 100% 100%;
  width: 61.11upx;
  height: 59.02upx;
  color: #bbbbbb;
  text-align: center;
  line-height: 59.02upx;
}

.symptoms-select {
  background-image: url('data:image/png;base64,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');
  background-size: 100% 100%;
  width: 61.11upx;
  height: 59.02upx;
  color: #ffffff;
  text-align: center;
  line-height: 62.5upx;
}

.status-view {
  text-align: center;
  line-height: 20upx;
  font-size: 17.5upx;
  height: 25upx;
  color: #000000;
  /* background-color: rgba(170, 255, 255, 76); */
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAzCAYAAADSDUdEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVBNzA0OTlGNzU4RTExRUE5MzlDRTRBREUzODdGMzAxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVBNzA0OUEwNzU4RTExRUE5MzlDRTRBREUzODdGMzAxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUE3MDQ5OUQ3NThFMTFFQTkzOUNFNEFERTM4N0YzMDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUE3MDQ5OUU3NThFMTFFQTkzOUNFNEFERTM4N0YzMDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5GCOXMAAAI80lEQVR42uyd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');
  background-size: 100% 100%;
  font-family: Microsoft YaHei;
  font-weight: bold;
}
</style>
