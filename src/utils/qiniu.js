import { getUploadToken } from "@/api/utils/qiniu";
import * as qiniu from "qiniu-js";

// export async function qiniuFileUpLoad ( username, file, that) {
//   const { data } = await getUploadToken()
//   const uploadToken = data.uploadToken
//   return new Promise((resolve, reject) => {
//     /* 上传文件 */
//     // 上传前准备
//     const key = `${username}-${Date.now()}.${file.name.replace(
//       /.+\./,
//       ''
//     )}`
//     const putExtra = {
//       fname: file.name
//     }

//     // 定义一个观察对象用于显示进度
//     const observer = {
//       next (res) {
//         // 显示上传进度
//         that.progress = res.total.percent / 100
//       },
//       error (err) {
//         reject(err)
//       },
//       complete (res) {
//         resolve(res)
//       }
//     }
//     // 调用qiniu api 上传
//     const observable = qiniu.upload(file, key, uploadToken, putExtra, {})
//     observable.subscribe(observer) // 上传开始
//   })
// }

// 上传文件到七牛
export default async function upload(file, key) {
  // 用时间戳作为文件名
  const { data } = await getUploadToken();
  const token = data.uploadToken;
  return qiniu.upload(file, key, token, {
    fname: key,
  });
}

// export async function qiniuAvatarUpLoad (username, file) {
//   const { data } = await getUploadToken()
//   const uploadToken = data.uploadToken
//   return new Promise((resolve, reject) => {
//     /* 上传文件 */
//     // 上传前准备
//     const key = `${username}-${Date.now()}.${file.type.split('/').pop()}`

//     // 定义一个观察对象用于显示进度
//     const observer = {
//       next (res) {
//       },
//       error (err) {
//         reject(err)
//       },
//       complete (res) {
//         resolve({ success: true, data: res })
//       }
//     }
//     // 调用qiniu api 上传
//     const observable = qiniu.upload(file, key, uploadToken)
//     observable.subscribe(observer) // 上传开始
//   })
// }

// export async function deleteSgFile (filekey) {
//   await deleteSingleFile(filekey)
// }
