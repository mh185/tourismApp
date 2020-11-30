// pages/homePage/hotShopList/index.js
import { mgoodsQueryGoods } from '../../../utils/api/index'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: imgUrl,
        userId: '',
        orderNum: '',
        startPage: 1,
        isMore: true,
        shopList: [],
        lng: '',
        lat: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.mgoodsQueryGoods()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            userId: app.globalData.userId
        })

    },
    //筛选商品
    checkProduct: function(event) {
        var that = this
        var orderNum = event.currentTarget.dataset.ordernum
        if (orderNum == 0) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                        that.Reacquire()
                    } else {
                        wx.getLocation({
                            type: 'wgs84',
                            success(res) {
                                that.setData({
                                    lat: res.latitude,
                                    lng: res.longitude,
                                    orderNum: orderNum,
                                    startPage: 1
                                })
                                that.mgoodsQueryGoods()
                            }
                        })
                    }
                }
            });
        } else {
            that.setData({
                lat: '',
                lng: '',
                orderNum: orderNum,
                startPage: 1
            })
            that.mgoodsQueryGoods()
        }
    },
    //重新获取定位
    Reacquire: function() {
        var that = this
        wx.openSetting({
            success(res) {
                if (res.authSetting["scope.userLocation"]) {
                    wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                            that.setData({
                                orderNum: 0,
                                lat: res.latitude,
                                lng: res.longitude,
                            })
                            that.mgoodsQueryGoods()
                        }
                    })
                }
            }
        })
    },
    //获取商品
    mgoodsQueryGoods: function() {
        const that = this
        var params = {
            status: 0,
            orderNum: this.data.orderNum,
            lng: this.data.lng,
            lat: this.data.lat,
            startPage: that.data.startPage,
            pageSize: 10
        }
        for (var key in params) {
            if (params[key] === '') {
                delete params[key]
            }
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        mgoodsQueryGoods(params).then(res => {
            if (res.status == 200) {
                if (that.data.startPage == 1) {
                    this.setData({
                        shopList: [],
                    })
                }
                var shopList = this.data.shopList.concat(res.data.data)
                if (res.data.total == res.data.iTotalDisplayRecords) {
                    this.setData({
                        isMore: false,
                        shopList: shopList,
                    })
                } else {
                    this.setData({
                        isMore: true,
                        shopList: shopList,
                    })
                }


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

    //跳转详情页面
    shopDetails: function(event) {
        var id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/commodity/productDetails/index?id=' + id
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.isMore) {
            var page = Number(this.data.startPage) + 1
            this.setData({
                startPage: page
            })
            this.mgoodsQueryGoods()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})