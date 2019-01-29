 //引入vue
import Vue from 'vue'

import App from './App.vue'
//引入elementui
import ElementUI from 'element-ui';
//引入elementui 样式库
import 'element-ui/lib/theme-chalk/index.css';
//引入路由
import router from './router'


//使用elementui
Vue.use("ElementUI");
//阻止生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
