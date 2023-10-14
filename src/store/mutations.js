export default {
  updateUserInfo(state, newUserInfo) {
    if (state.userInfo) {
      state.userInfo = { ...state.userInfo, ...newUserInfo }
    } else {
      state.userInfo = { ...newUserInfo }
    }
  },
}
