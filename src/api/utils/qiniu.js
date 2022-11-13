import { request } from "src/boot/axios";

export function getUploadToken() {
  return request({
    url: "auth/qiniu/uploadToken",
    method: "get",
  });
}

export function deleteSingleFile(filekey) {
  return request({
    url: "auth/qiniu/deleteSingleFile",
    method: "delete",
    params: { filekey },
  });
}
