var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息
import { request } from '../request.js'
// 获取首页精品路线
export function getRouteList(params) {
	return request({
		url: '/selectedRoutes/v1/minApp/home/pageQuery',
		method: 'POST',
		data: params
	})
}

// 获取首页精品路线
export function getRouteTravelAgents(params) {
	return request({
		url: '/selectedRoutes/v1/selectOne/travelAgents',
		method: 'POST',
		data: params
	})
}
// 获取精品路线文本
export function getRouteOne(params) {
	return request({
		url: '/selectedRoutes/v1/selectOne',
		method: 'POST',
		data: params
	})
}
// 获取首页精品路线Banner
export function getRouteBanner(params) {
	return request({
		url: '/selectedRoutes/v1/selectOne/banner',
		method: 'POST',
		data: params
	})
}
//获取精品路线导航
export function getRoutesType(){
	return request({
		url:'/routesType/v1/miniApp/all',
		method:'POST',

	})
}
//路线列表
export function routesLine(params){
	return request({
		// url:'/selectedRoutes/v1/minApp/travelAgents/pageQuery',
		url:'/selectedRoutes/v1/minApp/pageQuery',
		method:'POST',
		data:params
	})
}

