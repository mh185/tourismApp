// pages/user/myOrder/afterSalesRefund/index.js

import {
    fillOrderNumber
} from '../../../../utils/api/myOrder'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderGoodsId: '', //skuid
        expressCompany: '',
        refundExpressNumber: '',
        phone: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orderGoodsId: options.orderGoodsId
        })

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

    },
    //提 交单号信息
    fillOrderNumber: function() {
        const that = this
        if (that.data.expressCompany == '' || that.data.refundExpressNumber == '' || that.data.phone == '') {
            wx.showToast({
                title: '请填写完整信心',
                icon: 'none',
                duration: 1500,
            })
            return
        }
        var data = {
            orderGoodsIds: that.data.orderGoodsId,
            expressCompany: that.data.expressCompany, // 快递公司
            refundExpressNumber: that.data.refundExpressNumber, // 快递单号
            phone: that.data.phone, // 手机号
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        fillOrderNumber(data).then(res => {
            wx.hideLoading()

            if (res.status == 200) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'none',
                    duration: 1500,
                })
                wx.navigateBack({
                    delta: 1 // 返回上一级页面。
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

    fillForm(e) {
        let v = e.detail.value
        let type = e.currentTarget.dataset.type;
        switch (type) {
            case 'company':
                this.setData({
                    expressCompany: v
                })
                break;
            case 'number':
                this.setData({
                    refundExpressNumber: v
                })
                break;
            case 'phone':
                this.setData({
                    phone: v
                })
                break;
        }

        console.log(v, '---------v------')
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