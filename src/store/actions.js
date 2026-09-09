import cookie from 'js-cookie'
import { fetch } from '@/assets/js/fetch'

export default {
  async getUserInfo(ctx, fromServer) {
    let res = null

    if (fromServer) {
      res = await fetch({ method: '/user', type: 'get' })
      ctx.commit('updateUserInfo', res)
      cookie.set('user', JSON.stringify(res))
    } else {
      if (ctx.state.userInfo) {
        res = ctx.state.userInfo
      } else {
        res = JSON.parse(cookie.get('user') || 'null')
        if (res) ctx.commit('updateUserInfo', res)
      }
    }
    return res
  },
}
