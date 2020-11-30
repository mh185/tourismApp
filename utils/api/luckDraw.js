import { request } from '../request.js'

// 查询活动列表，取得最新活动
export function queryAllLuck(params) {
	return request({
		url: '/MLuckDraw/queryAllLuck',
		method: 'POST',
		data: params
	})
}

// 查询活动ID
export function queryLuckId(params) {
	return request({
		url: '/MLuckDraw/queryLuckId',
		method: 'POST',
		data: params
	})
}


// 查询活动奖品
export function queryPrize(params) {
	return request({
		url: '/MLuckDraw/queryPrize',
		method: 'POST',
		data: params
	})
}

// 查询用户中奖记录	
export function queryLuckRecord(params) {
	return request({
		url: '/MLuckDraw/queryLuckRecord',
		method: 'POST',
		data: params
	})
}

// 查询用户剩余抽奖次数和积分
export function queryScoreAndluck(params) {
	return request({
		url: '/MLuckDraw/queryScoreAndluck',
		method: 'POST',
		data: params
	})
}

// 抽奖	
export function startLuckDraw(params) {
	return request({
		url: '/MLuckDraw/startLuckDraw',
		method: 'POST',
		data: params
	})
}
