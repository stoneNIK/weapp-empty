const http = require("../utils/http");

export default {
  // 上传文件
  uploadFile: (filePath, name = "file", formData) => {
    return http.upload("/file/upload", filePath, name, formData);
  },
  // 上传专网文件
  uploadPvtFile: (filePath, name = "file", formData) => {
    return http.pvtUpload("/file/upload", filePath, name, formData);
  }
};
