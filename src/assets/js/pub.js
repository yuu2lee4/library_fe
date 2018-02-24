import cookie from 'js-cookie'

export default {
    install(Vue){
        Vue.isLogin = function(){
            return Boolean(cookie.get('user'));
        }
        
        Vue.logout = async function(toLogin){
            let res = await Vue.fetch({method:'/user/logout',type: 'get'})
            if(res){
                cookie.remove('user')
                if(toLogin){
                    router.push('/admin/login')
                }
            }
        }
    }
}