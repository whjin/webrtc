import Vue from 'vue';
import App from './App';
import config from '@/common/config';
import vTree from '@/components/v-tree/v-tree.vue';
import valarm from '@/components/v-alarm/v-alarm.vue';
import store from './store/store';

Vue.config.productionTip = false;

// 全局注册应用配置
Vue.prototype.$config = config;
Vue.component('v-tree', vTree);
Vue.component('v-alarm', valarm);

App.mpType = 'app';

const app = new Vue({
    store,
    ...App
});
app.$mount();
