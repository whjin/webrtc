import Vue from "vue";
import App from "./App";
import config from "@/common/config";
import store from './store/store';

Vue.config.productionTip = false;

// 全局注册应用配置
Vue.prototype.$config = config;

App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});
app.$mount();
