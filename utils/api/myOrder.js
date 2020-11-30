import {
    request
} from '../request.js'

//查询订单
export function queryOrder(params) {
    return request({
        url: '/morder/queryOrder',
        method: 'POST',
        data: params
    })
}

//修改订单状态
export function updateOrder(params) {
    return request({
        url: '/morder/updateOrder',
        method: 'POST',
        data: params
    })
}
//订单退款
export function orderExitAll(params) {
    return request({
        url: '/morder/orderExitAll',
        method: 'POST',
        data: params
    })
}

//退款原因
export function refundCause(params) {
    return request({
        url: '/sdict/querydict',
        method: 'POST',
        data: params
    })
}
//订单退款
export function returnPay(params) {
    return request({
        url: '/lpay/returnPay',
        method: 'POST',
        data: params
    })
}

//评价
export function saveComment(params) {
    return request({
        url: '/mcomment/saveComment',
        method: 'POST',
        data: params
    })
}
// 生成订单

export function createOrder(params) {

    return request({
        url: '/morder/saveNewOrder',
        method: 'POST',
        data: params
    })

}
// 查询退款信息
export function returnInfo(params) {

    return request({
        url: '/orderGoodsRefund/queryRefundInfo',
        method: 'POST',
        data: params
    })

}

//退款接口 新


export function applyReturn(params) {

    return request({
        url: '/orderGoodsRefund/applyRefund',
        method: 'POST',
        data: params
    })

}
// 填写单号

export function fillOrderNumber(params) {

    return request({
        url: '/orderGoodsRefund/commitRefundInfo',
        method: 'POST',
        data: params
    })

}