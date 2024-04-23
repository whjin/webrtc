export default {
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
