//Vuex本地化存储

const KEY = 'VUEX_STORE'
export default function (store) {
  
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(KEY, JSON.stringify(store.state.student))
  })

  try {
    const localStore = localStorage.getItem(KEY)
    if (localStore) {
      store.state.student = JSON.parse(localStore)
    }
  } catch (err) {
    console.log("本地数据异常");
  }

}
