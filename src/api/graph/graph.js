import { request } from "src/boot/axios";

export function editKG(data) {
  return request({
    url: "/graph/editkg",
    method: "post",
    data,
  });
}

// 获取导图详情
export function apiGetCourseMindDetails(courseMindId) {
  return loadingFn(request)({
    url: `/tea/courseMind/${courseMindId}`,
    method: "GET",
  });
}
