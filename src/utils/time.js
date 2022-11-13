/**
 * 格式化时间1
 * @param {后端返回的标准时间} datatime
 * @returns 格式：2021-03-22/22:00/周一
 */
export function formatTimeWithWeekDay(datetime) {
  const Time = new Date(datetime);
  const y = Time.getFullYear(); // 年
  let m = Time.getMonth() + 1; // 月
  m = m < 10 ? "0" + m : m;
  let d = Time.getDate(); // 日
  d = d < 10 ? "0" + d : d;
  let h = Time.getHours(); // 时
  h = h < 10 ? "0" + h : h;
  let minute = Time.getMinutes(); // 分
  minute = minute < 10 ? "0" + minute : minute;
  const weekDay = getWeekDate(datetime);

  const dStr = `${y}-${m}-${d}/${h}:${minute}/${weekDay}`;
  return dStr;
}

/**
 * 格式化时间2
 * @param {后端返回的标准时间} datatime
 * @returns 格式：2021-03-22/22:00:00/周一
 */
 export function formatTimeWithWeekDayAndSecond(datetime) {
  const Time = new Date(datetime);
  const y = Time.getFullYear(); // 年
  let m = Time.getMonth() + 1; // 月
  m = m < 10 ? "0" + m : m;
  let d = Time.getDate(); // 日
  d = d < 10 ? "0" + d : d;
  let h = Time.getHours(); // 时
  h = h < 10 ? "0" + h : h;
  let minute = Time.getMinutes(); // 分
  minute = minute < 10 ? "0" + minute : minute;
  let second = Time.getSeconds(); // 秒
  second = second < 10 ? "0" + second : second;
  const weekDay = getWeekDate(datetime);

  const dStr = `${y}-${m}-${d}/${h}:${minute}:${second}/${weekDay}`;
  return dStr;
}

/**
 * 获取星期
 * @param {后端标准时间格式} datetime
 * @returns 星期几
 */
function getWeekDate(datetime) {
  let weeks = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  const now = new Date(datetime);
  const day = now.getDay();
  let weekDay = weeks[day];
  return weekDay;
}

/**
 * 获取日期和星期
 * @param {后端标准时间格式} datetime
 * @returns 10-01
 */
export function getMonthAndDayWithWeekDay(datetime) {
  const Time = new Date(datetime);
  let m = Time.getMonth() + 1; // 月
  m = m < 10 ? "0" + m : m;
  let d = Time.getDate(); // 日
  d = d < 10 ? "0" + d : d;
  const weekDay = getWeekDate(datetime);

  return `${m}-${d} ${weekDay}`;
}

/**
 * 获取小时和分钟
 * @param {后端标准时间格式} datetime
 * @returns 10:00
 */
export function getHourAndMinute(datetime) {
  const Time = new Date(datetime);
  let h = Time.getHours(); // 时
  h = h < 10 ? "0" + h : h;
  let minute = Time.getMinutes(); // 分
  minute = minute < 10 ? "0" + minute : minute;

  return `${h}:${minute}`;
}
