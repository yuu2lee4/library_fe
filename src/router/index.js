import * as VueRouter from 'vue-router'

window.router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index',
      component: () => import('../views/home/wrap.vue'),
      children: [
        {
          path: 'index',
          component: () => import('../views/home/index.vue'),
        },
        {
          path: 'user',
          component: () => import('../views/home/user.vue'),
        },
      ],
    },
    {
      path: '/admin',
      redirect: '/admin/book/list',
      component: () => import('../views/admin/wrap.vue'),
      children: [
        {
          path: 'book/list',
          component: () => import('../views/admin/bookList.vue'),
        },
        {
          path: 'book/add',
          component: () => import('../views/admin/addBook.vue'),
        },
        {
          path: 'book/borrowedList',
          component: () => import('../views/admin/borrowedList.vue'),
        },
        {
          path: 'book/tagList',
          component: () => import('../views/admin/bookTagList.vue'),
        },
        {
          path: 'book/addTag',
          component: () => import('../views/admin/addBookTag.vue'),
        },
      ],
    },
    {
      path: '/admin/login',
      component: () => import('../views/admin/login.vue'),
    },
  ],
})

export default window.router

