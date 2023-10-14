import cookie from 'js-cookie'
import axios from 'axios'
import { ElMessage } from 'element-plus'

axios.interceptors.response.use(function (response) {
  /**
   *  特定错误码的统一处理
   */
  if (response.data && response.data.code * 1 !== 0) {
    switch (response.data.code) {
      //非管理员账号
      case 100000:
        cookie.remove('user')
        window.router.push('/admin/login')
        break
      //登陆过期
      case 100001:
        window.router.push('/admin/login')
        break
      default:
        //统一提示接口业务错误
        if (response.data.msg) ElMessage.error(response.data.msg)
    }
  }
  return response;
}, function (error) {
  ElMessage.error(error.message || '未知错误')
});

export const fetch = function ({
  url = '/api',
  method,
  type = 'post',
  data = {},
  options = {},
} = {}) {
  url += method
  let op = []
  if (['get', 'head', 'delete', 'jsonp'].includes(type)) {
    op.push(Object.assign(options, { params: data }))
  } else if (['post', 'put', 'patch'].includes(type)) {
    op.push(data)
    op.push(options)
  }
  return axios[type](url, ...op).then((response) => {
    if (response.data.code == 0) {
      return response.data.data
    } else {
      let err = new Error(response.data.message)
      err.code = response.data.code
      throw err
    }
  })
}
