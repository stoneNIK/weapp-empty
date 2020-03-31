const app = getApp()
const consts = require("../../config/consts")

Page({
  data: {
    userInfo: {},
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: "个人中心" //导航栏 中间的标题
    },
    navHeight: app.globalData.height * 2 + 20
  },
  onShow() {
    const { userInfo } = app.globalData
    userInfo &&
      this.setData({
        userInfo
      })
  },
  //   async queryUsreInfo() {
  //     const { userInfo } = await app.API.getUserInfo()
  //     app.globalData.userInfo = userInfo
  //     this.setData({
  //       userInfo
  //     })
  //   },
  async logout() {
    await app.API.logout()
    app.globalData.userInfo = {}
    wx.removeStorageSync(consts.USER_INFO)
    wx.removeStorageSync(consts.WEAPP_TOKEN)
    wx.removeStorageSync(consts.TOKEN)
    app.navigateHome()
  },
  navigateLogin() {
    app.navigateLogin()
  },

  navigate({ currentTarget }) {
    const url = currentTarget.dataset.url
    wx.navigateTo({ url })
  }
})
