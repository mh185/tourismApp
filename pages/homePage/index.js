// pages/homePage/index.js
import {
    queryBanner,
    guessYouLike,
    querySeller,
    sdictQuerydict,
    mgoodsQueryGoods,
    querynotice,
    login,
    IndexHotGoodsList
} from '../../utils/api/index'

import {
    getSystemDiscount,
    receiveDiscount
} from '../../utils/api/discount'

import { formatTimeLine } from '../../utils/util'
import { getGoodsList } from '../../utils/api/myCollect'

var bmap = require('../../libs/bmap-wx.js');
var app = getApp();
const imgUrl = app.globalData.imgUrl

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: imgUrl,
        userId: '',
        bnrUrl: [], //banner图
        navMenu: [], //菜单导航
        startPage: 1, //猜你喜欢页数
        isMore: true, //是否加载更多,
        imgheights: [], //所有图片的高度  
        current: 0, //默认  
        site: '', //位置
        latitude: '', //纬度
        longitude: '', //经度
        hostGoodslist: [],
        sellerList: null, //商家列表
        sellerGoodsList: null, //商家商品列表
        commentPoint: [{
            dark: '../../images/icon-pentag-no.png',
            bright: '../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../images/icon-pentag-no.png',
            bright: '../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../images/icon-pentag-no.png',
            bright: '../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../images/icon-pentag-no.png',
            bright: '../../images/icon-pentag-Yes.png',
        }, {
            dark: '../../images/icon-pentag-no.png',
            bright: '../../images/icon-pentag-Yes.png',
        }],
        youLikeGoods: [], //猜你喜欢商品
        youLikeShop: [], //猜你喜欢商家
        youLikeShopGoodsList: [], //猜你喜欢商家商品
        orderNum: 0,
        information: null,
        discountModel: false,
        discountList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        // 登录
        wx.login({
            success: res => {
                var params = {
                    code: res.code,
                    appId:"wx7e192938c604b4a3"
                }
                
                login(params).then(element => {
                    if (element.status == 1) {
                        if (element.data.phone != null && element.data.phone != '') {
                            app.globalData.userId = element.data.id
                            app.globalData.wxUserInfo = element.data
                            app.globalData.openId = element.data.openId
                            that.setData({
                                userId: element.data.id
                            })
                            that.guessYouLike()
                        } else {
                            that.guessYouLike()
                        }
                    } else {
                        app.globalData.openId = element.data.openId
                        that.guessYouLike()
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getLatAndLon()
        this.queryBanner()
        this.sdictQuerydict()
        this.querySeller()
        this.getHostGoods()
        this.querynotice()
        this.onShowNav()
    },
    onShowNav:function(){
        console.log(this.getTabBar())
        if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    },
    //搜索
    search: function () {
        wx.navigateTo({
            url: '/pages/homePage/search/index',
        });
    },
    //猜你喜欢
    youMayAlsoLikeMore: function () {
        wx.navigateTo({
            url: '/pages/homePage/youMayAlsoLike/index',
        });
    },
    //获取经纬度
    getLatAndLon: function () {
        var that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
                that.getSite(res.latitude, res.longitude)
            }
        })
    },
    //重新获取定位
    Reacquire: function () {
        var that = this
        wx.openSetting({
            success(res) {
                if (res.authSetting["scope.userLocation"]) {
                    // res.authSetting["scope.userLocation"]为trueb表示用户已同意获得定位信息，此时调用getlocation可以拿到信息
                    wx.getLocation({
                        type: 'wgs84',
                        success(res) {
                            that.setData({
                                latitude: res.latitude,
                                longitude: res.longitude,
                            })
                            that.getSite(res.latitude, res.longitude)
                        }
                    })
                }
            }
        })
    },
    //获取地址
    getSite: function (latitude, longitude) {
        var that = this
        var BMap = new bmap.BMapWX({
            ak: 'xYIZh0RCKZzGvGUWov7bsTCArZMvG8yL',
            location: latitude + ',' + longitude
        });
        var fail = function (data) { };
        var success = function (data) {
            that.setData({
                site: data.originalData.result.addressComponent.city
            })
        }
        // 发起regeocoding检索请求 
        BMap.regeocoding({
            fail: fail,
            success: success
        });
    },
    //进店铺
    enterTheShop: function (event) {

        var sellerid = event.currentTarget.dataset.sellerid
        wx.navigateTo({
            url: '/pages/enterTheShop/index?sellerid=' + sellerid,
        });
    },
    // 跳转
    shopFilter: function (event) {
        var id = event.currentTarget.dataset.id
        var name = event.currentTarget.dataset.name
        var img = event.currentTarget.dataset.img
        switch (name) {
            case '促销活动':
                return wx.navigateTo({
                    url: '/pages/promotion/index',
                });
                break;
            case '远东百货':
                return wx.navigateTo({
                    url: '/pages/ydShopFilter/index?id=' + id + '&name=' + name + '&img=' + img,
                });
                break;
            // case '虚拟物品':
            //     return wx.navigateTo({
            //         url: '/pages/shopFilter/finefood/index?id=' + id + '&name=' + name + '&img=' + img,
            //     });
            //     break;
            default:
                return wx.navigateTo({
                    url: '/pages/shopFilter/index?id=' + id + '&name=' + name + '&img=' + img,
                });
        }

    },
    //获取banner
    queryBanner: function () {
        const that = this
        var params = {
            isShow: 0,
            showOrder: 0,
            type: 1,
            startPage: 1,
            pageSize: 10,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryBanner(params).then(res => {
            wx.hideLoading()
            if (res.status == 200) {
                that.setData({
                    bnrUrl: res.data.data
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
    //顶部轮播图高度
    imageLoad: function (e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheights;
        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;

        this.setData({
            imgheights: imgheights
        })
    },
    bindchange: function (e) {
        this.setData({ current: e.detail.current })
    },
    //获取首页一级导航
    sdictQuerydict: function () {
        const that = this
        var params = {
            code: 'firstclass',
            startPage: 1,
            pageSize: 10000
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        sdictQuerydict(params).then(res => {
            if (res.status == 200) {
                var Array = res.data.data
                var list = this.group(Array, 5)
                this.setData({
                    navMenu: list
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
    // 拆分数组
    group: function (array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    },
    //推荐商家更多
    recomBusinessMore: function () {
        wx.navigateTo({
            url: '/pages/homePage/recomBusiness/index',
        });
    },
    //推荐商家
    querySeller: function () {
        const that = this
        var params = {
            recom: 1,
            startPage: 1,
            pageSize: 3,
            state: 1,
            isDelete: 0
        }

        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        querySeller(params).then(res => {
            if (res.status == 200) {
                this.setData({
                    sellerList: res.data
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
            wx.hideLoading()
        })
    },
    //获取推荐商家商品
    getGoodsList: function (ids) {
        getGoodsList({ ids }).then(res => {
            if (res.status == 200) {
                this.setData({
                    sellerGoodsList: res.data
                })
            }
        })
    },
    //热卖商品
    getHostGoods: function () {
        const that = this
        var params = {
            startPage: 1,
            pageSize: 4
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

        IndexHotGoodsList(params).then(res => {
            if (res.status == 200) {
                that.setData({
                    hostGoodslist: res.data
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
    //猜你喜欢筛选
    likefilter: function (event) {
        const that = this
        var orderNum = event.currentTarget.dataset.ordernum
        that.setData({
            orderNum: orderNum,
        })
        if (orderNum == 1) {
            //猜你喜欢商家
            that.guessYouLike()
        } else {
            that.guessYouLike()
        }
    },
    //猜你喜欢
    guessYouLike: function () {
        const that = this
        var params = {
            orderNum: that.data.orderNum,
            userId: that.data.userId,
            lng: that.data.longitude,
            lat: that.data.latitude,
            startPage: 1,
            pageSize: 10,
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
        guessYouLike(params).then(res => {
            if (res.status == 200) {
                if (that.data.startPage == 1) {
                    this.setData({
                        youLikeGoods: [],
                        youLikeShop: []
                    })
                }
                var youLikeShopList = that.data.youLikeShop.concat(res.data.sellerList)
                that.setData({
                    youLikeGoods: that.data.youLikeGoods.concat(res.data.data),
                    youLikeShop: youLikeShopList
                })


                if (that.data.orderNum == 1) {
                    var ids = []
                    youLikeShopList.forEach(v => {
                        ids.push(v.id)
                    })
                    ids = ids.toString();
                    that.youLikeShopGoods(ids)
                } else {
                    wx.hideLoading()
                }

                if (res.data.total == res.data.iTotalDisplayRecords) {
                    that.setData({
                        isMore: false
                    })
                } else {
                    that.setData({
                        isMore: true
                    })
                }

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
                this.setData({
                    isMore: true
                })
                wx.hideLoading()
            }

        })

        // 拉取优惠券
        this.getDiscount()
    },
    //获取猜你喜欢商家商品
    youLikeShopGoods: function (ids) {

        getGoodsList({ ids }).then(res => {
            if (res.status == 200) {
                this.setData({
                    youLikeShopGoodsList: res.data
                })
                wx.hideLoading()
            }
        })
    },
    //跳转商品详情页面
    shopDetails: function (event) {
        var id = event.currentTarget.dataset.id;

        let type = event.currentTarget.dataset.type;

        switch (+type) {

            case 0:

                wx.navigateTo({
                    url: '/pages/commodity/productDetails/index?id=' + id
                });
                break;

            case 1:

                wx.navigateTo({
                    url: '/pages/commodity/groupDetails/index?id=' + id
                });
                break;


            case 2:

                wx.navigateTo({
                    url: '/pages/commodity/seckillDetails/index?id=' + id
                })
                break;
            default:

                wx.navigateTo({
                    url: '/pages/commodity/productDetails/index?id=' + id
                });
                break;

        }
        // wx.navigateTo({
        //     url: '/pages/commodity/productDetails/index?id=' + id
        // });
    },
    //查询公告
    querynotice: function () {
        var params = {
            status: 1,
            startPage: 1,
            pageSize: 10,
            userId: ''
        }
        querynotice(params).then(res => {
            if (res.status == 200) {
                console.log(res);
                if (res.data.data != null && res.data.data.length > 0) {
                    var list = res.data.data;
                    // list.body = this.delHtmlTag(list.body)
                    this.setData({
                        information: list
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
    //跳转公告列表
    mation: function () {
        wx.navigateTo({
            url: '/pages/homePage/mation/index',
        });
    },
    //去除标签
    delHtmlTag: function (str) {
        return str.replace(/<[^>]+>/g, "");
    },
    //热卖商品更多
    hotShopList: function () {
        wx.navigateTo({
            url: '/pages/homePage/hotShopList/index',
        });
    },
    /**
     * 关闭 优惠券弹窗
     */
    closeDiscountModelBtn: function () {
        this.setData({
            discountModel: false
        })
    },

    /**
     * 获取优惠券
     */
    getDiscount() {
        const showTime = wx.getStorageSync('discountModelShowTime')
        const nowTime = formatTimeLine(new Date())

        // 每天只弹一次
        if (showTime && showTime === nowTime) {
            return
        }

        // 拉取优惠券
        getSystemDiscount({
            userId: app.globalData.userId
        }).then(res => {
            if (res.status === 200 && res.data && res.data.length) {
                this.setData({
                    discountModel: true,
                    discountList: res.data.map(v => {
                        const discountDate = JSON.parse(v.discountDate)
                        v.formatEndDate = discountDate.endDate
                        v.isReceived = false
                        return v
                    })
                })
                wx.setStorageSync('discountModelShowTime', nowTime)
            }
        })
    },

    /**
     * 领取优惠券
     */
    receiveDiscount(event) {
        const id = event.currentTarget.dataset.id
        const list = this.data.discountList

        receiveDiscount({
            discountId: id
        }).then(res => {
            if (res.status === 200) {
                list.forEach(v => {
                    if (v.id === id) {
                        v.isReceived = true
                    }
                })
                this.setData({
                    discountList: list
                })
                wx.showModal({
                    title: '提示',
                    content: '优惠券领取成功',
                    showCancel: false
                })
            } else {
                if (res.msg) {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: false
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})