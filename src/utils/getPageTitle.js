const title = "知新";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} | ${title}`;
  }
  return `${title}`;
}
