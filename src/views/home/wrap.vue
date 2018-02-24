<template>
    <div id="home">
        <header>
            <div class="wrapper">
                <router-link class="logo_text" to="/">鲲鹏</router-link>
                <div class="pull-right" style="margin-top: 6px">
                    <el-input size="medium" placeholder="搜索你喜欢的" class="search" @keyup.enter.native="search" v-model="searchVal" style="margin-right:10px">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                    <el-dropdown v-if="isLogin" style="margin-top: -6px">
                        <span class="iconfont icon-head userHead"></span>
                        <el-dropdown-menu slot="dropdown">
                            <router-link to="/user"><el-dropdown-item>个人资料</el-dropdown-item></router-link>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <template v-else>
                        <el-button v-if="!config.ldap" size="medium" type="danger" class="register" @click.native="registerVisible = true">注册</el-button>
                        <el-button size="medium" :plain="true" type="success" class="login" @click.native="loginVisible = true">登录</el-button>
                    </template>
                </div>
            </div>
        </header>
        <keep-alive>
            <router-view class="content"></router-view>
        </keep-alive>
        <el-dialog v-if="!isLogin" class="dialog" :visible.sync="registerVisible" size="tiny">
            <div style="padding:0 45px">
                <div class="title">使用邮箱注册</div>
                <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
                    <el-form-item prop="name">
                        <el-input v-model="registerForm.name" placeholder="邮箱">
                            <el-button slot="append" :disabled="registerValidating" class="btn" @click="getPin('register',false)">{{registerPinText}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pin">
                        <el-input v-model="registerForm.pin" placeholder="验证码"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="repassword">
                        <el-input v-model="registerForm.repassword" type="password" auto-complete="off" placeholder="重复密码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="danger" @click.native="register" style="width: 100%">注册</el-button>
            </div>
        </el-dialog>
        <el-dialog v-if="!isLogin" class="dialog" :visible.sync="loginVisible" size="tiny">
            <div style="padding:0 45px">
                <div class="title">使用邮箱登录</div>
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="name">
                        <el-input v-model="loginForm.name" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
                    </el-form-item>
                    <!-- 此出预留极验的滑块拼图验证码 -->
                </el-form>
                <el-button type="danger" @click.native="login" style="width: 100%">登录</el-button>
                <div style="margin-top: 12px">
                    <a @click="resetVisible = true" href="javascript:;" style="color: #9A0000;">忘记密码？</a>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-if="!isLogin" class="dialog" :visible.sync="resetVisible" size="tiny">
            <div style="padding:0 45px">
                <div class="title">重置密码</div>
                <el-form :model="resetForm" :rules="resetRules" ref="resetForm">
                    <el-form-item prop="name">
                        <el-input v-model="resetForm.name" placeholder="邮箱">
                            <el-button slot="append" type="success" :disabled="resetValidating" class="btn" @click="getPin('reset')">{{resetPinText}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pin">
                        <el-input v-model="resetForm.pin" placeholder="验证码"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="resetForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="repassword">
                        <el-input v-model="resetForm.repassword" type="password" auto-complete="off" placeholder="重复密码"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="danger" @click.native="resetPW" style="width: 100%">重置</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import cookie from 'js-cookie'
    import config from '@/config'

    export default {
        data() {
            const validatePass = (form) => {
                return (rule, value, callback)=>{
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else {
                        if (this[form].repassword !== '') {
                            this.$refs[form].validateField('repassword');
                        }
                        callback();
                }
                }
            };
            const checkPass = (form) => {
                return (rule, value, callback)=>{
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== this[form].password) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                }
            };

            return {
                config,
                searchVal: '',
                registerValidating: false,
                registerPinText: '验证',
                resetValidating: false,
                resetPinText: '验证',
                isLogin: false,
                registerVisible: false,
                loginVisible: false,
                resetVisible: false,
                registerForm: {
                    name: '',
                    pin: '',
                    password: '',
                    repassword: ''
                },
                loginForm: {
                    name: '',
                    password: ''
                },
                resetForm: {
                    name: '',
                    pin: '',
                    password: '',
                    repassword: ''
                },
                registerRules: {
                    name: [
                        { required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }
                    ],
                    pin: [
                        { required: true, type: 'string', message: '请输入验证码', trigger: 'blur' },
                        { len: 5, message: '长度为5个字符', trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass('registerForm'), trigger: 'blur' }
                    ],
                    repassword: [
                        { validator: checkPass('registerForm'), trigger: 'blur' }
                    ]
                },
                resetRules: {
                    name: [
                        { required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }
                    ],
                    pin: [
                        { required: true, type: 'string', message: '请输入验证码', trigger: 'blur' },
                        { len: 5, message: '长度为5个字符', trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass('resetForm'), trigger: 'blur' }
                    ],
                    repassword: [
                        { validator: checkPass('resetForm'), trigger: 'blur' }
                    ]
                },
                loginRules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '至少6个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        async beforeRouteEnter (to, from, next) {
            if(Vue.isLogin()){
                const res = await Vue.fetch({method: '/user', type: 'get'});
                cookie.set('user', res);
                next()
            }else{
                next()
            }
        },
        created(){
            if(Vue.isLogin()){
                this.isLogin = true
                this.$store.dispatch('getUserInfo')
            }
        },
        methods: {
            search() {
                const s = this.searchVal.trim();
                this.searchVal = '';
                router.push({ path: 'index', query: { s }});
            },
            register(){
                this.$refs.registerForm.validate(async valid => {
                    if (valid) {
                        let res = await Vue.fetch({method:'/user/register',data:this.registerForm})
                        if(res){
                            this.$store.commit('updateUserInfo',res);
                            this.isLogin = true;
                            this.registerVisible = false;
                            cookie.set('user', res);
                            this.$refs.registerForm.resetFields();
                        }
                    }
                });
            },
            login(){
                this.$refs.loginForm.validate(async valid => {
                    if (valid) {
                        const method = `/user/${config.ldap ? 'ldapLogin' : 'login'}`;
                        const res = await Vue.fetch({method, data:this.loginForm});
                        
                        if(res){
                            this.$store.commit('updateUserInfo',res);
                            this.isLogin = true;
                            this.loginVisible = false;
                            cookie.set('user', res);
                            this.$refs.loginForm.resetFields();
                        }
                    }
                });
            },
            resetPW(){
                this.$refs.resetForm.validate(async valid => {
                    if (valid) {
                        let res = await Vue.fetch({method:'/user/resetPassword',data:this.resetForm})
                        if(res){
                            this.$message.success('密码修改成功！');
                            this.resetVisible = false;
                            this.$refs.resetForm.resetFields();
                        }
                    }
                });
            },
            logout() {
                Vue.logout();
                this.isLogin = false;
            },
            async getPin(form,checkUser = true){
                if(!this[form+'Form'].name) return this.$message.warning('请输入邮箱！');
                let res = await Vue.fetch({method:'/user/getPin',data: {name: this[form+'Form'].name, checkUser: checkUser}})
                if(res){
                    this[form+'Validating'] = true;
                    let t = 60;
                    this[form+'PinText'] = t+'s'
                    const timer = setInterval(()=>{
                        if(--t == 0){
                            clearInterval(timer);
                            this[form+'Validating'] = false;
                            this[form+'PinText'] = '验证';
                        }else{
                            this[form+'PinText'] = t+'s'
                        }
                    },1000)
                    this.$message.success('发送成功，赶快去邮箱查看吧！');
                }
            }
        }
    }
</script>
<style scoped lang="less">
    #home{
        min-height: 100%;
        padding-top: 58px;
        min-width: 1244px;
        background-color: #edece9;
        header{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 997;
            background-color: #fff;
            box-shadow: 0 0 4px rgba(0,0,0,.2);

            .wrapper{
                width: 1244px;
                height: 48px;
                margin: 0 auto;
                .logo_text{
                    float: left;
                    font-size: 22px;
                    line-height: 48px;
                 }
                 .search{
                     float: left;
                     width: 700px;
                 }
                 .userHead{
                     display: inline-block;
                    margin-left: 10px;
                    font-size: 26px;
                    width: 46px;
                    color: #FA876E;
                    line-height: 48px;
                    text-align: center;
                    border-right: 1px solid #f5f5f5;
                    border-left: 1px solid #f5f5f5;
                 }
            }
        }
        .content{
            width: 1244px; 
            margin: 0 auto;
        }
        .dialog{
            .title{
                font-size: 16px;
                color: #999;
                position: relative;
                text-align: center;
                margin-bottom: 15px;

                &:before,&:after{
                    content: "";
                    border-top: 1px solid #ededed;
                    display: block;
                    position: absolute;
                    width: 80px;
                    top: 8px;
                }
                &:before{
                    left: 0;
                }
                &:after{
                    right: 0;
                }
            }
        }
    }
</style>