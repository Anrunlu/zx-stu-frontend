import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import socketio from "./socketio";
import teaCourse from "./tea-course";
import questionCar from "./question-car";

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
      teaCourse,
      questionCar,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
