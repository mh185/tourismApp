import { request } from '../request.js'
var app = getApp();
// 景区列表
export function getScenicList(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/list?page=${params.page}&size=${params.size}`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 景区详情
export function getScenicDetailInfo(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/detailInfo?id=${params.id}`,
    method: 'GET',
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 预约
export function scenicReservation(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/Reservation`,
    method: 'POST',
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 预约记录
export function GetList(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/GetList`,
    method: 'GET',
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 预约详情
export function GetByID(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/GetByID`,
    method: 'GET',
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 取消预约
export function cancel(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/cancel`,
    method: 'GET',
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}
// 确认入园
export function EnterGarden(params) {
  return request({
    url: `/scenicSpotBooking/Appointment/v2/EnterGarden`,
    method: 'GET',
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}