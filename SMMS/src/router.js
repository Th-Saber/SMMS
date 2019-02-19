import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue'),
    },
    {
      path: '/',
      name: 'index',
      component: () => import('./views/Index/Index.vue'),
      children:[
        {
          path:"",
          name:"home",
          component:()=>import("./views/home/home.vue")
        },
        {
          path:"/accountmanage",
          name:"accountmanage",
          component:()=>import("./views/accountmanage/accountmanage.vue")
        },
        {
          path:"/accountadd",
          name:"accountadd",
          component:()=>import("./views/accountadd/accountadd.vue")
        },
        {
          path:"/passwordmodify",
          name:"passwordmodify",
          component:()=>import("./views/passwordmodify/passwordmodify.vue")
        },
        {
          path:"/goodsmanage",
          name:"goodsmanage",
          component:()=>import("./views/goodsmanage/goodsmanage.vue")
        },
        {
          path:"/goodsadd",
          name:"goodsadd",
          component:()=>import("./views/goodsadd/goodsadd.vue")
        },
        {
          path:"/salestatistics",
          name:"salestatistics",
          component:()=>import("./views/salestatistics/salestatistics.vue")
        },
        {
          path:"/stockmanage",
          name:"stockmanage",
          component:()=>import("./views/stockmanage/stockmanage.vue")
        },
        {
          path:"/stockadd",
          name:"stockadd",
          component:()=>import("./views/stockadd/stockadd.vue")
        },
        {
          path:"/shipmentmanage",
          name:"shipmentmanage",
          component:()=>import("./views/shipmentmanage/shipmentmanage.vue")
        },
        {
          path:"/outlibrary",
          name:"outlibrary",
          component:()=>import("./views/outlibrary/outlibrary.vue")
        },
        {
          path:"/productreturn",
          name:"productreturn",
          component:()=>import("./views/productreturn/productreturn.vue")
        },
        {
          path:"/membermanage",
          name:"membermanage",
          component:()=>import("./views/membermanage/membermanage.vue")
        },
        {
          path:"/memberadd",
          name:"memberadd",
          component:()=>import("./views/memberadd/memberadd.vue")
        },
        {
          path:"/classifymanage",
          name:"classifymanage",
          component:()=>import("./views/classifymanage/classifymanage.vue")
        },
        {
          path:"/classifyadd",
          name:"classifyadd",
          component:()=>import("./views/classifyadd/classifyadd.vue")
        }

      ]
    }
  ]
})
