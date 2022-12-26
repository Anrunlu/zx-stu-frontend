// 获取对象的 shortId
export function getObjectShortId(object) {
  return object._id.slice(-5).toUpperCase();
}

// 保留小数点后两位，返回数值类型
export function toFixed2(number) {
  return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
}
