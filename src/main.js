import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '@/assets/scss/index.scss';

import './assets/css/basic.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import App from './components/App.vue';
init(Vue);
Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

Vue.prototype.$scrollLoadingData = function (event) {
  let e = event ? event : window.event;
  let target = e.target || e.srcElement;
  if (!target) return false;
  let difference = 20;
  let height = target.scrollHeight - target.clientHeight;
  let scrollTop = target.scrollTop;
  if (height > 0 && height - scrollTop < difference) {
    if (this.getMore && this.pager.currentPage < this.pager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getMore();
    }
    if (this.getOrgMore && this.pager.currentPage < this.pager.totalPage && !this.$store.state.bottomLoading) {
      this.$store.commit('initBottomLoading', true);
      this.getOrgMore();
    }
  }
};

Vue.prototype.$formatAryTime = function (ary, index, str = 'YYYY-MM-DD HH:mm:ss') {
  return Array.isArray(ary) && ary[index] ? this.$moment(ary[index]).format(str) : '';
};

