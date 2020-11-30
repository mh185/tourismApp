// pages/user/myOrder/index.js
import { queryOrder, updateOrder } from '../../../utils/api/myOrder'
import { unionpay } from '../../../utils/api/index'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,

        needInfo: {
            startPage: 1,
            pageSize: 10,
            status: '', //订单状态
        },
        pageCount: 0, //总页数
        load: true,
        loading: false, //加载动画的显示
        total: 0, //总条数
        list: [], //订单列表
        imgUrl: imgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });
        that.getQueryOrder()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            list: []
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
    //取消订单
    cancelOrder: function(e) {

        const that = this
        let isTag = e.currentTarget.dataset.istag
        console.log(isTag, 'isTag')
        let isTagTitle = ''
        var data = {
            id: e.currentTarget.dataset.ordernum,
        }
        if (isTag == 'qx') {

            data['status'] = 15
            isTagTitle = '是否取消此订单'
        } else if (isTag == 'del') {
            isTagTitle = '是否删除此订单'
            data['isDelete'] = 1
        } else if (isTag == 'qrsh') {
            isTagTitle = '是否确认收货'
            data['status'] = 5
        }
        console.log(isTagTitle, 'isTagTitle')
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
                        wx.hideLoading()
                        if (res.status == 200) {
                            wx.showToast({
                                title: res.msg,
                                icon: 'none',
                                duration: 1500,
                            })
                            that.getQueryOrder()
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
    //禁止左右滑动
    forbidMove(e) { return; },
    //查询订单
    getQueryOrder: function() {
        const that = this
        var data = {
            userId: app.globalData.userId,
            startPage: that.data.needInfo.startPage,
            pageSize: that.data.needInfo.pageSize,
            status: that.data.needInfo.status,
            isDelete: 0
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        let mainData = []
        queryOrder(data).then(res => {

            if (res.status == 200) {
                wx.hideLoading()
                mainData = res.data.data
                for (let i = 0; i < mainData.length; i++) {
                    mainData[i]['totalGoodsNum'] = 0
                    for (let j = 0; j < mainData[i].goods.length; j++) {
                        mainData[i]['totalGoodsNum'] += mainData[i].goods[j].goodsNum
                        mainData[i].goods[j].goodsHeadImg = JSON.parse(mainData[i].goods[j].goodsHeadImg)
                    }
                }
                if (that.data.needInfo.startPage == 1) {
                    that.setData({
                        list: mainData,
                    })
                } else {
                    that.setData({
                        list: that.data.list.concat(mainData)
                    })
                }
                that.setData({
                    total: res.data.total,
                    pageCount: res.data.pageCount
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
    //跳转详情
    details: function(e) {
        wx.navigateTo({
            url: '/pages/user/myOrder/details/index?orderId=' + e.currentTarget.dataset.orderid,
        });
    },
    //跳转退款
    afterSalesRefund: function() {
        return
        wx.navigateTo({
            url: '/pages/user/myOrder/afterSalesRefund/index',
        });
    },
    //跳转查看物流
    Logistics: function() {
        wx.navigateTo({
            url: '/pages/user/myOrder/Logistics/index',
        });
    },
    //加载更多
    accountManagerList: function(e) {
        const that = this
        if (that.data.load) { //全局标志位，方式请求未响应是多次触发
            if (that.data.needInfo.startPage < that.data.pageCount) {
                that.data.needInfo.startPage = that.data.needInfo.startPage + 1;
                that.setData({
                    load: true,
                    loading: false,
                })
                that.getQueryOrder()
            } else {
                wx.showToast({
                    title: '暂无更多数据',
                    icon: 'none',
                    duration: 1500,
                })
                return
            }
        }
    },
    //  tab切换逻辑
    swichNav: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
        that.data.needInfo.startPage = 1
        if (e.target.dataset.current == 0) {
            that.data.needInfo.status = '' //全部
        } else if (e.target.dataset.current == 1) {
            that.data.needInfo.status = 0 //待付款
        } else if (e.target.dataset.current == 2) {
            that.data.needInfo.status = '1,2' //待发货
        } else if (e.target.dataset.current == 3) {
            that.data.needInfo.status = '3,4' //待收货（已发货）
        } else if (e.target.dataset.current == 4) {
            that.data.needInfo.status = '5,6' //已完成（已评价）
        }
        that.getQueryOrder()
    },
    bindChange: function(e) {
        var that = this;
        that.setData({ currentTab: e.detail.current });
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
        const that = this

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