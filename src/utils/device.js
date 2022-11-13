// 判断是否移动端设备
export function isMobile() {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
  if (flag) {
    return true;
  } else {
    return false;
  }
}

// 判断是否苹果设备
export function isAppleDevice() {
  const flag = navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i);
  if (flag) {
    return true;
  } else {
    return false;
  }
}
