const app = getApp()
const urgentApi = app.API.urgent

Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: "贵阳市疫情防控登记" //导航栏 中间的标题
    },
    navHeight: app.globalData.height * 2 + 20,
    formData: {
      stationId: 0,
      stationName: "机场",
      gender: "1",
      estimatedStayDays: 0
    },
    stations: [
      { name: "机场", index: 0 },
      { name: "贵阳北站", index: 1 },
      { name: "贵阳东站", index: 2 },
      { name: "贵阳站", index: 3 }
    ],
    genders: [
      { name: "男", index: 1 },
      { name: "女", index: 2 }
    ],
    purposes: [
      { name: "工作" },
      { name: "回家" },
      { name: "探亲访友" },
      { name: "旅游" },
      { name: "路过（不停留）" },
      { name: "其他" }
    ],
    areas: [
      { name: "南明区" },
      { name: "云岩区" },
      { name: "花溪区" },
      { name: "乌当区" },
      { name: "白云区" },
      { name: "观山湖区" },
      { name: "开阳县" },
      { name: "息烽县" },
      { name: "修文县" },
      { name: "清镇市" },
      { name: "其他城市" }
    ],
    showStationOptions: false, // 选择地区
    showGenderOptions: false, // 性别
    showPurposeOptions: false, // 事由
    checkedEstimated: true, // 是否长期
    showAreaOptions: false,

    submiting: false,
    submitDisabled: true //禁用提交按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const urgentId = options.id
    if (urgentId) {
      this.setData({
        urgentId
      })
      this.loadInitData()
    }
  },

  async loadInitData() {
    const res = await urgentApi.getRecordDetail(this.data.urgentId)
    this.setData({
      formData: res,
      checkedEstimated: !res.estimatedStayDays
    })
  },

  showStationPop() {
    this.setData({
      showStationOptions: true
    })
  },
  onSelectStation({ detail }) {
    const formData = this.data.formData
    formData.stationId = detail.index
    formData.stationName = detail.name
    this.setData({
      formData
    })
    this.onCancelStation()
  },
  onCancelStation() {
    this.setData({
      showStationOptions: false
    })
  },

  showGenderPop() {
    this.setData({
      showGenderOptions: true
    })
  },
  onSelectGender({ detail }) {
    const formData = this.data.formData
    formData.gender = detail.index
    this.setData({
      formData
    })
    this.onCancelGender()
  },
  onCancelGender() {
    this.setData({
      showGenderOptions: false
    })
  },

  showPurposePop() {
    this.setData({
      showPurposeOptions: true
    })
  },
  onSelectPurpose({ detail }) {
    const formData = this.data.formData
    formData.purpose = detail.name
    this.setData({
      formData
    })
    this.onCancelPurpose()
  },
  onCancelPurpose() {
    this.setData({
      showPurposeOptions: false
    })
  },

  toogleEstimatedStayType() {
    const formData = this.data.formData
    const checkedEstimated = this.data.checkedEstimated
    formData.estimatedStayDays = !checkedEstimated ? 0 : 1
    this.setData({
      formData,
      checkedEstimated: !checkedEstimated
    })
  },
  noop() {},
  onChangeStayDays({ detail }) {
    const formData = this.data.formData
    let stayDays = !detail ? " " : detail
    stayDays = stayDays.replace(/\./, "")
    formData.estimatedStayDays = stayDays
    this.setData({
      formData,
      checkedEstimated: !formData.estimatedStayDays
    })
  },

  showAreaPop() {
    this.setData({
      showAreaOptions: true
    })
  },
  onSelectArea({ detail }) {
    const formData = this.data.formData
    formData.residenceArea = detail.name
    this.setData({
      formData
    })
    this.onCancelArea()
  },
  onCancelArea() {
    this.setData({
      showAreaOptions: false
    })
  },

  changeFormData({ target, detail }) {
    const formData = this.data.formData
    let data_type = target.dataset.type
    formData[data_type] = detail
    if (data_type == "trafficNumber") {
      //航班信息转大写
      formData[data_type] = detail.toUpperCase()
    }
    this.setData({
      formData
    })
  },

  async submit() {
    const validRule = {
      name: "姓名",
      idCard: "身份证号",
      idCardAddress: "身份证地址",
      phone: "您的电话",
      emerContactPerson: "紧急联系人",
      emerContact: "紧急联系电话",
      // 航班/车次号
      trafficNumber: "车次/航班号",
      // 出发地点
      becity: "出发地点",
      // 目的
      purpose: "来贵阳事由",
      residenceArea: "在贵居住区域",
      // 小区/酒店名称
      residenceName: "拟居住小区或酒店名称"
    }
    const formData = this.data.formData
    for (const key in validRule) {
      if (!(formData[key] || "").replace(/(^\s*)|(\s*$)/g, "")) {
        wx.showToast({
          title: `${validRule[key]}不能为空，请检查！`,
          icon: "none",
          duration: 2000
        })
        return
      }
    }
    // 校验
    if (
      !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
        formData.idCard
      )
    ) {
      wx.showToast({
        title: "您的身份证号格式错误，请检查！",
        icon: "none",
        duration: 2000
      })
      return
    }
    if (!/^1\d{10}$/.test(formData.phone)) {
      wx.showToast({
        title: "您的手机号码格式错误，请检查！",
        icon: "none",
        duration: 2000
      })
      return
    }
    if (!/^1\d{10}$/.test(formData.emerContact)) {
      wx.showToast({
        title: "紧急联系人手机号码格式错误，请检查！",
        icon: "none",
        duration: 2000
      })
      return
    }
    if (formData.emerContact == formData.phone) {
      wx.showToast({
        title: "紧急联系人手机号码和本人重复",
        icon: "none",
        duration: 2000
      })
      return
    }

    if (Number(formData.estimatedStayDays) < 1 && !this.data.checkedEstimated) {
      wx.showToast({
        title: "预计停留时间不能小于1天",
        icon: "none",
        duration: 2000
      })
      return
    }

    this.setData({
      submiting: true
    })

    try {
      await urgentApi.saveRecord(formData)
      if (this.data.urgentId) {
        wx.navigateBack({
          delta: 2
        })
      } else {
        wx.navigateTo({
          url: "/pages/record/index"
        })
      }
    } catch (error) {}

    this.setData({
      submiting: false
    })
  }
})
