import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home
    },
    {
      path: '/web-control',
      name: '管控主机',
      component: () => import('../views/Control.vue')
    },
    {
      path: '/web-terminal',
      name: '仓内分机',
      component: () => import('../views/Terminal.vue')
    },
    {
      path: '/web-test',
      name: '测试页',
      component: () => import('../views/Test.vue')
    }
  ]
});

export default router;
