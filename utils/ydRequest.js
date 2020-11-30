var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息
const host = app.globalData.host
/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
const request = (params) => {
  //返回promise 对象
  return new Promise((resolve, reject) => {
    if (params.header) {
      params.header["web"] = "true"
      params.header["mall"] = "YDBH"
      // params.header["mall"] = "DDH"

    }
    wx.request({
      url: host + params.url, //服务器url+参数中携带的接口具体地址
      data: params.data, //请求参数
      header: params.header || {
        "Content-Type": "application/x-www-form-urlencoded", //设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
        "web": "true",
        "mall":"YDBH" //远东百货
        // "mall":"DDH" // 大都会

      },
      method: params.method || 'POST', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      dataType: params.dataType, //返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      responseType: params.responseType, //响应的数据类型
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 1500,
          success: function () {
            setTimeout(function () {
              wx.hideLoading()
            }, 1500)
          }
        })
      },
      error: function (e) {
        console.log(e, 'errorerror')
      }

    })
  })
};
/**
 * 上传图片
 * @param {*} params 
 */
const fileUpload = (params) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    wx.uploadFile({
      url: app.globalData.host + '/lfile/fileupload',
      filePath: params.file,
      name: 'file',
      header: {
        'Content-Type': "multipart/form-data",
      },
      success(res) {
        wx.hideLoading()
        res = res.data
        res = JSON.parse(res);
        if (res.status == 200) {
          resolve(res);
        } else {
          wx.showModal({
            content: res.message
          })
        }
      },
      fail(error) {
        wx.hideLoading()
        if (error.responseJSON) {
          wx.showModal({
            content: error.responseJSON.message
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  })
};
module.exports = {
  request: request,
  fileUpload
}