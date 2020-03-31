const app = getApp()
const QRCode = require("../../utils/weapp-qrcode")

const CanvasId = "canvas"

let qrCodeObj = null
Page({
  data: {
    urgentId: "",
    urgentRegisterData: {},
    qrcodeImg: "",
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: "我的登记" //导航栏 中间的标题
    },
    navHeight: app.globalData.height * 2 + 20
  },
  onLoad: function(options) {
    // 初始化二维码
    qrCodeObj = new QRCode(CanvasId, {
      text: "",
      width: 260,
      height: 260,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    })
    this.setData({
      urgentId: options.id
    })
    this.loadData()
  },
  async loadData() {
    const urgentRegisterData = await app.API.getRecordDetail(this.data.urgentId)
    this.setData({
      urgentRegisterData
    })
    qrCodeObj.makeCode(urgentRegisterData.qrContent)
    setTimeout(() => {
      const that = this
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 260,
        height: 260,
        canvasId: CanvasId,
        success: function(res) {
          that.setData({ qrcodeImg: res.tempFilePath })
        }
      })
    }, 1000)
  },
  modify() {
    wx.navigateTo({
      url: "/pages/register/index?id=" + this.data.urgentId
    })
  },
  saveImage() {
    const that = this
    wx.getSetting({
      success({ authSetting }) {
        if (!authSetting || !authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              that.saveImageToPhotos()
            },
            fail() {
              wx.showModal({
                title: "授权提示",
                content: "小程序需要您的微信授权访问相册才能使用"
              })
            }
          })
          return
        }
        that.saveImageToPhotos()
      }
    })
  },
  saveImageToPhotos() {
    const qrcodeImg = this.data.qrcodeImg
    wx.saveImageToPhotosAlbum({
      filePath: qrcodeImg,
      success(res) {
        wx.showToast({
          title: "成功保存到相册",
          icon: "none",
          duration: 2000
        })
      },
      fail(error) {
        wx.showToast({
          title: "保存失败",
          icon: "none"
        })
      }
    })
  }
})
