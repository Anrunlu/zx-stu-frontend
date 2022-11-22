import { getToken } from "./auth";

// 建立带认证信息的socket连接
export function openAuthedSocket(that) {
  that.$socket.io.opts.query = {
    token: getToken(),
    version: "2.1",
    platform: "网页端", // TODO: 利用quasar的platform判断
  };

  //To open the socket connection
  that.$socket.open();
}
