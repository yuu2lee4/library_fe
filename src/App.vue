<template>
  <div class="view">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script>
export default {
}
</script>

<style lang="less" scoped>
.view {
  min-height: 100%;
  height: 100%;
}
</style>

<style lang="less">
* {
  box-sizing: border-box;
}
.clearfix:after {
  content: '';
  display: block;
  clear: both;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.p10 {
  padding: 10px;
}
a {
  text-decoration: none;
  color: #444;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
}
</style>
