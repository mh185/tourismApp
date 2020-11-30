import { request } from '../request.js'
var app = getApp();
// 查看用户是否已经实名认证
export function getRealAuth(params) {
  return request({
    url: `/userHealthCode/v1/miniApp/getRealAuth`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    },
  })
}
// 查看健康码
export function getHealthCode(params) {
  return request({
    url: `/userHealthCode/v1/miniApp/getHealthCode`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    },
  })
}
// 根据token获取健康码用户身份证信息
export function getHealthUserInfo() {
  return request({
      url:'/userHealthCode/v1/miniApp/getUserRealInfo',
      method:'POST',
      // data:params,
      header: {
          "content-type": "application/json",
          "web": "true",
          "mall": "DDH",
          "token":app.globalData.token 
      },
  })
}
// 完成实名认证
export function registRealAuth(params) {
  return request({
    url: `/userHealthCode/v1/miniApp/registRealAuth?cardNumber=${params.cardNumber}&cardType=${params.cardType}&realName=${params.realName}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    },
  })
}