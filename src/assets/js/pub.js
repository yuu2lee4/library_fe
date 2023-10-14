import cookie from 'js-cookie'
import { fetch } from './fetch.js'

export const isLogin = function () {
  return Boolean(cookie.get('user'))
}

export const logout = async function (toLogin) {
  let res = await fetch({ method: '/user/logout', type: 'get' })
  if (res) {
    cookie.remove('user')
    if (toLogin) {
      window.router.push('/admin/login')
    }
  }
}
