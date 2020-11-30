import { request } from '../request.js'
var app = getApp();

// 旅行社详情列表
export function travelAgency(params) {
    return request({
      // url: `/travelAgents/v1/miniApp/pageQuery?page=1&size=10&id=${params.id}`,
      url: '/selectedRoutes/v1/minApp/travelAgents/pageQuery?page=1&size=10',
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
export function travelAgencyList(params) {
  return request({
    url: `/travelAgents/v1/miniApp/pageQuery?page=${params.page}&size=${params.size}`,
    method: 'POST',
    data: params,
    // header: {
    //   "content-type": "application/json",
    
    //   "web": "true",
    //   "mall": "DDH",
    //   "token":app.globalData.token 
    // },
  })
}