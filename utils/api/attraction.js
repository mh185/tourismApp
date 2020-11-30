import { request } from '../request.js'
var app = getApp();
// 导览
export function getImg(a){
  return request({
    url:'/scenicSpot/v1/queryListByVo?page=1&size=5',
    method:'POST',
    data:a,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    }
  })
}
//导览nav类型

export function guideType(){
  return request({
    url:'/regionAreas/v1/pageQueryByCityCode?cityCode=450200',
    method:'POST',
  })
}
// 列表
export function guideList(params,page){
  return request({
    url:`/scenicSpot/v1/queryBookingScenicListByVo?page=${page}&size=10`,
    method:"POST",
    data:params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    }
  })
}
// 柳州市景点
export function getCity(params){
  return request ({
    url:'/regionAreas/v1/pageQueryByCityCode',
    method:'POST',
    data:params
  })
}
// 景区详情
export function getDetail(params){
  return request({
    url:'/scenicSpot/v1/selectOne',
    method:'POST',
    data:params
  })
}

// 景区热度
export function getHot(params){
  return request({
    url:'/scenicSpot/v1/queryHotScenicSpot',
    method:'POST',
    data:params
  })
}
// 五区精选列表
export function queryTopScenicSpot(){
  return request({
    url: `/scenicSpot/v1/queryTopScenicSpot`,
    method:'POST',
  })
}

//景区首页-区县查询
export function navType(){
  return request({
    url:'/regionAreas/v1/pageQueryByCityCode?cityCode=450200',
    method:'POST',
  })
}
//景区首页列表
export function scenicList(data){
  console.log(data);
  let {page,size,params}= data;
  return request({
    url:`/scenicSpot/v1/queryListByVo?page=${page}&size=${size}`,
    method:'POST',
    data:params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token":app.globalData.token 
    }
  })
}
export function panoramaList(data){
  console.log(data);
  let {page,size}= data;
  return request({
    url:`/scenicSpot/v1/queryPanoramicMap?page=${page}&size=${size}`,
    method:'POST',
    data:{
      type:'TOURISM'
    }
    // header: {
    //   "content-type": "application/json",
    //   "web": "true",
    //   "mall": "DDH",
    //   "token":app.globalData.token 
    // }
  })
}
// 目的地查询景区
export function queryDestination(params) {
  return request({
    url: `/scenicSpot/v1/queryDestination?page=${params.page}&size=10`,
    method: "POST",
    data: params,
    header: {
      "content-type": "application/json",
      "web": "true",
      "mall": "DDH",
      "token": app.globalData.token
    }
  })
}