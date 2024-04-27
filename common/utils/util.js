export const clear = (str) => {
  str = str.replace(/,/g, "");
  return str;
};

export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length == 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};

/**
 * @description 判断字符串是否为空或者全部都是空格
 * @param {str} 要处理的字符串
 */
export const isNullStr = (str) => {
  if (str == "") return true;
  if (str == null) return true;
  if (str == undefined) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
};

/**
 * @description 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * @param 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj;
  else {
    let keysArr = Object.keys(obj);
    return keysArr.length;
  }
};

// 格式化日期类型,fmt格式可选择
export const dateFormat = (fmt, date) => {
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "D+": date.getDate().toString(), // 日
    "h+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString(), // 秒
    "ms+": date.getMilliseconds().toString(), // 毫秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
};

// 秒数转换为时分秒hh:mm:ss
export const timeFormat = (sec) => {
  let minite =
    Math.floor((sec / 60) % 60) < 10
      ? "0" + Math.floor((sec / 60) % 60)
      : Math.floor((sec / 60) % 60);
  let second =
    Math.floor(sec % 60) < 10
      ? "0" + Math.floor(sec % 60)
      : Math.floor(sec % 60);
  if (sec < 3600) {
    return `${minite}:${second}`;
  } else {
    let hour =
      Math.floor(sec / 3600) < 10
        ? "0" + Math.floor(sec / 3600)
        : Math.floor(sec / 3600);
    return `${hour}:${minite}:${second}`;
  }
};

// 时钟倒计时
export const countDown = (sec) => {
  let hour = Math.floor((parseInt(sec) / 3600) % 24)
    .toString()
    .padStart(2, "0");
  let minute = Math.floor((parseInt(sec) / 60) % 60)
    .toString()
    .padStart(2, "0");
  let second = Math.floor(parseInt(sec) % 60)
    .toString()
    .padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

// 获取本周所有日期
export const getWeekDate = () => {
  let weekDateList = [];
  let weeks = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  for (let i = 0; i < 7; i++) {
    let date = new Date();
    let week = weeks[i];
    let nowDate = date.setDate(date.getDate() - 1 + i);
    let formatDate = dateFormat("MM-DD", new Date(nowDate));
    let weekDate = `${formatDate}(${week})`;
    weekDateList.push(weekDate);
  }
  return weekDateList;
};

// 时钟
export const clock = () => {
  let hour = dateFormat("hh", new Date());
  let minute = dateFormat("mm", new Date());
  let second = dateFormat("ss", new Date());
  return `${hour}:${minute}:${second}`;
};

export const getDate = (timeStamp, startType) => {
  if (timeStamp) {
    return format(new Date(timeStamp), startType);
  }
};

const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

export const format = (d, startType) => {
  const year = d.getFullYear();
  const month = getHandledValue(d.getMonth() + 1);
  const date = getHandledValue(d.getDate());
  const hours = getHandledValue(d.getHours());
  const minutes = getHandledValue(d.getMinutes());
  const second = getHandledValue(d.getSeconds());
  let resStr = '';
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second;
  else if (startType === 'date') resStr = year + '-' + month + '-' + date;
  else if (startType === 'time') resStr = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + second + '.000+08:00';
  else if (startType === 'mouth-day') resStr = month + '-' + date;
  else if (startType === 'minutes') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes;
  else resStr = month + '-' + date + ' ' + hours + ':' + minutes;
  return resStr;
};

// 数组去重
export const unique = (arr) => {
  if (!Array.isArray(arr)) {
    return;
  }
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) == -1) {
      result.push(arr[i]);
    }
  }
  return result;
};

// 数组对象去重
export const uniqueArr = (arr, key) => {
  if (!Array.isArray(arr)) {
    return;
  }
  let map = new Map();
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!map.has(arr[i][key])) {
      map.set(arr[i][key], arr[i]);
    }
  }
  return [...map.values()];
};

// 浮点数四舍五入保留2位小数
export const formatFloat = (num, pos) => {
  return Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos);
};

// 字符串转整型数组
export const str2Array = (str) => {
  let result = [];
  let arrList = str.split(",");
  for (let i = 0; i < arrList.length; i++) {
    result.push(parseInt(arrList[i]));
  }
  return result;
};

/**
 * 函数防抖
 * @param {Function} func 需要处理的函数
 * @param {Number} wait 执行间隔(毫秒)
 * @param {Boolean} immediate 是否立即执行一次
 * @returns
 */
export const debounce = (func, wait = 1000, immediate = true) => {
  let timer;
  return function () {
    let context = this,
      args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
};

/**
 * 函数节流
 * @param {Function} fn 需要被处理的函数
 * @param {Number} wait 执行间隔（毫秒）
 * @returns
 */
export const throttle = (fn, wait = 3000) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
};

/**
 * 删除文件夹
 */
export const removePrivateDoc = () => {
  // #ifdef APP-PLUS
  plus.io.requestFileSystem(
    plus.io.PRIVATE_DOC, // 应用私有文档目录常量
    (fs) => {
      // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
      fs.root.removeRecursively(
        () => { },
        (e) => {
          console.log(`删除应用私有文档目录失败，${JSON.stringify(e)}`);
        }
      );
    }
  );
  // #endif
};

// 计算两个时间相差的秒数
export const convertTimeToSeconds = time => {
  let nowTime = new Date().getTime();
  let date = new Date();
  let arr = time.split(":");
  date.setHours(parseInt(arr[0]));
  date.setMinutes(parseInt(arr[1]));
  let endTime = new Date(date).getTime();
  let ret = Math.ceil((endTime - nowTime) / 1000);
  return (typeof ret == "number") && ret > 0 ? ret : false;
}; 