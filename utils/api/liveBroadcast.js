import {request} from '../request.js'

//直播列表
export function getLiveBroadList(params) {
	return request({
		url: '/tlive/getLiveRoomList',
		method: 'POST',
		data:params
	})
}