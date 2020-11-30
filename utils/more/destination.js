import { request } from '../request.js'
var app = getApp();
// 目的地
export function queryDestination(params) {
  return request({
    url: `/scenicSpot/v1/queryDestination?page=${params.page}&size=10`,
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
// 添加出行人信息
export function insertTravelers(params) {
  return request({
    url: '/traveler/v1/insert',
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
// 查询当前用户下所有出行人信息
export function queryAllTraveler(params) {
  return request({
    url: '/traveler/v1/queryAllTraveler?page=1&size=10',
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
// 修改出行人信息
export function travelerUpdate(params) {
  return request({
    url: '/traveler/v1/update',
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
// 删除出行人信息
export function travelerDelete(params) {
  return request({
    url: `/traveler/v1/delete?id=${params.id}`,
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
// 删除出行人信息
export function selectOne(params) {
  return request({
    url: `/traveler/v1/selectOne?id=${params.id}`,
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
// 预约
export function scenicSpotBookingInsert(params) {
  return request({
    url: `/scenicSpotBooking/v1/insert`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    },
  })
}
// 我的预约
export function queryIndexBookingList(params) {
  return request({
    url: `/scenicSpotBooking/v1/queryIndexBookingList?page=${params.page}&size=${params.size}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    },
  })
}
// 我的预约详情
export function queryBookingDetail(params) {
  return request({
    url: `/scenicSpotBooking/v1/queryBookingDetail?id=${params.id}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    },
  })
}
// 取消预约
export function queryBookingDelete(params) {
  return request({
    url: `/scenicSpotBooking/v1/delete?id=${params.id}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    },
  })
}
// /scenicSpotBooking/v1/queryRemainCapacity?scenicSpotId=1
// 选择日期
export function queryRemainCapacity(params) {
  return request({
    url: `/scenicSpotBooking/v1/queryRemainCapacity?scenicSpotId=${params.scenicSpotId}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    },
  })
}