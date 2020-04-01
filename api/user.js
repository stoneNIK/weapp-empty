const http = require("../utils/http");

export default {
  // 静默登陆
  login: jsCode => {
    return http.request("/weapp/login", "GET", { jsCode });
  },
  // 微信授权登陆
  weappLogin: ({ encryptedData, iv, weappToken, nickName, avatarUrl }) => {
    return http.request("/user/login/weapp", "POST", {
      encryptedData,
      iv,
      weappToken,
      nickName,
      avatarUrl
    });
  },
  // 获取用户信息
  getUserInfo: () => {
    return http.request("/user/info", "GET");
  },
  logout: () => {
    return http.request("/user/logout", "POST");
  }
};
