/**
 * HTTPS 网络请求
 */

// 引入常量命名
const configs = require("../config/index")
const consts = require("../config/consts")
// 接口域名和端口
let PUBLIC_API_ROOT =
  configs[wx.getStorageSync(consts.WEAPP_ENV) || "dev"].API_ROOT

// 公网请求头
const PUBLIC_REQUEST_HEADER = () => ({
  "Content-type": "application/json",
  Token: wx.getStorageSync(consts.TOKEN),
  Version: "1.0.0"
})

// 默认显示加载
const showLoading = () => {
  wx.showNavigationBarLoading()
}
// 默认隐藏加载
const hideLoading = () => {
  wx.hideNavigationBarLoading()
}

// 跳转登录
const navigateToLogin = () => {
  const pages = getCurrentPages ? getCurrentPages() : []
  const loginPage = "/pages/login/index"
  if (
    pages.length > 0 &&
    loginPage.indexOf(pages[pages.length - 1].route) > -1
  ) {
    return
  }
  wx.navigateTo({ url: loginPage })
}

// 错误请求处理方法 data 错误原始数据
const beforeRejectErrorProcess = (error, data, showToast = true) => {
  if (error.msg && showToast) {
    wx.showToast({
      title: error.msg,
      icon: "none",
      duration: 2000
    })
  }
  return { error, data: data || error }
}

// reject处理
const processRequestError = (reject, error, data, showToast = true) => {
  reject(beforeRejectErrorProcess(error, data, showToast))
}
// 处理请求相应
const processRequstResult = (res, resolve, reject, showToast = true) => {
  // 非正常响应
  if (res.statusCode < 200 || res.statusCode > 299) {
    processRequestError(
      reject,
      {
        msg: res.errMsg,
        code: res.statusCode
      },
      {},
      showToast
    )
    return
  }
  // 定义登陆失效状态
  if (res.data.code == 1008) {
    navigateToLogin()
    return
  }
  if (res.data.code != 1000) {
    processRequestError(
      reject,
      {
        code: res.data.code,
        msg: res.data.msg
      },
      res.data,
      showToast
    )
    return
  }
  resolve(res.data.data || res.data)
}

/**
 * @method httpRequest 网络请求
 * @param {String} url, // 请求路径
 * @param {String} method, // 类型 GET/POST/DELETE/UPDATE
 * @param {Object} data, // 请求数据
 * @param {Object} options // 可扩展参数
 * @param {Object} options.header // 自定义请求头
 * @return {Promise}
 */
function httpRequest(url, method = "POST", data = {}, options = {}) {
  const { header, showToast } = options
  return new Promise((resolve, reject) => {
    showLoading()
    wx.request({
      url: url,
      data: data,
      method: method,
      header,
      success(res) {
        processRequstResult(res, resolve, reject, showToast)
      },
      fail(e) {
        processRequestError(
          reject,
          {
            code: -1,
            msg: "网络请求异常，请稍后再试！"
          },
          {},
          showToast
        )
      },
      complete() {
        hideLoading()
      }
    })
  })
}

/**
 * @method upload 上传文件
 * @param {*} url
 * @param {*} filePath
 * @param {*} name
 * @param {*} formData
 * @param {*} header
 */
function upload(url, filePath, name, formData = {}, header = {}) {
  showLoading()
  return new Promise(function(resolve, reject) {
    wx.uploadFile({
      url,
      filePath,
      name,
      header: Object.assign({}, header, {
        "Content-type": "multipart/form-data"
      }),
      formData,
      success: function(res) {
        if (typeof res.data === "string") {
          const resData = res.data
          try {
            res.data = JSON.parse(resData)
          } catch (error) {
            res.data = resData
          }
        }
        processRequstResult(res, resolve, reject)
      },
      fail: function(e) {
        reject({
          status: -1,
          msg: "上传文件出错，请稍后再试!"
        })
      },
      complete: function() {
        hideLoading()
      }
    })
  })
}

module.exports = {
  request: (url, method = "POST", data = {}, options = { showToast: true }) => {
    url = PUBLIC_API_ROOT + url
    return httpRequest(url, method, data, {
      ...options,
      header: Object.assign({}, options.header, PUBLIC_REQUEST_HEADER())
    })
  },
  upload: (url, name, filePath, formData = {}) => {
    let header = {}
    url = PUBLIC_API_ROOT + url
    header = PUBLIC_REQUEST_HEADER()
    return upload(url, name, filePath, formData, header)
  }
}
