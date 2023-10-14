<template>
  <div id="admin">
    <section id="leftPane" v-show="!fullScreen">
      <div class="top">鲲鹏管理后台</div>
      <el-menu
        v-if="menu.length"
        class="menu"
        router
        :default-openeds="menuOpeneds"
        :default-active="menuActive"
      >
        <el-sub-menu v-for="(sub, subindex) in menu" :key="sub.name" :index="`${subindex}`">
          <template #title>
            <el-icon><component :is="sub.icon" /></el-icon>{{sub.name}}
          </template>
          <el-menu-item 
            v-for="(item, index) in sub.list"
            :key="item.name"
            :index="`${subindex}_${index}`"
            :route="{ path: item.path }"
            >
            {{ item.name }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </section>
    <section id="mainContent">
      <header v-show="!fullScreen">
        <a
          href="javascript:;"
          class="pull-right"
          style="color: #fff; margin-top: 18px; margin-right: 12px"
          @click="logout"
          >退出</a
        >
      </header>
      <div class="pageToolbar">
        <el-breadcrumb
          separator="/"
          class="pull-left"
          style="line-height: 18px"
        >
          <el-breadcrumb-item v-for="item of breadcrumbList" :key="item">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tools pull-right">
          <el-icon :title="fullscreenText" @click="gotoFullscreen"><FullScreen /></el-icon>
        </div>
      </div>
      <router-view class="iframe"/>
    </section>
  </div>
</template>

<script>
import { Message, FullScreen } from '@element-plus/icons'
import cookie from 'js-cookie'
import { logout } from '@/assets/js/pub'

export default {
  components: {
    Message,
    FullScreen,
  },
  data: () => ({
    fullScreen: false, //全屏标志
    menuActive: '0_0',
    menuOpeneds: [],
    breadcrumbList: [],
    menu: [{
        name: '书籍管理',
        icon: 'Message',
        list: [{
          name: '书籍列表',
          path: '/admin/book/list',
        }, {
          name: '书籍分类',
          path: '/admin/book/tagList',
        }, {
          name: '借出列表',
          path: '/admin/book/borrowedList',
        }]
    }],
  }),
  computed: {
    fullscreenText() {
      return this.fullScreen ? '退出全屏' : '全屏'
    },
  },
  watch: {
    $route: {
      handler(val) {
        for (const [subindex, sub] of this.menu.entries()) {
          for (const [index, item] of sub.list.entries()) {
            if (item.path === val.path) {
              this.menuActive = `${subindex}_${index}`
              this.menuOpeneds = [`${subindex}`]
              this.breadcrumbList = [sub.name, item.name];
              break;
            }
          }
        }
      },
      immediate: true
    },
  },
  beforeRouteEnter(to, from, next) {
    const user = cookie.getJSON('user')
    if (user && user.role > 10) {
      next()
    } else {
      next('/admin/login')
    }
  },
  beforeRouteUpdate(to, from, next) {
    const user = cookie.getJSON('user')
    if (user && user.role > 10) {
      next()
    } else {
      next('/admin/login')
    }
  },
  methods: {
    gotoFullscreen() {
      this.fullScreen = !this.fullScreen
      //触发resize事件，页面元素重新布局，二期使用dom操作库优化代码  todo

      function triggerResize() {
        if (document.createEvent) {
          window.dispatchEvent(new Event('resize'))
        } else {
          const event = document.createEvent('HTMLEvents')
          event.initEvent('resize', true, true)
          window.fireEvent('on' + event.eventType, event)
        }
      }
      this.$nextTick(function () {
        triggerResize()
        setTimeout(triggerResize, 300)
      })
    },
    logout() {
      logout(true)
    },
  },
}
</script>

<style lang="less" scoped>
#admin {
  height: 100%;
  display: flex;
}
#leftPane {
  width: 256px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  .top {
    height: 54px;
    background-color: #3c5198;
    color: #fff;
    line-height: 54px;
    text-align: center;
    font-size: 20px;
  }
  .menu {
    flex: 1;
    overflow: auto;
  }
}
#mainContent {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  header {
    height: 54px;
    background-color: #5c6fb4;
    position: relative;
  }

  .pageToolbar {
    padding: 6px 10px;
    background-color: #fafafa;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);

    .tools {
      i {
        color: #444;
        cursor: pointer;
      }
      i:hover {
        color: #369be9;
      }
    }
  }

  .iframe {
    flex: 1;
    padding: 10px;
    overflow: auto;
  }
}
</style>
