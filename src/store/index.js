import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import socketio from "./socketio";
import settings from "./settings";
import student from "./student";
import persistPlugin from '../utils/persistPlugin'
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      user,
      socketio,
      settings,
      student,
    },
    plugins:[persistPlugin],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
