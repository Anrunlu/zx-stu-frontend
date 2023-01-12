// 获取对象的 shortId
export function getObjectShortId(object) {
  return object._id.slice(-5).toUpperCase();
}

// 保留小数点后两位，返回数值类型
export function toFixed2(number) {
  return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
}

// base64 转 blob
export function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0) {
    byteString = atob(dataURI.split(",")[1]);
  } else {
    byteString = unescape(dataURI.split(",")[1]);
  }

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}
