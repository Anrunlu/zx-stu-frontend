const title = "知新";

export default function getPageTitle(pageTitle, userType) {
  if (pageTitle) {
    if (userType == "student") {
      return `${pageTitle} | ${title}学生端2.1`;
    }
    if (userType == "teacher") {
      return `${pageTitle} | ${title}教师端2.1`;
    }
    if (userType == "admin") {
      return `${pageTitle} | ${title}管理员端2.1`;
    }
    return `${pageTitle} | ${title}`;
  }
  return `${title}`;
}
