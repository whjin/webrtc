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

// 时间转换（秒数转时分秒）
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

// 数组去重
export const unique = (arr) => {
  if (!Array.isArray(arr)) {
    return;
  }
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) === -1) {
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

// 读取对讲录像信息
export const readDirectory = (dirPath) => {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      dirPath,
      (entry) => {
        let directoryReader = entry.createReader();
        directoryReader.readEntries((entries) => {
          resolve(entries);
        });
      },
      (err) => {
        reject(err);
      }
    );
  });
};

export const currentPages = () => {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
};