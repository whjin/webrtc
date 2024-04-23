import { Base64 } from "./base64.js";
/**
 * js 日期格式化
 * 传时间戳参数进行时间戳转换，不传时返回当前时间（返回年月日时分秒格式）
 * @param {Object} timeStamp 时间戳参数 非必传
 * @param {Object} format 格式化样式 非必传
 */
function getTimeStampDatetime(format = "yyyy-MM-dd HH:mm:ss", timeStamp) {
  let nowDatetime = new Date();
  timeStamp ? (nowDatetime = new Date(timeStamp)) : (nowDatetime = new Date());
  return nowDatetime.Format(format);
}
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

// 获取日志文件名称
function getLogFileName() {
  // 今日日期
  let nowDate = getTimeStampDatetime("yyyy-MM-dd");
  // 当前时间精确到秒
  let nowTime = getTimeStampDatetime("yyyy-MM-dd HH:mm:ss:S");
  // 文件名称
  let fileName = "app-log.text";
  fileName = nowDate + "log.text";
  // 内容换行符(自定义)
  let newLine =
    "\r\n" +
    "======================================" +
    "\r\n" +
    nowTime +
    " =>>>" +
    "\r\n";
  return {
    newLine: newLine,
    fileName: fileName,
  };
}

/**
 * 日志内容写入
 * 文件写入手机地址，华为Android/data/应用包名/documents/app-log/2021-01-17log.text
 * @param {Object} params 写入内容
 * @param {Object} encryption 是否加密
 */
function writeLog(params, encryption) {
  let text = JSON.stringify(params);
  plus.io.requestFileSystem(
    plus.io.PUBLIC_DOCUMENTS,
    function (fs) {
      // 可通过fs操作PUBLIC_DOCUMENTS文件系统
      // 创建日志文件夹
      fs.root.getDirectory(
        "app-log",
        {
          create: true,
          exclusive: false,
        },
        function (dir) {
          // 创建或写入文件
          // console.log(
          //   "日志写入地址：" + dir.fullPath + getLogFileName().fileName
          // );
          dir.getFile(
            getLogFileName().fileName,
            {
              create: true,
            },
            function (fileEntry) {
              // 找到文件准备写入操作
              fileEntry.file(function (file) {
                fileEntry.createWriter(
                  function (writer) {
                    writer.seek(file.size - 1);
                    // 换行插入日志文件
                    if (encryption) {
                      writer.write(
                        getLogFileName().newLine + " " + Base64.encode(text)
                      );
                    } else {
                      writer.write(getLogFileName().newLine + text);
                    }
                  },
                  function (e) {
                    console.error("日志写入错误", error);
                  }
                );
              });
            }
          );
        },
        function (err) {
          console.error("文件夹创建失败", err);
        }
      );
    },
    function (error) {
      console.error("文件系统进入错误", error);
    }
  );
}

/**
 * 日志文件上传
 * @param {*} fileDate 需要上传的log文件日期 xxxx-xx-xx
 */
function uploadLogFile(fileDate) {
  let date = fileDate || getTimeStampDatetime("yyyy-MM-dd");
  const baseUrl = uni.getStorageSync("baseUrl");
  const { terminalCode: terCode } = uni.getStorageSync("terminalInfo");
  uni.uploadFile({
    url: baseUrl + "terminal/testing/uploadTer", // 后端api接口
    filePath: `file:///storage/emulated/0/Android/data/com.gksc.terminal/documents/app-log/${date}log.text`, // log文件路径
    name: "files", // 后端通过'files'获取上传的文件对象
    formData: {
      fileType: "LOG_FILE",
      terCode,
    },
    header: {
      "Content-Type": "multipart/form-data",
    },
    success: (res) => {
      if (res.data.state.code == 200) {
      }
    },
  });
}

export default {
  writeLog,
  uploadLogFile,
};
