import {request} from '../request.js'

//查询收藏
export function queryCart(params) {
	return request({
		url: '/scart/queryCart',
		method: 'POST',
		data:params
	})
}
//查询店铺商品
export function getGoodsList(params) {
	return request({
		url: '/sseller/queryGoodsBySellerIds',
		method: 'POST',
		data:params
	})
}
//添加收藏
export function saveCart(params) {
	return request({
		url: '/scart/saveCart',
		method: 'POST',
		data:params
	})
}
//移除收藏
export function deleteCart(params) {
	return request({
		url: '/scart/deleteCart',
		method: 'POST',
		data:params
	})
}