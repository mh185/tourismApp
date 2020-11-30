import { request } from '../request.js'

// 拉取平台优惠券
export function getSystemDiscount(params) {
	return request({
		url: '/mdiscount/getSystemDiscount',
		method: 'POST',
		data: params
	})
}

// 领取优惠券
export function receiveDiscount(params) {
	return request({
		url: '/mdiscount/receiveDiscount',
		method: 'POST',
		data: params
	})
}
