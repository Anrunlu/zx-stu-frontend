import { formatTimeWithWeekDay } from "src/utils/time";
import { getObjectShortId } from "src/utils/common";

// 判断教学资源类型
export function getResourceTypeAndIcon(FileType) {
  switch (FileType) {
    case "pdf":
    case "application/pdf":
      return {
        type: "PDF文档",
        icon: "fa-file-pdf",
      };
    case "ppt":
    case "pptx":
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return {
        type: "PPT文档",
        icon: "fa-file-powerpoint",
      };
    case "doc":
    case "docx":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return {
        type: "WORD文档",
        icon: "fa-file-word",
      };
    case "xls":
    case "xlsx":
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return {
        type: "EXCEL文档",
        icon: "fa-file-spreadsheet",
      };
    case "mp4":
    case "avi":
    case "rmvb":
    case "rm":
    case "flv":
    case "wmv":
    case "video/mp4":
    case "video/x-msvideo":
    case "video/vnd.rn-realvideo":
    case "video/x-flv":
    case "video/x-ms-wmv":
      return {
        type: "视频",
        icon: "fa-file-video",
      };
    case "mp3":
    case "wav":
    case "m4a":
    case "audio/mp3":
    case "audio/wav":
    case "audio/x-m4a":
      return {
        type: "音频",
        icon: "fa-file-audio",
      };
    case "zip":
    case "rar":
    case "7z":
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/x-rar-compressed":
    case "application/x-7z-compressed":
      return {
        type: "压缩包",
        icon: "fa-file-zipper",
      };
    case "txt":
    case "text/plain":
      return {
        type: "文本",
        icon: "fa-file-lines",
      };
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return {
        type: "图片",
        icon: "fa-file-image",
      };
    default:
      return {
        type: "其他",
        icon: "fa-file",
      };
  }
}

// 预处理教学资源列表
export function preProcessTeaResourceList(teaResourceList) {
  teaResourceList.forEach((teaResource) => {
    teaResource.createdAt = formatTimeWithWeekDay(teaResource.createdAt);
    teaResource.shortId = getObjectShortId(teaResource);
    teaResource.resourceTypeAndIcon = getResourceTypeAndIcon(
      teaResource.filetype
    );
    teaResource.downloadUrl = teaResource.fileUrl.match(
      /(cyberdownload.anrunlu.net\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
    )[0];
    teaResource.downloadUrl = "https://" + teaResource.downloadUrl;
  });
}
