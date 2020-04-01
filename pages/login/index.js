const app = getApp()
const userApi = app.API.user
const consts = require("../../config/consts")

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: "授权登录" //导航栏 中间的标题
    },
    navHeight: app.globalData.height * 2 + 20
  },
  onLoad: function() {
    wx.login({
      success: async response => {
        try {
          const res = await userApi.login(response.code)
          wx.setStorageSync(consts.WEAPP_TOKEN, res.weappToken)
          app.globalData.userInfo = res.userInfo
        } catch (error) {}
      }
    })
  },
  async wxPhoneLogin({ detail }) {
    const { encryptedData, iv } = detail
    if (!(encryptedData && iv)) {
      return
    }
    const weappToken = wx.getStorageSync(consts.WEAPP_TOKEN) // 静默登陆获取
    const res = await userApi.weappLogin({
      encryptedData,
      iv,
      weappToken
    })
    wx.setStorageSync(consts.TOKEN, res.token)
    wx.setStorageSync(consts.USER_INFO, JSON.stringify(res.userInfo))
    app.globalData.userInfo = res.userInfo
    app.navigateHome()
  }
})
