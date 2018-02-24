import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

window.router = new Router({
  routes: [
      {
          path: '/',
          redirect: '/index',
          component: resolve => require(['../views/home/wrap'], resolve),
          children: [
              {
                  path: 'index',
                  component: resolve => require(['../views/home/index'], resolve)
              },
              {
                  path: 'user',
                  component: resolve => require(['../views/home/user'], resolve)
              }
          ]
      },
      {
          path: '/admin',
          redirect: '/admin/book/list',
          component: resolve => require(['../views/admin/wrap'], resolve),
          children: [
              {
                  path: 'book/list',
                  component: resolve => require(['../views/admin/bookList'], resolve)
              },
              {
                  path: 'book/add',
                  component: resolve => require(['../views/admin/addBook'], resolve)
              },
              {
                  path: 'book/borrowedList',
                  component: resolve => require(['../views/admin/borrowedList'], resolve)
              },
              {
                  path: 'book/tagList',
                  component: resolve => require(['../views/admin/bookTagList'], resolve)
              },
              {
                  path: 'book/addTag',
                  component: resolve => require(['../views/admin/addBookTag'], resolve)
              }
          ]
      },
      {
          path: '/admin/login',
          component: resolve => require(['../views/admin/login'], resolve)
      }
  ]
})

export default window.router
