import cookie from 'js-cookie'
import { defineStore } from 'pinia'
import { fetch } from '@/assets/js/fetch'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  actions: {
    updateUserInfo(newUserInfo) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...newUserInfo }
      } else {
        this.userInfo = { ...newUserInfo }
      }
    },
    async getUserInfo(fromServer) {
      let res = null

      if (fromServer) {
        res = await fetch({ method: '/user', type: 'get' })
        this.updateUserInfo(res)
        cookie.set('user', JSON.stringify(res))
      } else if (this.userInfo) {
        res = this.userInfo
      } else {
        res = JSON.parse(cookie.get('user') || 'null')
        if (res) this.updateUserInfo(res)
      }
      return res
    },
  },
})
