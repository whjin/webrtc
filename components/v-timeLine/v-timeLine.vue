<template>
  <div class="timeline-container">
    <div class="timeline-header">{{ title }}</div>
    <div class="timeline-list">
      <div class="timeline-item">
        <block v-for="(item, index) in messageList" :key="index">
          <div class="timeline-border"></div>
          <div class="timeline-box">
            <div class="timeline-index">
              <div class="timeline-text">{{ index + 1 }}</div>
            </div>
            <div class="timeline-content">
              <div class="timeline-title" :style="{ color: item.warning ? '#e30c12' : '#35fffa' }">
                {{ item.title }}
              </div>
              <div class="timeline-date">
                <common-icons type="icontime" size="16" :color="item.warning ? '#e30c12' : '#35fffa'"></common-icons>
                <text class="timeline-time" :style="{ color: item.warning ? '#e30c12' : '#35fffa' }">{{ item.dateTime }}</text>
              </div>
            </div>
          </div>
        </block>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-timeLine",
  props: {
    title: {
      type: String,
      required: true,
    },
    messageList: {
      type: Array,
      required: false,
    },
  },
};
</script>

<style lang="less">
.timeline-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .timeline-header {
    height: 30upx;
    line-height: 30upx;
    font-size: 23upx;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #35fffa;
    padding: 6.23upx 0;
    position: absolute;
    top: 0;
  }
  .timeline-list {
    padding-top: 40upx;
    height: 100%;
    box-sizing: border-box;
    .timeline-item {
      height: 100%;
      overflow: auto;
      .timeline-border {
        width: 100%;
        height: 3upx;
        background: url(../../static/images/timeline/border.png);
        background-size: 100% 100%;
      }
      .timeline-box {
        display: flex;
        align-items: center;
        margin: 3upx 0;
        .timeline-index {
          width: 24upx;
          height: 24upx;
          background: url(../../static/images/timeline/index.png);
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .timeline-text {
            font-size: 12upx;
            font-family: Microsoft YaHei, sans-serif;
            font-weight: 400;
            text-align: center;
            color: #13baef;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .timeline-content {
          margin-left: 10upx;
          line-height: 24upx;
          .timeline-title {
            width: 200upx;
            white-space: nowrap;
            font-size: 14upx;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #35fffa;
            overflow: auto;
          }
          ::-webkit-scrollbar {
            display: none;
          }
          .timeline-date {
            display: flex;
            align-items: center;
            .timeline-time {
              width: 100%;
              font-size: 13upx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              margin-left: 8upx;
            }
          }
        }
      }
    }
  }
}
</style>
