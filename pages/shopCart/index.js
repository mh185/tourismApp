// pages/shopCart/index.js
import { queryCart, updateCart, deleteCart } from '../../utils/api/index'
import { orderData } from '../../utils/util'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEdit: false, //编辑or完成
        imgUrl: imgUrl,
        userId: app.globalData.userId,
        savaCartList: [],
        iSelectAll: true, //是否全选
        totalMoney: 0, //合计金额
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

    },
    //查询购物车
    getQueryCart: function() {
        const that = this
        var params = {
            userId: app.globalData.userId,
            type: 0,
            status: 0,
            startPage: 1,
            pageSize: 1000
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryCart(params).then(res => {
            if (res.status == 200) {
                var data = res.data
                console.log(data, '购物车')
                var money = 0
                data.forEach(v => {
                    if (v.goods != null && v.goods.length > 0) {
                        v.goods.forEach(list => {
                            list.checked = true
                            money += list.cartPrice * list.cartNum
                        })
                    }
                })
                this.setData({
                    totalMoney: money.toFixed(2),
                    savaCartList: data
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
    //删除购物车商品
    deleteBtn: function() {
        var ids = [],
            objectId = []
        var carList = this.data.savaCartList
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (list.checked) {
                        ids.push(list.cartId)
                    }
                })
            }
        })
        var params = {
            ids: ids.join(","),
            userId: app.globalData.userId,
            type: 0,
            status: 0,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        deleteCart(params).then(res => {
            if (res.status == 200) {
                wx.showToast({
                    title: '移除购物车成功',
                    icon: 'none',
                    duration: 1500,
                })
                this.setData({
                    isEdit: false
                })
                this.getQueryCart()
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

    //商品
    groupChange: function(e) {
        var selecteData = e.detail.value
        var carList = this.data.savaCartList
        var money = 0
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    list.checked = false
                    if (selecteData != null && selecteData.length > 0) {
                        selecteData.forEach(res => {
                            if (list.cartId == res) {
                                list.checked = true
                                money += list.cartPrice * list.cartNum
                            }
                        })
                    } else {
                        list.checked = false
                    }
                })
            }
        })
        this.setData({
            totalMoney: money.toFixed(2),
            savaCartList: carList
        })
        this.singleCheck();

    },

    // 单选  

    singleCheck() {
        var carList = this.data.savaCartList;
        let bln
        try {
            carList.forEach(c => {

                bln = c.goods.every(g => {
                    console.log(g.checked, 'g.checked')
                    return g.checked == true
                })

                if (!bln) {
                    this.setData({
                        iSelectAll: bln
                    })
                    throw new Error('stop');


                }

            })
        } catch (e) {

            if (e.message == 'stop') throw e;

        }


        console.log(this.data.savaCartList, '------------------------------');


        this.setData({
            iSelectAll: bln
        })


    },
    //全选
    selectAll: function(e) {
        var data = e.detail.value
        var iSelectAll = false
        var carList = this.data.savaCartList
        var money = 0
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (data != null && data.length > 0) {
                        money += list.cartPrice * list.cartNum
                        list.checked = true
                        iSelectAll = true
                    } else {
                        list.checked = false,
                            iSelectAll = false
                    }
                })
            }
        })
        this.setData({
            totalMoney: money.toFixed(2),
            iSelectAll: iSelectAll,
            savaCartList: carList
        })


    },
    // 编辑
    EditBtn: function() {
        var that = this
        var carList = this.data.savaCartList
        var iSelectAll = true
        var money = 0
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (!that.data.isEdit) {

                        list.checked = false
                        iSelectAll = false
                    } else {
                        money += list.cartPrice * list.cartNum
                        list.checked = true
                        iSelectAll = true
                    }

                })
            }
        })

        this.setData({
            totalMoney: money.toFixed(2),
            savaCartList: carList,
            isEdit: !that.data.isEdit,
            iSelectAll: iSelectAll,
        })
    },
    //减
    less: function(event) {
        var cartid = event.currentTarget.dataset.cartid
        var carList = this.data.savaCartList
        var cartShop = null
        var money = 0
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (list.cartId == cartid) {
                        if (list.cartNum <= 1) {
                            wx.showToast({
                                title: '至少有一个商品',
                                icon: 'none',
                                duration: 1500,
                            })
                        } else {
                            list.cartNum--
                                money += list.cartPrice * list.cartNum
                            cartShop = list
                        }
                    } else {
                        money += list.cartPrice * list.cartNum
                    }
                })
            }
        })
        if (cartShop != null && cartShop != '') {
            var params = {
                id: cartShop.cartId,
                label: cartShop.cartLabel,
                labelId: cartShop.labelId,
                cartPrice: cartShop.price,
                num: cartShop.cartNum
            }
            wx.showLoading({
                title: '加载中....',
                mask: true
            })
            updateCart(params).then(res => {
                if (res.status == 200) {
                    this.setData({
                        totalMoney: money.toFixed(2),
                        savaCartList: carList
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


        }
    },
    //加
    plus: function(event) {
        var cartid = event.currentTarget.dataset.cartid
        var carList = this.data.savaCartList
        var cartShop = null
        var money = 0
        carList.forEach(v => {
            if (v.goods != null && v.goods.length > 0) {
                v.goods.forEach(list => {
                    if (list.cartId == cartid) {
                        if (list.cartNum >= list.stockNum) {
                            wx.showToast({
                                title: '以达到最大商品库存',
                                icon: 'none',
                                duration: 1500,
                            })
                        } else {

                            list.cartNum++
                                money += list.cartPrice * list.cartNum
                            cartShop = list
                        }
                    } else {
                        money += list.cartPrice * list.cartNum
                    }
                })
            }
        })

        if (cartShop != null && cartShop != '') {
            var params = {
                id: cartShop.cartId,
                label: cartShop.cartLabel,
                labelId: cartShop.labelId,
                cartPrice: cartShop.price,
                num: cartShop.cartNum
            }
            wx.showLoading({
                title: '加载中....',
                mask: true
            })
            updateCart(params).then(res => {
                if (res.status == 200) {
                    this.setData({
                        totalMoney: money.toFixed(2),
                        savaCartList: carList
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

        }

    },
    //去购物
    goShopping: function() {
        wx.navigateTo({
            url: '/pages/homePage/index'
        })
    },

    //进入商品详情
    details: function(event) {
        var id = event.currentTarget.dataset.goodsid
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
    //去结算
    goSettlement: function() {
        var savaCartList = this.data.savaCartList
        var dataList = []
        savaCartList.forEach(v => {
            var list = {
                courierFee: v.freightPrice,
                sellerId: v.sellerId,
                shopName: v.shopName,
                goods: []
            }
            v.goods.forEach((goodsList) => {
                if (goodsList.checked) {
                    // list.courierFee+=goodsList.freightPrice
                    list.goods.push(goodsList)
                }
            })
            if (list.goods != null && list.goods.length > 0) {
                dataList.push(list)
            }

        })

        if (dataList != null && dataList.length > 0) {


            orderData(dataList, 'shopCar')
            wx.navigateTo({
                url: '/pages/commodity/confirmOrder/index',
            });
        } else {
            wx.showToast({
                title: '请选择结算的商品',
                icon: 'none',
                duration: 1500,
            })
        }


    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (app.globalData.userId != null && app.globalData.userId != '') {
            this.getQueryCart()
        }else {
            this.setData({
                savaCartList:[]
            })
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})