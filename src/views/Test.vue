<template>
    <div class="test-container">
        <video id="testVideo" autoplay playsinline controls width="400" height="300"></video>
        <el-button type="primary" @click="startLive">开始</el-button>
        <el-button type="primary" @click="stopLive">结束</el-button>
    </div>
</template>

<script>
import { ElButton } from 'element-plus';
import { convertVideoToImage } from "@/assets/js/utils";

export default {
    name: "Test",
    components: {
        ElButton
    },
    data() {
        return {
            testVideo: null,
            timer: null,
        };
    },
    created() { },
    mounted() {
        this.testVideo = document.getElementById("testVideo");
    },
    beforeDestroy() { },
    methods: {
        startLive() {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                this.testVideo.srcObject = stream;
                this.timer = setInterval(() => {
                    const base64Str = convertVideoToImage(this.testVideo);
                    console.log(base64Str);
                }, 3000);
            });
        },
        stopLive() {
            clearInterval(this.timer);
            this.timer = null;
            this.testVideo.srcObject = null;
        },
    },
};
</script>

<style lang="less">
.test-container {
    margin: 16px;
    display: flex;

    .el-button {
        margin-left: 36px;
    }
}
</style>