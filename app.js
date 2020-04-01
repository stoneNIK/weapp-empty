const API = require("./api/index")
const UTIL = require("./utils/util")
const consts = require("./config/consts")

App({
  API,
  UTIL,
  onLaunch: function(options) {
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    }
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
    //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
    //虽然最后解决了，但是花费了不少时间
    wx.getSystemInfo({
      success: res => {
        this.globalData.height = res.statusBarHeight
      }
    })

    const that = this
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        try {
          that.globalData.userInfo = JSON.parse(
            wx.getStorageSync(consts.USER_INFO)
          )
        } catch (error) {}
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success: async response => {
            // 尝试静默登陆
            try {
              const res = await API.user.login(response.code)
              wx.setStorageSync(consts.WEAPP_TOKEN, res.weappToken)
              wx.setStorageSync(consts.TOKEN, res.token)
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync(consts.USER_INFO, JSON.stringify(res.userInfo))
            } catch (error) {
              wx.removeStorageSync(consts.TOKEN)
              that.globalData.userInfo = null
              that.navigateLogin()
            }
          }
        })
      }
    })
    this.loadAppStartInfo()
  },
  globalData: {
    userInfo: null,
    isConnected: false,
    share: false, // 分享默认为false
    height: 60
  },
  loadAppStartInfo() {
    const that = this
    // 自动下载更新包
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    // 网络状态处理
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === "none") {
          that.globalData.isConnected = false
          wx.showToast({
            title: "当前无网络",
            icon: "loading",
            duration: 2000
          })
          wx.redirectTo({
            url: "/pages/neterror/index"
          })
          return
        }
      }
    })
    // 监听网络状态变化
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: "网络已断开",
          icon: "loading",
          duration: 3000
        })
        if (getCurrentPages()[0].route.indexOf("pages/neterror/index") === -1) {
          wx.redirectTo({
            url: "/pages/neterror/index"
          })
        }
      } else {
        that.globalData.isConnected = true
        if (getCurrentPages()[0].route.indexOf("pages/neterror/index") > -1) {
          wx.switchTab({
            url: "/pages/home/index"
          })
        }
        wx.hideToast()
      }
    })
    // 手机信息
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync("platform", res.platform)
        that.globalData.sysInfo = res
        that.globalData.windowW = res.windowWidth
        that.globalData.windowH = res.windowHeight
        that.globalData.statusBarHeight = res.statusBarHeight
        const SDKVersion = res.SDKVersion.replace(/\./g, "")
        if (SDKVersion < 294) {
          wx.showModal({
            content: `当前版本${res.SDKVersion},支持小程序相关API，请升级微信版本`
          })
        }
      }
    })
  },
  //登陆成功跳转首页
  navigateHome() {
    wx.switchTab({ url: "/pages/home/index" })
  },
  navigateLogin() {
    wx.navigateTo({ url: "/pages/login/index" })
  }
})
