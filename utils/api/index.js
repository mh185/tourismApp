import { request } from '../request.js'
var app = getApp();

//微信登陆入口
export function login(params) {
    return request({
        url: '/login/v1/in/applets?code=' + params.code+'&appId=wx7e192938c604b4a3',
        // url: '/login/v1/in/applets?code=' + params.code + '&appId=wxc6b43d3847bd37f9',
        method: 'POST',
    })
}
//获取用户电话
export function getTel(params) {
    return request({
        url: '/login/getMobile',
        method: 'POST',
        data: params
    })
}
//查询用户协议
export function selectUserAgreement(params) {
    return request({
        url: `/userAgreement/v1/select?type=${params.type}`,
        method: 'POST',
        data: params,
        header: {
          "content-type": "application/json",
          "web": "true",
          "mall": "DDH",
          "token":app.globalData.token 
        },
    })
}
//微信注册
export function userRegisterByWx(params) {
    return request({
        url: '/login/v1/setInfo',
        method: 'POST',
        data: params
    })
}
//获取用户sessionkey
export function getSessionKey(params) {
    return request({
        url: '/suser/getKey?code=' + params.code + '&openId=' + params.openId,
        method: 'GET',
    })
}
//发送验证码
export function setSmscode(params) {
    return request({
        url: '/msmscode/setSmscode',
        method: 'POST',
        data: params
    })
}
//手机号登录
export function telLogin(params) {
    return request({
        url: '/suser/addTel',
        method: 'POST',
        data: params
    })
}
//查询banner
export function queryBanner(params) {
    return request({
        url: '/mbanner/queryBanner',
        method: 'POST',
        data: params
    })
}
//获取首页导航菜单
export function sdictQuerydict(params) {
    return request({
        url: '/sdict/querydict',
        method: 'POST',
        data: params
    })
}
//猜你喜欢
export function guessYouLike(params) {
    return request({
        url: '/mgoods/guessYouLike',
        method: 'POST',
        data: params
    })
}
// 商家列表
export function querySeller(params) {
    return request({
        url: '/sseller/querySeller',
        method: 'POST',
        data: params
    })
}
//查询商品
export function mgoodsQueryGoods(params) {
    return request({
        url: '/mgoods/queryGoods',
        method: 'POST',
        data: params
    })
}
//查询商品详情
export function queryGoodsDetail(params) {
    return request({
        url: '/mgoods/queryGoodsDetail',
        method: 'POST',
        data: params
    })
}
//查询商品标签(成套规格)
export function queryGoodsLabel(params) {
    return request({
        url: '/mgoods/queryGoodsLabel',
        method: 'POST',
        data: params
    })
}

//刷新评论(商品评论)
export function queryThemeComment(params) {
    return request({
        url: '/mcomment/queryThemeComment',
        method: 'POST',
        data: params
    })
}
//添加商品到购物车、收藏
export function saveCart(params) {
    return request({
        url: '/scart/saveCart',
        method: 'POST',
        data: params
    })
}
//查询购物车、收藏
export function queryCart(params) {
    return request({
        url: '/scart/queryCart',
        method: 'POST',
        data: params
    })
}
//修改购物车、收藏
export function updateCart(params) {
    return request({
        url: '/scart/updateCart',
        method: 'POST',
        data: params
    })
}
//移除购物车、收藏
export function deleteCart(params) {
    return request({
        url: '/scart/deleteCart',
        method: 'POST',
        data: params
    })
}
//查询购物车、收藏数量
export function queryCartNum(params) {
    return request({
        url: '/scart/queryCartNum',
        method: 'POST',
        data: params
    })
}
//获取收货地址
export function queryAddress(params) {
    return request({
        url: '/address/queryAddress',
        method: 'POST',
        data: params
    })
}
//添加收货地址
export function saveAddress(params) {
    return request({
        url: '/address/saveAddress',
        method: 'POST',
        data: params
    })
}
//商家详情
export function querySellerDetail(params) {
    return request({
        url: '/sseller/querySellerDetail',
        method: 'POST',
        data: params
    })
}
//获取省
export function queryProvinces(params) {
    return request({
        url: '/marea/queryProvinces',
        method: 'POST',
        data: params
    })
}
//获取市
export function queryCities(params) {
    return request({
        url: '/marea/queryCities',
        method: 'POST',
        data: params
    })
}
//获取区
export function queryAreaes(params) {
    return request({
        url: '/marea/queryAreaes',
        method: 'POST',
        data: params
    })
}
//修改收货地址
export function updateAddress(params) {
    return request({
        url: '/address/updateAddress',
        method: 'POST',
        data: params
    })
}
//删除收货地址
export function deleteAddress(params) {
    return request({
        url: '/address/deleteAddress',
        method: 'POST',
        data: params
    })
}

