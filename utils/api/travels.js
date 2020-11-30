import { request } from '../request.js'
//获取首页攻略列表
export function getTravelsList(params) {
	return request({
		url: '/travels/v1/minApp/home/pageQuery',
		method: 'POST',
    data: params,
	})
}

//获取攻略列表banner
export function getTravelsBanner(params) {
	return request({
		url: '/travels/v1/selectOne/banner',
		method: 'POST',
    data: params,
	})
}

//获取攻略列表详情
export function getTravelsText(params) {
	return request({
		url: '/travels/v1/minApp/selectOne',
		method: 'POST',
    data: params,
	})
}

//点赞！
export function thumbsUp(params){
  return request({
    url:'/travels/v1/minApp/thumbsUp',
    method:'POST',
    data:params
  })
}

//分享
export function travelsShare(params){
  return request({
    url:'/travels/v1/minApp/share',
    method:'POST',
    data:params
  })
}

//游记攻略类型

export function gettravelsType(){
  return request({
    url:'/travelsType/v1/minApp/all',
    method:'POST',
  })
}

//游记攻略列表

export function TravelsList(params){
  return request({
    url:"/travels/v1/minApp/pageQuery",
    method:"POST",
    data:params
  })
}
//游记攻略列表关键字搜索
export function TravelsListKeyword(params){
  return request({
    url:"/travels/v2/minApp/pageQuery",
    method:"POST",
    data:params
  })
}
//获取游记攻略banner

export function travelsBan(params){
  return request({
    url:'/travels/v1/minApp/banner/pageQuery',
    method:'POST',
    data:params
  })
}