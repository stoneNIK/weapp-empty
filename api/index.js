/**
 * 后端接口定义
 * service层
 */
const http = require("../utils/http")

const service = {
  // 获取记录列表
  getRecordList: () => {
    return http.request("/urgent/list", "GET")
  },
  // 获取记录详情
  getRecordDetail: urgentId => {
    return http.request("/urgent/viewById", "GET", { urgentId })
  },
  saveRecord: data => {
    return http.request("/urgent/save", "POST", data)
  },
  // 获取用户填报信息
  urgentView: openId => {
    return http.request("/urgent/view", "GET", { openId })
  },
  // 静默登陆
  login: jsCode => {
    return http.request("/weapp/login", "GET", { jsCode })
  },
  // 微信授权登陆
  weappLogin: ({ encryptedData, iv, weappToken, nickName, avatarUrl }) => {
    return http.request("/user/login/weapp", "POST", {
      encryptedData,
      iv,
      weappToken,
      nickName,
      avatarUrl
    })
  },
  // 获取用户信息
  getUserInfo: () => {
    return http.request("/user/info", "GET")
  },
  logout: () => {
    return http.request("/user/logout", "POST")
  }
}

module.exports = {
  ...service
}
