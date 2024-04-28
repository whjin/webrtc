export const isValidJSON = text => {
    try {
        JSON.parse(text);
        return true;
    } catch (err) {
        return false;
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

// video To base64
export const convertVideoToImage = (video) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let image = canvas.toDataURL("image/jpeg");
    return image;
};