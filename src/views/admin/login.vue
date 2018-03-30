<template>
    <div id="admin_login">
        <el-card class="login_panel">
            <div slot="header">
                <span>管理系统后台</span>
            </div>
            <el-form :model="form" :rules="rules" ref="form" label-width="72px">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%" @click="login">登陆</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script lang="babel">
    import cookie from 'js-cookie'

    export default {
        data: ()=>({
            form: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '至少6个字符', trigger: 'blur' }
                ]
            }
        }),
        beforeRouteEnter (to, from, next) {
            const user = cookie.getJSON('user');
            if(user && user.role > 10){
                next('/admin')
            }else{
                next()
            }
        },
        methods: {
            login(){
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        const res = await Vue.fetch({method: '/user/login', data:this.form})
                        if(res && res.role > 10){
                            this.$store.commit('updateUserInfo',res);
                            cookie.set('user', res);
                            router.push("/admin");
                        }else{
                            this.$message.warning('这不是一个管理员账号！');
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
#admin_login{
    height:100%;
    background-color: #383E4C;

    .login_panel{
        width:300px;
        position:absolute;
        top:54px;
        left:50%;
        margin-left: -150px;
    }

} 


</style>
