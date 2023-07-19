import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取学生所有作业知识点得分情况
export function apiGetStuKnowledgeScoreByCourse(data) {
  return loadingFn(request)({
    url: "/tea/stu-knowledge/getStudentKnowledgeMasterByCourse",
    method: "POST",
    data,
  });
}
