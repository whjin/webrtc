/**
* @param {Array} a
 * @param {Array} b
 * @description 得到两个数组的差集, 两个数组的元素为对象
 */
export const getArrayMinus = function (a, b) {
  let difference = Array.from(new Set([...a].filter(x => [...b].every(y => y.name !== x.name))));
  return Array.from(difference);
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length);
  let i = -1;
  let res = [];
  while (++i < len) {
    const item = arr2[i];
    if (arr1.indexOf(item) > -1) res.push(item);
  }
  return res;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp);
  return timeStr.length > 10;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
export const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {String} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
export const getDate = (timeStamp, startType) => {
  if (timeStamp) {
    return format(new Date(timeStamp), startType);
  }
};
/**
 * @param {Number} d 传入的时间戳
 * @param {String} type 要返回的当天时间的开始还是结束，传入'start'则返回传入日期当天的开始的完整时间，其他则返回当天的结束的完整时间
 */
export const getTheDay = (timeStamp,type) => {
	if(type === 'start')
		return new Date(getDate(timeStamp,'date')); // 当天0点
	else return new Date(new Date(getDate(timeStamp,'date')).getTime() + 24 * 60 * 60 * 1000 -1);	// 当天23:59
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

/**
 * 将时间格式化成时间戳
 * @param strtime 传入的时间
 * @returns {number} 返回时间戳
 */
export const formatDate = (strtime) => {
  var date = new Date(strtime);
  return date.getTime();
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp);
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000);
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp);
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000);
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime);
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp;
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff;
  let resStr = '';
  const dirStr = IS_EARLY ? '前' : '后';
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr;
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr;
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr;
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr;
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp);
  else resStr = getDate(timeStamp, 'year');
  return resStr;
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent;
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer('MSIE')) return 'IE';
  else if (isExplorer('Firefox')) return 'Firefox';
  else if (isExplorer('Chrome')) return 'Chrome';
  else if (isExplorer('Opera')) return 'Opera';
  else if (isExplorer('Safari')) return 'Safari';
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
// export const on = (function () {
//   if (document.addEventListener) {
//     return function (element, event, handler) {
//       if (element && event && handler) {
//         element.addEventListener(event, handler, false);
//       }
//     };
//   } else {
//     return function (element, event, handler) {
//       if (element && event && handler) {
//         element.attachEvent('on' + event, handler);
//       }
//     };
//   }
// })();

/**
 * @description 解绑事件 off(element, event, handler)
 */
// export const off = (function () {
//   if (document.removeEventListener) {
//     return function (element, event, handler) {
//       if (element && event) {
//         element.removeEventListener(event, handler, false);
//       }
//     };
//   } else {
//     return function (element, event, handler) {
//       if (element && event) {
//         element.detachEvent('on' + event, handler);
//       }
//     };
//   }
// })();

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj;
  else {
    let keysArr = Object.keys(obj);
    return keysArr.length;
  }
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
};

export const pageDuel = (nextPage, index, isEmpty) => {
  if (isEmpty) {
    if (index > 1 && nextPage === -1) {
      return index - 1;
    } else {
      return index;
    }
  } else {
    return index;
  }
};

export const yyyymmdd = (dateIn, type) => {
  let yyyy = dateIn.getFullYear();
  let mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  let dd = dateIn.getDate();
  return String(yyyy + '-' + mm + '-' + dd); // Leading zeros for mm and dd
};

export const getDateString = (dateIn) => {
  let d = new Date(dateIn);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};
