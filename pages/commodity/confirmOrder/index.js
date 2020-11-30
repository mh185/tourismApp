// pages/commodity/confirmOrder/index.js
import { queryAddress, saveOrder, unionpay, deleteCart, addOrderNew, myCard } from '../../../utils/api/index'
import { formatTimeLine } from '../../../utils/util'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number: 1,
        imgUrl: imgUrl,
        userId: app.globalData.userId,
        addressData: null, //收货地址
        confirmOrderList: [], // 确认订单数据，老数据
        totalMoney: 0, //总价
        remarks: [], //备注
        orderId: [], //订单Id
        prompt: false,
        invoiceData: null,
        goodsDetails: {}, // 商品详情
        discountIds: {}, // 优惠卷Id

        couponModel: false, // 优惠卷弹框
        cardList: [], // 卡卷列表
        cardIndex: 0, // 商家的索引
        totalDiscountAmount: 0,

        goods_type: '', //类型(0:一般商品 ;1：秒杀订单；2：拼团订单；3：积分兑换)

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

        // this.getCardList();
        this.setData({
            userId: app.globalData.userId,
            // goodsDetails: app.globalData.goodsDetails, // 商品详情
            // goods_type: app.globalData.goodsDetails.goods_type
        })

        console.log(this.data.goodsDetails, '------------------------')
        this.getShopInfor()

    },

    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function() {

        if (app.globalData.address != null && app.globalData.address != '') {
            this.setData({
                addressData: app.globalData.address,
            })
        } else {
            this.getQueryAddress()
        }


    },
    //获取收货地址
    getQueryAddress: function() {
        const that = this
        var params = {
            userId: app.globalData.userId,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryAddress(params).then(res => {
            if (res.status == 200) {
                var data = null
                res.data.forEach(v => {
                    if (v.status == 1) {
                        data = v
                    }
                });
                if (data == null && res.data.length > 0) {
                    data = res.data[0]
                }
                that.setData({
                    addressData: data
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            wx.hideLoading()
        })
    },
    // 切换地址
    getAddress: function() {
        if (this.data.addressData != null && this.data.addressData != '') {
            wx.navigateTo({
                url: '/pages/user/setUp/harvestAddress/index',
            });
        } else {
            wx.navigateTo({
                url: '/pages/user/setUp/addAddress/index?type=add',
            });
        }
    },
    //获取商品
    getShopInfor: function() {
        var confirmOrderList = app.globalData.confirmOrder

        var money = 0,
            courierFee = 0, // 邮费
            remarks = []
        var remarksList = {}
        confirmOrderList.forEach(v => {

            // 优惠卷  初始化  start

            this.data.discountIds[v.sellerId] = {};
            this.data.discountIds[v.sellerId].DiscountAmount = 0;
            this.data.discountIds[v.sellerId].type = [] // 类型
            this.data.discountIds[v.sellerId].ids = [] // 优惠卷ID

            // end  

            courierFee += v.courierFee || 0
            var sellerId = v.sellerId
            remarksList[sellerId] = ''
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    money += list.cartPrice * list.cartNum
                })
            }
        })
        money += courierFee
        this.setData({
            remarks: remarksList,
            totalMoney: money.toFixed(2),
            confirmOrderList: confirmOrderList
        })
    },
    //备注
    remarks: function(event) {
        var sellerid = event.currentTarget.dataset.sellerid
        for (var arr in this.data.remarks) {
            if (arr == sellerid) {
                this.data.remarks[arr] = event.detail.value
            }
        }

        this.setData({
            remarks: this.data.remarks
        })
    },
    //减
    less: function(event) {
        var cartid = event.currentTarget.dataset.cartid
        var carList = this.data.confirmOrderList
        var money = 0,
            courierFee = 0
        carList.forEach(v => {
            courierFee += v.courierFee
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (list.cartId == cartid) {
                        if (list.cartNum <= 1) {
                            wx.showToast({
                                title: '至少有一个商品',
                                icon: 'none',
                                duration: 1500,
                            })
                            money += list.cartPrice * list.cartNum
                        } else {
                            list.cartNum--
                                money += list.cartPrice * list.cartNum
                        }
                    } else {
                        money += list.cartPrice * list.cartNum
                    }
                })
            }
        })
        money += courierFee - this.data.totalDiscountAmount
        this.setData({
            totalMoney: money.toFixed(2),
            confirmOrderList: carList
        })
    },
    //加
    plus: function(event) {
        var cartid = event.currentTarget.dataset.cartid
        var carList = this.data.confirmOrderList
        var money = 0,
            courierFee = 0
        carList.forEach(v => {
            courierFee += v.courierFee
            if (v.goods != null && v.goods.length > 0) {

                v.goods.forEach(list => {
                    if (list.cartId == cartid) {
                        if (list.cartNum >= list.stockNum) {
                            money += list.cartPrice * list.cartNum
                            wx.showToast({
                                title: '以达到最大数量',
                                icon: 'none',
                                duration: 1500,
                            })
                        } else {

                            list.cartNum++
                                money += list.cartPrice * list.cartNum
                        }
                    } else {
                        money += list.cartPrice * list.cartNum
                    }
                })
            }
        })
        money += courierFee - this.data.totalDiscountAmount
        this.setData({
            totalMoney: money.toFixed(2),
            confirmOrderList: carList
        })
    },

    getprompt: function() {

        if(this.data.addressData== null || this.data.addressData.length==0){

            wx.showToast({
              title: '请先设置地址',
              icon:'none'
            })

            return false;
        }
        this.setData({
            prompt: !this.data.prompt
        })
    },


    //生成订单
    getSaveOrder: function() {

        if(app.globalData.wxUserInfo == null || app.globalData.wxUserInfo.openId == null || !app.globalData.userId){

            wx.showToast({
              title: '登录信息有误，请重新登录',
              icon:'none'
            })

            return  false;
        }
        const that = this
        var data = this.data.confirmOrderList
        var sellerId = [],
            freight = [],
            integral = [],
            type = [],
            body = [],
            orderGoodsJson = [],
            ids = [] //商家Id,运费,积分,订单类型,订单详情,商品列表json,购物车Id
        data.forEach(v => {
                sellerId.push(v.sellerId)
                integral.push(0)
                type.push(0)
                var shopList = []
                var bodyList = []
                v.goods.forEach(list => {
                        // freight.push(list.freightPrice)   
                        bodyList.push(list.name + list.cartLabel + '*' + list.cartNum)
                        ids.push(list.cartId)
                        var goodelist = {
                            goodsId: list.goodsId,
                            goodsTitle: list.name,
                            goodsNum: list.cartNum,
                            goodsLabel: list.cartLabel,
                            goodsHeadImg: list.headImg,
                            goodsNowPrice: list.cartPrice,
                            status: 0,
                        }
                        shopList.push(goodelist)
                    })
                    // orderGoodsJson.push(JSON.stringify(shopList))
                    // body.push(bodyList.join(","))
                v.body = bodyList.join(",")
            })
            // console.log(this.data.remarks, 'this.data.remarks')
            // console.log(this.data.confirmOrderList, '-------------------')
            // var params={
            //   userId:app.globalData.userId, //用户ID
            //   sellerId:sellerId.join("&"), // 商家Id
            //   integral:integral.join("&"),  // 积分
            //   // freight:freight.join("&"),
            //   userName:this.data.addressData.name, // 收货人
            //   phone:this.data.addressData.phone,  // 收货人电话
            //   pro:this.data.addressData.pro,  // 省
            //   city:this.data.addressData.city,  // 市
            //   area:this.data.addressData.area,  // 区
            //   address:this.data.addressData.address,  // 详细地址
            //   lng:this.data.addressData.lng,  // 经度
            //   lat:this.data.addressData.lat,  // 纬度
            //   type:type.join("&"),  // 
            //   anonymous:0,    // 是否匿名
            //   body:body.join('&'), // 商品名称和规格
            //   remarks:JSON.stringify(this.data.remarks), // 备注
            //   invoice:JSON.stringify(this.data.invoiceData), // 发票信息
            //   buyType:0,  // 购买类型 0 钱 1积分
            //   orderGoodsJson:orderGoodsJson.join('&'),
            //   googsInfo:this.data.googsInfo, // 商品信息
            // }


        //  生成订单参数
        // let sku = this.data.goodsDetails.labelList[this.data.goodsDetails.sectcLabelIndex]; // 选中的规格
        // console.log(sku)
        // let goodsNowPrice = '';
        // let objId = '';
        // switch (+this.data.goods_type) {
        //     case 0:
        //         goodsNowPrice = sku.price;
        //         objId = sku.id;
        //         break;
        //     case 1:
        //         goodsNowPrice = sku.activityObj.seckillPrice;
        //         objId = sku.activityObj.id;
        //         break;
        //     case 2:
        //         goodsNowPrice = sku.activityObj.groupPrice;
        //         objId = sku.activityObj.id;
        //         break;
        //     case 3:
        //         goodsNowPrice = sku.price;
        //         objId = sku.id;
        //         break;


        // }
        let orderList = JSON.parse(JSON.stringify(this.data.confirmOrderList));


        orderList.forEach(shop => {
            shop.orderGoodsInfos = JSON.parse(JSON.stringify(shop.goods)); // goods 和orderGoodsInfos 是同一个  ,这里是更改字段名称
            delete shop.goods;

            shop.orderGoodsInfos.forEach(good => {
                good.goodsNum = good.cartNum; //更新值
                shop.price = shop.price + (good.goodsNum * good.goodsNowPrice) // 计算每个商家订单的总价格

                delete good.cartId; // 删除展示的元素
                delete good.cartLabel;
                delete good.cartNum;
                delete good.cartPrice;
                delete good.headImg;
            })
            console.log(this.data.remarks[shop.sellerId], 'this.data.remarks[shop.sellerId]')
            shop.remarks = this.data.remarks[shop.sellerId]; // 每个商家对应的备注
            shop.discountId = this.data.discountIds[shop.sellerId].ids; // 每个商家对应的 优惠ID

            try {
                shop.invoice = this.data.invoiceData[shop.sellerId] // 每个商家对应的 发票
            } catch (error) {
                shop.invoice = {}
            }

            shop.price = (+shop.price + shop.courierFee - this.data.discountIds[shop.sellerId].DiscountAmount).toFixed(2) // 每个商家的订单的价格
        })
        console.log(orderList, 'orderListorderListorderListorderList')
            // return false
        let params = {

            userName: this.data.addressData.name, // 收货人
            phone: this.data.addressData.phone, // 收货人电话
            pro: this.data.addressData.pro, // 省
            city: this.data.addressData.city, // 市
            area: this.data.addressData.area, // 区
            address: this.data.addressData.address, // 详细地址
            lng: this.data.addressData.lng, // 经度
            lat: this.data.addressData.lat, // 纬度
            // invoice: JSON.stringify(this.data.invoiceData),
            anonymous: 0, // 是否匿名
            buyType: 0, //购买方式 0：钱 1：积分
            googsInfo: orderList
        }
        params.googsInfo = JSON.stringify(params.googsInfo);
        for (var attr in params) {
            if (params[attr] === null || params[attr] === '') {
                delete params[attr];
            }
        }
        // return false
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        that.setData({
            prompt: false
        })
        addOrderNew(params).then(res => {
            if (res.status == 200) {
                var orderId = []
                res.data.forEach(v => {
                    orderId.push(v.id)
                })
                this.setData({
                    orderId: orderId
                })

                this.getUnionpay(ids.join(','))
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }

        })
    },
    // 打开优惠券弹窗
    openCouponModelBtn: function(e) {
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        this.setData({
            couponModel: true,
            cardIndex: index
        })
        this.getCardList(id)
    },
    // 关闭优惠券弹窗
    couponModelBtn: function() {
        this.setData({
            couponModel: false,
        })
    },
    // 获取优惠价卷列表

    getCardList(id) {

        var params = {
            sellerId: id
        }
        myCard(params).then(res => {

            if (res.status == 200) {

                res.data.forEach(item => {

                    item.endDate = formatTimeLine(new Date(item.endDate));

                })

                this.setData({
                    cardList: res.data
                })

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },

    // 使用优惠卷

    useCard(e) {


        let full = e.currentTarget.dataset.full;
        let id = e.currentTarget.dataset.id;
        let discount = e.currentTarget.dataset.discount;

        let oldDiscount = 0;

        let order = this.data.confirmOrderList[this.data.cardIndex];


        let v = this.data.discountIds[order.sellerId].ids.some(item => {
            return item == id
        });



        if (v) {
            wx.showToast({
                title: '已选择',
                icon: 'none'
            })

            return false
        }





        // 计算是否满足优惠条件
        let price = 0;

        order.goods.forEach(item => {
            price += item.cartPrice * item.cartNum;
        })
        price = price.toFixed(2)

        if (price <= full) {

            wx.showToast({
                title: '不符合使用条件',
                icon: 'none'
            })
        } else {


            let a = this.data.discountIds;
            a[order.sellerId].ids = [];
            a[order.sellerId].ids.push(id)
            a[order.sellerId].DiscountAmount = discount.toFixed(2)

            // 恢复优惠金额,以便下面重新计算

            this.data.totalMoney = +this.data.totalMoney + +this.data.totalDiscountAmount;


            // 总优惠
            let ta = 0;
            this.data.confirmOrderList.forEach(item => {
                if (a[item.sellerId] && a[item.sellerId].DiscountAmount) {
                    ta += +a[item.sellerId].DiscountAmount;

                }
            })
            let m = +this.data.totalMoney - ta <= 0 ? 0 : this.data.totalMoney - ta;


            this.setData({
                discountIds: a,
                totalDiscountAmount: ta,
                couponModel: false,
                totalMoney: m.toFixed(2)
            })
            console.log(this.data.discountIds, '--------discountIds-------')
        }

    },
    //删除购物车商品
    deleteshopCartn: function(ids) {
        var params = {
            ids: ids,
            userId: app.globalData.userId,
            type: 0,
            status: 0,
        }
        deleteCart(params).then(res => {})
    },

    getUnionpay: function(ids) {
        var that = this
        var params = {
            openid: app.globalData.openId,
            orderId: this.data.orderId.join(',')
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        unionpay(params).then(res => {
            if (res.status == 200) {
                // this.deleteshopCartn(ids)
                var data = JSON.parse(res.data)
                console.log(data)
                if (data.errCode == 'SUCCESS') {
                    app.globalData.confirmOrder = null
                    var respStr = JSON.parse(data.respStr)
                    wx.requestPayment({
                        timeStamp: respStr.miniPayRequest.timeStamp, // 1490840662，时间戳
                        nonceStr: respStr.miniPayRequest.nonceStr, // 5K8264ILTKCH16CQ2502SI8ZNMTM67VS，随机字符串不长于32位
                        package: respStr.miniPayRequest.package,
                        signType: respStr.miniPayRequest.signType, // 签名算法类型，默认MD5，支持HMAC-SHA256和MD5
                        paySign: respStr.miniPayRequest.paySign, // 签名,假设已拼接，详细签名格式见下文
                        // timeStamp:'1591947016',     // 1490840662，时间戳
                        // nonceStr:'45817dd041844316adfcef6a2852f2ab',    // 5K8264ILTKCH16CQ2502SI8ZNMTM67VS，随机字符串不长于32位
                        // package:'prepay_id=wx121530159589964755ed1fed1086993700',    
                        // signType: 'RSA',  // 签名算法类型，默认MD5，支持HMAC-SHA256和MD5
                        // paySign:'hs0H56mZ+nB+0LZAPbWwVdamII1f8EMdaxkLMkX8gCc+xUCzwlbXihNPNrsuz1tMi8CHXWEqwSyyHQt8YOSrAmOdpms+C71mWr91OtufZliCYbWAA/pZvqKW6oUd/SSRJY0N+W0K1eyZG5rbwvRI2kldFmiAOHuDBxmrMWZS+5EkZ1sg2eOx1VlDBNgsTwETxje4FKUcNs/9tElEH2bEcc0OKb/I7ANmHWCvA7A68gFrJ50/kavD3xZ+yPPzdfppILtzJ66rVusO+bYB7cNVAXOP6guObI+ETMK0xwZYQ6htfqY1P7gxyq12u7gv9lthJR2jloSrOmbTQ67iqTpxwg==',    // 签名,假设已拼接，详细签名格式见下文
                        success: function(res) {
                            wx.redirectTo({
                                url: "/pages/payStatus/paysuccess/index"
                            });
                        },
                        fail: function(res) {
                            wx.redirectTo({
                                url: "/pages/payStatus/payfailure/index"
                            });
                        },
                        complete: function(res) {}
                    })
                } else {
                    var respStr = JSON.parse(data.respStr)
                    wx.showToast({
                        title: respStr.errMsg,
                        icon: 'none',
                        duration: 1500,
                    })
                }

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
            // wx.hideLoading()
        })
    },
    //设置发票
    invoice: function(event) {
        var sellerid = event.currentTarget.dataset.sellerid
        wx.navigateTo({
            url: "/pages/commodity/invoice/index?sellerid=" + sellerid + "&invoiceData=" + JSON.stringify(this.data.invoiceData)
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        app.globalData.address = null
            // app.globalData.confirmOrder=null
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        app.globalData.address = null
            // app.globalData.confirmOrder=null
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})