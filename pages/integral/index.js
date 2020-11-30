// pages/integral/index.js
import {
    signInDay
} from '../../utils/api/myCenter'
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        integral: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getIntegral()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    // 查询经验值
    getIntegral: function() {
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        signInDay({
            userId: app.globalData.userId
        }).then(res => {
            if (res.status == 200) {
                this.setData({
                    integral: res.data.Integral
                });
            }
            wx.hideLoading()
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    //跳转商品详情页面
    shopDetails: function(event) {
        var id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/integral/productDetails/index?id=' + id
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})