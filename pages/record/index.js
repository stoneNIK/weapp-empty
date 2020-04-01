const app = getApp()
const urgentApi = app.API.urgent

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: "我的登记" //导航栏 中间的标题
    },
    navBackFunc: null, // 自定义返回事件
    navHeight: app.globalData.height * 2 + 20
  },

  navigate({ currentTarget }) {
    const dataset = currentTarget.dataset
    wx.navigateTo({
      url: `/pages/record-detail/index?id=${dataset.id || ""}`
    })
  },

  onLoad() {
    const that = this
    this.setData({
      navBackFunc: function() {
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        if (prevPage.route.indexOf("pages/register/index") > -1) {
          wx.switchTab({ url: "/pages/mine/index" })
        } else {
          wx.navigateBack()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.loadData()
  },

  async loadData() {
    const { list } = await urgentApi.getRecordList()
    this.setData({
      listData: list
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadData()
  }
})
