import {request} from '../ydRequest.js'
//微信登陆入口
export function login(params) {

	return request({
		url: '/login/v1/in/applets?code='+params.code,
		method: 'POST',		
	})
}
/**
 * 远东百货店铺列表
 */
export function querySellerGoods(params) {
	return request({
		url: '/mgoods/querySellerGoods',
		method: 'POST',
		data:params
	})
}
/**
 * 获取导航菜单
 */
export function sdictQuerydict(params) {
	return request({
		url: '/sdict/querydict',
		method: 'POST',
		data:params
	})
}
/**
 * 查询商品
 */
export function mgoodsQueryGoods(params) {
	return request({
		url: '/mgoods/queryGoods',
		method: 'POST',
		data:params
	})
}
/**
 * 远东店铺列表
 */ 
export function querySeller(params) {
	return request({
		url: '/mgoods/querySellerGoods',
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