/**
 * 时间格式化
 * @param {*} date 
 */
// year/month/day hour:minute:second
const formatTime = date => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
    // year-month-day
const formatTimeLine = (date, spac) => {
    console.log(date, 'date')
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    let s = spac ? spac : '-';
    return [year, month, day].map(formatNumber).join(s)
}
//month/day
const formatTimeMonday = (date, spac) => {
    console.log(date, 'date')
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    let s = spac ? spac : '/';
    return [month, day].map(formatNumber).join(s)
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function addZero(i) {
    return i < 10 ? "0" + i : i + "";
}
const formatTimeDown = (time) => {
    console.log(time, '[h, m, s]')
    let t = time / 1000;
    var h = parseInt(t / (60 * 60));
    var m = parseInt(t / 60 % 60);
    var s = parseInt(t % 60);
    h = addZero(h);
    m = addZero(m);
    s = addZero(s);
    // console.log([h, m, s], '[h, m, s]')
    return [h, m, s];
}

function orderData(orderLists, origin) {

    var app = getApp();
    var orderList = []
    orderLists.forEach((shop, index) => {
        let list = [];
        shop.goods.forEach((good, idx) => {
            let obj;
            // 如果是来购物车
            if (origin == 'shopCar') {

                obj = {
                    cartId: good.labelId, // sku Id
                    cartLabel: good.cartLabel, // sku 名称
                    cartNum: good.cartNum, // sku 数量
                    cartPrice: good.cartPrice, // sku 价格
                    freightPrice: good.freightPrice, // 邮费
                    goodsId: good.goodsId, // 商品ID
                    goodsLabel: [], // 规格列表
                    headImg: good.headImg,
                    integral: good.integral, // 积分
                    name: good.name, // 商品名称
                    price: good.price, // 当前价格
                    rawPrice: good.rawPrice, // 原来价格
                    stockNum: good.stockNum, // 库存数据
                    distributorUserId: app.globalData.shareId, // 分享人ID
                    type: 0, //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)
                    objId: good.labelId, // skuId 拼团 秒杀 取 活动ID
                    goodsTitle: good.name, // 商品名称
                    goodsNum: good.cartNum, // sku 数量
                    goodsLabel: good.cartLabel, // sku 名称
                    goodsHeadImg: good.headImg, // 
                    goodsNowPrice: good.cartPrice,
                    parentGroupId: '',
                    status: 0 //类型(0:一般订单;1:美食订单;)

                }

            } else {
                //  其他页面
                let goodsNowPrice, objId, number, stock
                switch (+good.goods_type) {
                    // 正常商品
                    case 0:
                        goodsNowPrice = good.sku.price;
                        objId = good.sku.id;
                        number = good.sku.number;
                        stock = good.sku.stock;
                        break;
                        // 秒杀
                    case 1:
                        goodsNowPrice = good.sku.activityObj.seckillPrice;
                        objId = good.sku.activityObj.id;
                        // number = good.sku.activityObj.maxBuyNum
                        number = good.sku.number
                        stock = good.sku.activityObj.seckillStock > 1 ? 1 : good.sku.activityObj.seckillStock; // 秒杀最多两件,多余两件改成2件。
                        break;
                        // 拼团
                    case 2:
                        goodsNowPrice = good.sku.activityObj.groupPrice;
                        objId = good.sku.activityObj.id;
                        number = good.sku.number
                        stock = good.sku.activityObj.groupStock
                        break;
                    case 3:
                        // 积分
                        goodsNowPrice = good.sku.price;
                        objId = good.sku.id;
                        number = good.sku.number
                        stock = good.sku.stock;
                        break;


                }
                obj = {
                    cartId: good.sku.id, // sku Id
                    cartLabel: good.sku.labelName, // sku 名称
                    cartNum: number, // sku 数量
                    cartPrice: goodsNowPrice, // sku 价格
                    freightPrice: good.freightPrice, // 邮费
                    goodsId: good.id, // 商品ID
                    goodsLabel: [], // 规格列表
                    headImg: good.headImg,
                    integral: 0, // 积分
                    name: good.name, // 商品名称
                    price: good.nowPrice, // 当前价格
                    rawPrice: good.rawPrice, // 原来价格
                    stockNum: stock, // 库存数据
                    distributorUserId: app.globalData.shareId, // 分享人ID
                    parentGroupId: good.parentGroupId, // 拼团Id
                    type: good.goods_type, //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)
                    objId: objId, // skuId 拼团 秒杀 取 活动ID
                    goodsTitle: good.name, // 商品名称
                    goodsNum: number, // sku 数量
                    goodsLabel: good.sku.labelName, // sku 名称
                    goodsHeadImg: good.headImg, // 
                    goodsNowPrice: goodsNowPrice,
                    status: 0 //类型(0:一般订单;1:美食订单;)

                }

            }

            list.push(obj);



        })
        let order;
        if (origin == 'shopCar') {
            order = {
                sellerId: shop.sellerId, // 商家Id 
                shopName: shop.shopName, // 商家名称
                courierFee: shop.courierFee, // 邮费
                integral: '', // 积分
                price: 0, // 总价格
                body: '',
                startDate: "",
                endDate: "",
                remarks: '', // 备注
                // discountId: '', //优惠券id
                type: 0,
                goods_type: 0, //頁面展示使用类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)
                goods: list // 购买的商品列表
            }
        } else {
            order = {
                sellerId: shop.seller.id, // 商家Id 
                shopName: shop.seller.shopName, // 商家名称
                courierFee: shop.seller.freightPrice, // 邮费
                integral: '', // 积分
                price: '', // 总价格
                body: '',
                startDate: "",
                endDate: "",
                remarks: '', // 备注
                // discountId: '', //优惠券id
                type: 0,
                goods_type: shop.goods_type,
                goods: list // 购买的商品列表
            }
        }


        orderList.push(order)

    })




    console.log(app.globalData, 'app.globalData')
    app.globalData.confirmOrder = orderList;
    console.log(app.globalData, 'app.globalData')

}



module.exports = {
    formatTime: formatTime,
    formatTimeLine: formatTimeLine,
    orderData,
    formatTimeDown,
    formatTimeMonday:formatTimeMonday
}