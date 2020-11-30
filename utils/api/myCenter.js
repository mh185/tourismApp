import { request } from '../request.js'

//签到
export function signIn(params) {
    return request({
        url: '/ssign/addSSign',
        method: 'POST',
        data: params
    })
}
//查询签到天数与积分
export function signInDay(params) {
    return request({
        url: '/ssign/querySSign',
        method: 'POST',
        data: params
    })
}
//查询经验值
export function Experience(params) {
    return request({
        url: '/ssign/queryExperience',
        method: 'POST',
        data: params
    })
}
//提现记录
export function withdrawalRecord(params) {
    return request({
        url: '/mordergoodsdistributor/cashDistributorRecord',
        method: 'POST',
        data: params
    })
}
//分佣记录
export function commissionRecord(params) {
    return request({
        url: '/mordergoodsdistributor/queryDistributorDetails',
        method: 'POST',
        data: params
    })
}

// 提现
export function withdrawal(params) {
    return request({
        url: '/mordergoodsdistributor/applyDistributorCash',
        method: 'POST',
        data: params
    })
}
//绑定银行卡
export function bindBankCard(params) {
    return request({
        url: '/mordergoodsdistributor/bindBank',
        method: 'POST',
        data: params
    })
}
//获取银行卡
export function getBindBankCard(params) {
    return request({
        url: '/mordergoodsdistributor/getBindBank',
        method: 'POST',
        data: params
    })
}
// 获取账户信息

export function getAccountInfo(params) {
    return request({
        url: '/saccount/queryAccountPrice',
        method: 'POST',
        data: params
    })
}