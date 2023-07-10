const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
const pi = 3.14159265358979324;
const a = 6378245.0;
const ee = 0.00669342162296594323;

export function wgs_gcj_encrypts(wgLat, wgLon) {
  var point = {};
  if (outOfChina(wgLat, wgLon)) {
    point.lat = wgLat;
    point.lng = wgLon;
    return point;
  }
  var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
  var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
  var radLat = (wgLat / 180.0) * pi;
  var magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
  dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
  var lat = wgLat + dLat;
  var lon = wgLon + dLon;
  point.lat = lat;
  point.lon = lon;
  return point;
}

function transformLon(x, y) {
  var ret =
    300.0 +
    x +
    2.0 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x));
  ret +=
    ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
  ret +=
    ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) *
      2.0) /
    3.0;
  return ret;
}

function transformLat(x, y) {
  var ret =
    -100.0 +
    2.0 * x +
    3.0 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x));
  ret +=
    ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
  ret +=
    ((160.0 * Math.sin((y / 12.0) * pi) + 320 * Math.sin((y * pi) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

function outOfChina(lat, lon) {
  if (lon < 72.004 || lon > 137.8347) return true;
  if (lat < 0.8293 || lat > 55.8271) return true;
  return false;
}
