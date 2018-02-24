import cookie from 'js-cookie'

export default {
    install(Vue, {Message}){

        Vue.http.interceptors.push((request, next) => {

            next(response => {
                //网络故障导致接口直接失败
                if (response.status * 1 == 0) {
                    Message.error("网络异常");
                }

                /**
                 *  特定错误码的统一处理
                 */
                if (response.body && response.body.code * 1 !== 0) {
                    
                    switch (response.body.code) {
                        //非管理员账号
                        case 100000:
                            cookie.remove('user');
                            router.push('/admin/login');
                            break;
                        //登陆过期
                        case 100001:
                            router.push('/admin/login');
                            break;
                        default:
                            //统一提示接口业务错误
                            if(response.body.msg) Message.error(response.body.msg);
                    }
                }

            });
        });

        Vue.fetch = function({url='/api',method,type='post',data={},options={}} = {}){
            url += method;
            let op = [];
            if(['get','head','delete','jsonp'].includes(type)){
                op.push(Object.assign(options,{params:data}));
            }else if(['post','put','patch'].includes(type)){
                op.push(data);
                op.push(options);
            }
            return Vue.http[type](url, ...op)
                .then(response=> {
                    if (response.body.code == 0) {
                        return response.body.data;
                    } else {
                        let err = new Error(response.body.message);
                        err.code = response.body.code;
                        throw err;
                    }
                })
        }
    }
}