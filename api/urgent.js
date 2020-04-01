const http = require("../utils/http");

export default {
  // 获取记录列表
  getRecordList: () => {
    return http.request("/urgent/list", "GET");
  },
  // 获取记录详情
  getRecordDetail: urgentId => {
    return http.request("/urgent/viewById", "GET", { urgentId });
  },
  // 提交信息
  saveRecord: data => {
    return http.request("/urgent/save", "POST", data);
  },
  // 获取用户填报信息
  urgentView: openId => {
    return http.request("/urgent/view", "GET", { openId });
  }
};
