const regIdcard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/ //身份证正则
const regPhone = /^1\d{10}$/ //手机号正则
const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ //邮箱正则
const regRealname = /^[\u4e00-\u9fa5]{2,6}$/ //真实姓名中文正则

// fmt YYYY-MM-DD HH:mm:ss
const formatTime = (date, fmt) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var o = {
    "Y+": year, //月份
    "M+": month, //月份
    "D+": day, //日
    "H+": hour, //小时
    "m+": minute, //分
    "s+": second, //秒
    "q+": Math.floor((month + 2) / 3), //季度
    S: date.getMilliseconds() //毫秒
  }
  if (/(Y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (year + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
  return fmt
}

module.exports = {
  formatTime,
  regIdcard,
  regPhone,
  regEmail,
  regRealname
}
