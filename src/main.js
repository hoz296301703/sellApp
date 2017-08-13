import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';// 引入vue-resource插件
import App from './App';
import goods from 'components/goods/goods';// 引入组件
import ratings from 'components/ratings/ratings';// 引入组件
import seller from 'components/seller/seller';// 引入组件

import 'common/stylus/index.styl';

Vue.use(VueRouter);// 把VueRouter用到vue项目里
Vue.use(VueResource);// 把VueResource用到vue项目里

let app = Vue.extend(App);// 路由的根组件App组件

let router = new VueRouter({// 实例化路由
  linkActiveClass: 'active'// 改变选中的类名1
});
// 定义路由（map方法是定义路由）
router.map({
  '/goods': {// 路由名称
    component: goods// 对应的组件
  },
  '/ratings': {// 路由名称
    component: ratings// 对应的组件
  },
  '/seller': {// 路由名称1
    component: seller// 对应的组件
  }
});

router.start(app, '#app');// 启动应用 挂载在#app匹配的元素上

router.go('/goods');// 重定向路由
