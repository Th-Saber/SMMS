 //引入vue
import Vue from 'vue'

import App from './App.vue'
//引入axios
import axios from "axios"

//引入elementui
import ElementUI from 'element-ui';
//引入elementui 样式库
import 'element-ui/lib/theme-chalk/index.css';
//结构出Message模块
import {Message} from "element-ui"
//引入路由
import router from './router';
//引入样式
import "@/styles/common.less";


//使用elementui
Vue.use(ElementUI);
//把axios挂载到vue原型上
Vue.prototype.axios = axios;
//路由卫士
router.beforeEach((to, from, next)=>{
  //保存令牌  token
  const token = window.localStorage.getItem("token");
  if(token){
    next();
  } else {  // 否则是没有
    // 如果去的是登录页
    if (to.path === '/login') {
      // 直接放行
      next();
    } else {
      // 如果去的是其他页,跳转到登录页
      Message.error('请登录以后再操作！')
      // 跳转到登录页
      return next({"path": "/login"})
    }
  }
})




//阻止生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
