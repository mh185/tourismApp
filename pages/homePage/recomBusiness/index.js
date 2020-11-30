// pages/homePage/recomBusiness/index.js
import { querySeller } from '../../../utils/api/index'
import { getGoodsList } from '../../../utils/api/myCollect'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: imgUrl,
        userId: '',
        sellerList: [],
        sellerGoodsList: {},
        commentPoint: [{
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../../images/icon-pentag-no.png',
            bright: '../../../images/icon-pentag-Yes.png',
        }],
        startPage: 1,
        pageSize: 3,
        noMoreData: false,
        lat: '',
        lng: '',
        orderNum: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.querySeller()
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
            userId: app.globalData.userId
        })

    },
    //推荐商家
    querySeller: function() {
        const that = this
        var params = {
            recom: 1,
            lat: this.data.lat,
            lng: this.data.lng,
            orderNum: this.data.orderNum,
            startPage: this.data.startPage,
            pageSize: this.data.pageSize,
            state: 1,
            isDelete:0
        }

        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        querySeller(params).then(res => {
            if (res.status == 200) {

                if (res.data.length == 0 && this.data.startPage > 1) {

                    this.setData({
                        noMoreData: true
                    })
                } else {
                    this.setData({
                        noMoreData: false
                    })
                }
                this.setData({
                    sellerList: this.data.sellerList.concat(res.data),
                    // sellerGoodsList: []
                })
                var ids = []
                res.data.forEach(v => {
                    ids.push(v.id)
                })
                ids = ids.toString();
                this.getGoodsList(ids)

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }

        })
    },
    //获取推荐商家商品
    getGoodsList: function(ids) {
        getGoodsList({ ids }).then(res => {
            if (res.status == 200) {
                this.setData({
                    sellerGoodsList: Object.assign(this.data.sellerGoodsList, res.data)
                })
                console.log(this.data.sellerGoodsList, 'sellerGoodsList')
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
    //进店铺
    enterTheShop: function(event) {
        var sellerid = event.currentTarget.dataset.sellerid
        wx.navigateTo({
            url: '/pages/enterTheShop/index?sellerid=' + sellerid,
        });
    },
    //筛选商品
    checkProduct: function(event) {
        this.setData({
            sellerGoodsList: {},
            sellerList: [],
            noMoreData: false
        })
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
                                that.querySeller()
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
            that.querySeller()
        }
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
        this.setData({
            startPage: ++this.data.startPage
        })
        this.querySeller()
        console.log('到底加载~~~~~~~~~~~~')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})