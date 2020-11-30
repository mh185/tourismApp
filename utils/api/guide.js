import {request} from '../request.js'

export function getScenicDetail(params) {
	return request({
		url: '/scenicSpot/v1/selectOne',
		method: 'POST',
		data:params
	})
}
export function getScenicFacilities(params) {
	return request({
		url: '/scenicFacilities/v1/miniApp/selectByScenicIdAndType',
		method: 'POST',
		data:params
	})
}