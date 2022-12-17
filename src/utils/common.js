// 获取对象的 shortId
export function getObjectShortId(object) {
  return object._id.slice(-5).toUpperCase();
}
