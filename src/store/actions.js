import cookie from 'js-cookie'

export default {
    async getUserInfo(ctx,fromServer){
        let res = null;

        if(fromServer){
            res = await Vue.fetch({method: '/user', type: 'get'});
            ctx.commit('updateUserInfo', res);
            cookie.set('user', res);
        }else{
            if(ctx.state.userInfo){
                res = ctx.state.userInfo;
            }else{
                res = cookie.getJSON('user');
                if(res) ctx.commit('updateUserInfo', res);
            }
        }
        return res;
    }
}