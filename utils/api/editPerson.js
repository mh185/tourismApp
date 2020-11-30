import { request } from '../request.js'
//修改用户信息
export function updateUser(params) {
    return request({
        url: '/suser/updateUser',
        method: 'POST',
        data: params
    })
}
// POST /suser/authenticationUser

export function auth(params) {
    return request({
        url: '/suser/authenticationUser',
        method: 'POST',
        data: params
    })
}