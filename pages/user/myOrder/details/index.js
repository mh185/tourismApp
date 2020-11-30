// pages/user/myOrder/details/index.js
import { queryOrder, updateOrder } from '../../../../utils/api/myOrder'
import { unionpay } from '../../../../utils/api/index'
var Dec = require('../../../../utils/can/public.js');
import drawQrcode from '../../../../utils/can/weapp.qrcode.min.js'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '', //订单详情id
        orderdetails: {}, //订单详情
        imgUrl: imgUrl,
        qr: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orderId: options.orderId
        })
        this.getQueryOrder()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            orderdetails: {}
        })
        this.getQueryOrder()
    },
    //前往评价页面
    goEvaluation: function(e) {
        wx.navigateTo({
            url: '/pages/user/myOrder/evaluation/index?orderId=' + e.currentTarget.dataset.ordernum
        });
    },
    //前往退款页面
    goRefund: function(e) {
        wx.navigateTo({
            url: '/pages/user/myOrder/afterSalesRefund/index?orderId=' + e.currentTarget.dataset.orderid,
        });
    },
    // 等待退款审核
    returnMoeny(e) {
        let orderList = this.data.list;
        let type = e.currentTarget.dataset.type;
        let index = e.currentTarget.dataset.index;
        let orderGoodsIds = [] // skuId (規格) 集合
        let status = e.currentTarget.dataset.status;

        switch (type) {
            //  单个
            case 'Single':

                orderGoodsIds.push(e.currentTarget.dataset.skuid);

                break;
                // 多个   
            case 'Multiple':

                orderList[index].goods.forEach(sku => {

                    orderGoodsIds.push(sku.id);

                });

        }
        console.log(orderGoodsIds, 'orderGoodsIdsorderGoodsIds');

        orderGoodsIds = orderGoodsIds.join(',')
            // return false;

        // 代发货退款中
        if (status == 7) {
            wx.navigateTo({
                url: "/pages/user/myOrder/applicationRecord/applicationRecord?orderGoodsId=" + orderGoodsIds
            });

        } else {

            wx.navigateTo({
                url: '/pages/user/myOrder/afterSalesRefund/index?orderGoodsIds=' + orderGoodsIds
            });

        }

    },
    //  填写单号
    goOverInfo(e) {

        let orderGoodsIds = e.currentTarget.dataset.skuid;
        wx.navigateTo({
            url: "/pages/user/myOrder/returnForm/returnForm?orderGoodsId=" + orderGoodsIds
        });
    },
    //取消订单(确认订单，删除订单)
    cancelOrder: function(e) {
        const that = this
        let isTag = e.currentTarget.dataset.istag
        let isTagTitle = ''
        var data = {
            id: e.currentTarget.dataset.ordernum,
        }
        if (isTag == 'qx') {
            data['status'] = 10
            isTagTitle = '是否取消此订单'
        } else if (isTag == 'del') {
            isTagTitle = '是否删除此订单'
            data['isDelete'] = 1
        } else if (isTag == 'qrsh') {
            isTagTitle = '是否确认收货'
            data['status'] = 5
        }
        wx.showModal({
            title: '提示',
            content: isTagTitle,
            success: function(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中....',
                        mask: true
                    })
                    updateOrder(data).then(res => {
                        if (res.status == 200) {
                            if (isTag == 'del') {
                                wx.showToast({
                                    title: '当前订单已被删除',
                                    icon: 'none',
                                    duration: 1500,
                                })
                                wx.navigateTo({
                                    url: '/pages/user/myOrder/index',
                                });

                            } else {

                                wx.showToast({
                                    title: res.msg,
                                    icon: 'none',
                                    duration: 1500,
                                })
                                that.getQueryOrder()
                            }
                        } else {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 1500,
                            })
                        }
                    })

                } else if (res.cancel) {}
            }
        })
    },
    //查询订单详情
    getQueryOrder: function() {
        const that = this
        var data = {
            id: that.data.orderId,
            userId: app.globalData.userId,
            startPage: 1,
            pageSize: 1
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryOrder(data).then(res => {

            if (res.status == 200) {
                wx.hideLoading()
                let mainInfo = res.data.data[0]
                mainInfo['phoneInfo'] = mainInfo.phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2")
                mainInfo.createDate = that.timestampToTime(mainInfo.createDate)
                mainInfo['totalGoodsNum'] = 0
                for (let i = 0; i < mainInfo.goods.length; i++) {
                    mainInfo.totalGoodsNum += mainInfo.goods[i].goodsNum
                    mainInfo.goods[i].goodsHeadImg = JSON.parse(mainInfo.goods[i].goodsHeadImg)
                }
                const qrtxt = mainInfo.orderNum;
                var qr = Dec.Encrypt(qrtxt)
                that.setData({
                    orderdetails: mainInfo,
                    qr: qr,

                })
                drawQrcode({
                    width: 150,
                    height: 150,
                    background: '#ffffff', //背景颜色
                    foreground: '#333', //码颜色
                    canvasId: 'myQrcode',
                    text: qr,
                    correctLevel: 1,
                })

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }

        })

    },

    //前往商品详情
    goGoodsDetails: function(e) {
        // +e.currentTarget.dataset.orderid
        // return
        wx.navigateTo({
            url: '/pages/commodity/productDetails/index?id=' + e.currentTarget.dataset.goodsid,
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },


    //跳转查看物流
    Logistics: function() {
        wx.navigateTo({
            url: '/pages/user/myOrder/Logistics/index',
        });
    },
    //复制物流订单
    reCopy: function(e) {
        const that = this
        wx.setClipboardData({
            data: e.currentTarget.dataset.waybillnum,
            success: function() {
                wx.showToast({
                    title: "复制成功",
                    icon: "none",
                    duration: 2000
                });
            }
        });
    },
    //转换时间
    timestampToTime: function(timestamp) {
        if (timestamp.length <= 10) {
            timestamp = timestamp * 1000
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    },
    //重新支付
    getUnionpay: function(e) {
        var that = this
        var params = {
            openid: app.globalData.openId,
            orderId: e.currentTarget.dataset.ordernum,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        unionpay(params).then(res => {
            if (res.status == 200) {
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
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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