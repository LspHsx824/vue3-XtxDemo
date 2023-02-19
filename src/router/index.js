import {
  createWebHashHistory,
  createRouter
} from "vue-router";

import Confirm from "@/components/library/Confirm"

import Store from "@/store"

const LoginCallback = () => import("@/views/login/callback");
const Cart = () => import("@/views/cart");

const routes = [{
    path: "/",
    component: () => import("@/views/Layout"),
    children: [{
        path: "/",
        name: "home",
        component: () => import("@/views/home"),
      },
      {
        path: "/category/:id",
        meta: {
          "Category-type": "Top-Categories",
        },
        component: () => import("@/views/category"),
      },
      {
        path: "/category/sub/:subId",
        meta: {
          "Category-type": "Sub-Categories",
        },
        component: () => import("@/views/category/sub.vue"),
      },
      {
        path: "/product/:id",
        component: () => import("@/views/goods"),
        meta: {
          type: "product",
        },
      },
      {
        path: "/cart",
        component: Cart,
      }, {
        path: '/member/checkout',
        meta: {
          isAuth: true
        },
        component: () => import("@/views/member/pay/checkout")
      }, {
        path: '/member/pay',
        name: 'pay',
        meta: {
          isAuth: true
        },
        component: () => import("@/views/member/pay")
      }, {
        path: '/pay/callback',
        name: 'payResult',
        meta: {
          isAuth: true
        },
        component: () => import("@/views/member/pay/pay-result")
      },
    ],
  },
  {
    path: "/login",
    name: 'login',
    component: () => import("@/views/login"),
  },
  {
    path: "/login/callback",
    component: LoginCallback,
  }, {
    path: '/review', // 复习测试路由
    component: () => import("@/views/text")
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    /**
     * !!延迟滚动，过程中可以处理 过渡动画
     */
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          left: 0,
          top: 0,
        });
      }, 0);
    });
  },
});

router.beforeEach((to, from, next) => {

  const {
    profile
  } = Store.state.user

  if (to.meta.isAuth && !profile.token) {
    //需要登录才能访问
    return next("/login?returnUrl=" + encodeURIComponent(to.fullPath))
  }
  next()

})

export default router;