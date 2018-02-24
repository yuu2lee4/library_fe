<template>
    <div id="admin">
        <section id="leftPane" v-show="!fullScreen">
            <div class="top">
                鲲鹏管理后台
            </div>
            <el-menu class="menu" router :default-openeds="['1']" default-active="1-1">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>书籍管理</template>
                    <el-menu-item index="1-1" :route="{path:'/admin/book/list'}">书籍列表</el-menu-item>
                    <el-menu-item index="1-2" :route="{path:'/admin/book/tagList'}">书籍分类</el-menu-item>
                    <el-menu-item index="1-3" :route="{path:'/admin/book/borrowedList'}">借出列表</el-menu-item>
                </el-submenu>
            </el-menu>
        </section>
        <section id="mainContent">
            <header v-show="!fullScreen">
                <a href="javascript:;" class="pull-right" style="color: #fff;margin-top: 18px;margin-right: 12px;" @click="logout">退出</a>
            </header>
            <div class="pageToolbar">
                <el-breadcrumb separator="/" class="pull-left" style="line-height: 18px">
                    <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
                    <el-breadcrumb-item>书籍列表</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="tools pull-right">
                    <i :class="fullscreenIcon" :title="fullscreenText" @click="gotoFullscreen"></i>
                </div>
            </div>
            <keep-alive>
                <router-view class="iframe"></router-view>
            </keep-alive>
        </section>
    </div>
</template>
<script>
    import cookie from 'js-cookie'

    export default {
        data: ()=> ({
            fullScreen:false    //全屏标志
        }),
        computed: {
            fullscreenIcon(){
                return this.fullScreen ? "el-icon-minus" : "el-icon-plus"
            },
            fullscreenText(){
                return this.fullScreen ? "退出全屏" : "全屏"
            }
        },
        beforeRouteEnter (to, from, next) {
            const user = cookie.getJSON('user');
            if(user && user.role > 10){
                next()
            }else{
                next('/admin/login')
            }
        },
        beforeRouteUpdate (to, from, next) {
            const user = cookie.getJSON('user');
            if(user && user.role > 10){
                next()
            }else{
                next('/admin/login')
            }
        },
        methods: {
            gotoFullscreen() {
                this.fullScreen = !this.fullScreen;
                //触发resize事件，页面元素重新布局，二期使用dom操作库优化代码  todo

                function triggerResize() {
                    if (document.createEvent) {
                        window.dispatchEvent(new Event('resize'));
                    } else {
                        let event = document.createEvent("HTMLEvents");
                        event.initEvent("resize", true, true);
                        window.fireEvent("on" + event.eventType, event);
                    }
                }
                this.$nextTick(function () {
                    triggerResize();
                    setTimeout(triggerResize,300);
                });
            },
            logout() {
                Vue.logout(true);
            }
        }
    }
</script>

<style scoped lang="less">
    #admin{
        height:100%;
        display: flex;
    }
    #leftPane{
        width:256px;
        height: 100%;
        position:relative;
        display:flex;
        flex-direction: column;
        flex-shrink: 0;

        .top{
            height: 54px;
            background-color: #3C5198;
            color: #fff;
            line-height: 54px;
            text-align: center;
            font-size: 20px;
        }
        .menu{
            flex:1;
            overflow: auto;
        }
    }
    #mainContent{
        height: 100%;
        display: flex;
        flex:1;
        flex-direction: column;
        overflow: auto;

        header{
            height: 54px;
            background-color: #5C6FB4;
            position: relative;
        }

        .pageToolbar{
            padding:6px 10px;
            background-color: #fafafa;
            box-shadow: 0 1px 5px 0 rgba(0,0,0,.2);

            .tools {

                i{
                    color: #444;
                    cursor: pointer;
                }
                i:hover{
                    color: #369BE9;
                }
            }
        }

        .iframe{
            flex:1;
            padding: 10px;
            overflow: auto;
        }
    }
</style>