//生成订单
export function saveOrder(params) {
    return request({
        url: '/morder/saveOrder',
        method: 'POST',
        data: params
    })
}
//微信支付小程序
export function weixinPayXCX(params) {
    return request({
        url: '/lpay/weixinPayXCX',
        method: 'POST',
        data: params
    })
}
//查询公告
export function querynotice(params) {
    return request({
        url: '/mtheme/queryTheme',
        method: 'POST',
        data: params
    })
}
//资讯详情
export function queryThemeDetail(params) {
    return request({
        url: '/mtheme/queryThemeDetail',
        method: 'POST',
        data: params
    })
}
//热门搜索
export function hotSearch() {
    return request({
        url: '/mgoods/hotSearch',
        method: 'POST',
    })
}
//我的搜索记录
export function myHistorySearch(params) {
    return request({
        url: '/mgoods/myHistorySearch',
        method: 'POST',
        data: params
    })
}
//删除我的搜索记录
export function deleteMyHistorySearch(params) {
    return request({
        url: '/mgoods/deleteMyHistorySearch',
        method: 'POST',
        data: params
    })
}
//我的搜索商品
export function searchGoods(params) {
    return request({
        url: '/mgoods/searchGoods',
        method: 'POST',
        data: params
    })
}

//银联支付接口
export function unionpay(params) {
    return request({
        url: '/lpay/unionpay',
        method: 'POST',
        data: params,
    })
}

/**
 * 查询秒杀商品
 */
export function queryMSeckillForWX(params) {
    return request({
        url: '/mseckill/queryMSeckillForWX',
        method: 'POST',
        data: params,
    })
}
/**
 * 查询秒杀商品详情
 */
export function getSeckillDetails(params) {
    return request({
        url: '/mseckill/queryMSeckillDetail',
        method: 'POST',
        data: params,
    })
}
/**
 * 查询拼团商品
 */
export function queryGoodsLabelGroupForWeb(params) {
    return request({
        url: '/mgoodslabelgroup/queryGoodsLabelGroupForWeb',
        method: 'POST',
        data: params,
    })
}
/**
 * 查询拼团商品详情
 */
export function queryGroupGoodsDetail(params) {
    return request({
        url: '/mgoodslabelgroup/queryGroupGoodsDetail',
        method: 'POST',
        data: params,
    })
}
/**
 * 获取正在进行中的拼团
 */
export function queryGroupGoodsUser(params) {
    return request({
        url: '/mgoodslabelgroup/queryGroupGoodsUser',
        method: 'POST',
        data: params,
    })
}
/**
 * web店铺列表
 */
export function querySellerGoods(params) {
    return request({
        url: '/mgoods/querySellerGoods',
        method: 'POST',
        data: params,
    })
}
/**
 * 查询优惠券
 */
export function queryDiscountForPC(params) {
    return request({
        url: '/mdiscount/queryDiscountForPC',
        method: 'POST',
        data: params,
    })
}

/**
 * 生成新的支付订单
 */
export function addOrderNew(params) {
    return request({
        url: '/morder/saveNewOrder',
        method: 'POST',
        data: params,
    })
}

/**
 * 领取优惠卷
 */
export function claimCard(params) {
    return request({
        url: '/mdiscount/receiveDiscount',
        method: 'POST',
        data: params,
    })
}
/**
 * 我的优惠卷
 */
export function myCard(params) {
    return request({
        url: '/mdiscount/myDiscount',
        method: 'POST',
        data: params,
    })
}

/**
 * WEB美食店铺列表
 */
export function queryFoodGoods(params) {
    return request({
        url: '/mgoods/queryFoodGoods',
        method: 'POST',
        data: params,
    })
}
/**
 * WEB美食店铺详情
 */
export function queryFoodGoodsDetail(params) {
    return request({
        url: '/mgoods/queryFoodGoodsDetail',
        method: 'POST',
        data: params,
    })
}
/**
 * 首页热门商品
 */
export function IndexHotGoodsList(params) {
    return request({
        url: '/mgoods/queryRecommendGoods',
        method: 'POST',
        data: params,
    })
}
export function getToken(params) {
    return request({
        url:'/login/v1/getToken',
        method:'POST',
        data:params
    })
}
export function pageQuery(params) {
  return request({
    url: '/banner/v1/pageQuery',
    method: 'POST',
    data: params
  })
}
