import { request } from '../request.js'
var app = getApp();
// 全局搜索
export function getAllSearch(params) {
  return request({
    url: `/search/v1/getAllSearch?keyWord=${params.keyWord}`,
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
// 搜索历史
export function getUserSearch(params) {
  return request({
    url: `/userSearch/v1/miniApp/getUserSearch?page=${params.page}&size=10`,
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

// 热门搜索
export function getHotSearch(params) {
  return request({
    url: '/userSearch/v1/miniApp/getHotSearch?page=1&size=10',
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

// 删除
export function deleteSearchAll(params) {
  return request({
    url: '/userSearch/v1/miniApp/deleteSearch',
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
// 首页轮播
export function homeBanner(params) {
  return request({
    url: '/banner/v1/miniApp/getBanner?tag=HOME',
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
