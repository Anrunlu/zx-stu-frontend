import VueSocketIO from "vue-socket.io";
import { getToken } from "src/utils/auth";
export default async ({ Vue, store }) => {
  Vue.use(
    new VueSocketIO({
      debug: process.env.NODE_ENV === "development",
      connection: process.env.API_URL,
      allowEIO3: true,
      options: {
        useConnectionNamespace: true,
        autoConnect: false,
        query: {
          token: getToken(),
          version: "2.1",
          platform: "知新2.1网页端",
        },
      },
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_",
      },
    })
  );
};
