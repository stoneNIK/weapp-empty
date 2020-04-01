const app = getApp();
const consts = require("../../config/consts");
const urgentApi = app.API.urgent;

Page({
  data: {
    height: "",
    loading: false,
  },
  onLoad: function(options) {
    this.setData({
      height: app.globalData.height
    });
  },

  async navigateRegister() {
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true
    });

    const token = wx.getStorageSync(consts.TOKEN);
    if (!token) {
      app.navigateLogin();
      this.setData({
        loading: false
      });
      return;
    }

    try {
      const urgentView = await urgentApi.urgentView(); // TODO: 需要确认接口可行
      this.setData({
        loading: false
      });
      if (urgentView.urgentId) {
        wx.showModal({
          title: "提示",
          content: "已存在登记记录，是否进入编辑?",
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/register/index?id=${urgentView.urgentId}`
              });
            } else if (res.cancel) {
            }
          }
        });
        return;
      }
    } catch (error) {
      console.log(error);
      this.setData({
        loading: false
      });
    }

    wx.navigateTo({
      url: "/pages/register/index"
    });
  }
});
