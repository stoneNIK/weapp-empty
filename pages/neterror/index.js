const app = getApp()

Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: "网络异常" //导航栏 中间的标题
    },
    navHeight: app.globalData.height * 2 + 20
  }
})
