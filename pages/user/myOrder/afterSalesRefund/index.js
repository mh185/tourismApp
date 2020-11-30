// pages/user/myOrder/afterSalesRefund/index.js

import {
    refundCause,
    queryOrder,
    returnPay,
    orderExitAll,
    applyReturn
} from '../../../../utils/api/myOrder'
var app = getApp();
const imgUrl = app.globalData.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: imgUrl,
        orderGoodsIds: '', //skuID 集合
        orderdetails: {}, //订单详情
        recuseData: [], //退款原因列表
        index: '', //退货原因下标
        recuseType: [], // 退款类型列表
        recuseTypeIndex: 0, // 退款类型下标

        refundCauseId: '', //退货原因
        detailCause: '', //退货详细原因
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            orderGoodsIds: options.orderGoodsIds
        })
        this.getRefundCause().then(() => {
            this.getRefundCauseType().then(() => {
                this.getQueryOrder()
            })
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
    //提交退款原因
    btnRefund: function() {
        const that = this
        if (that.data.refundCauseId == '') {
            wx.showToast({
                title: '请选择退款原因',
                icon: 'none',
                duration: 1500,
            })
            return
        }
        console.log(this.data.recuseType, 'this.data.recuseType')
        console.log(this.data.refundCauseType, 'this.data.refundCauseType')
        var data = {
            orderGoodsIds: that.data.orderGoodsIds,
            // statusBody: that.data.refundCauseId,
            // reasonForRefund: that.data.detailCause,
            refundType: this.data.refundCauseType, // 退貨類型
            refundReason: that.data.refundCauseId, // 退货原因
            refundDesc: that.data.detailCause, // 详细
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        applyReturn(data).then(res => {
            wx.hideLoading()

            if (res.status == 200) {
                wx.showToast({
                    title: '申请退款成功',
                    icon: 'none',
                    duration: 1500,
                })
                wx.navigateTo({
                    url: "/pages/user/myOrder/applicationRecord/applicationRecord?orderGoodsId=" + this.data.orderGoodsIds
                });
                // wx.navigateBack({
                //     delta: 1 // 返回上一级页面。
                // })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })
            }
        })
    },

    geDetailCause: function(e) {
        this.setData({
            detailCause: e.detail.value
        })
    },
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value,
            refundCauseId: this.data.recuseData[e.detail.value].displayValue
        })
    },
    // 退款类型pickerChange
    bindTypeChange(e) {
        this.setData({
            recuseTypeIndex: e.detail.value,
            refundCauseType: this.data.recuseType[e.detail.value].realValue
        })
    },
    //获取退款原因
    getRefundCause: function() {
        const that = this
        return new Promise(reslove => {
            var data = {
                code: 'reasonForRefund',
                dictType: '退款理由',
                startPage: 1,
                pageSize: 999
            }
            refundCause(data).then(res => {
                that.setData({
                    recuseData: res.data.data
                })
                reslove()
            })
        })
    },
    // 获取退款类型
    getRefundCauseType: function() {
        const that = this
        return new Promise(reslove => {
            var data = {
                code: 'refundType',
                startPage: 1,
                pageSize: 999
            }
            refundCause(data).then(res => {
                that.setData({
                    recuseType: res.data.data
                })
                reslove()
            })
        })
    },
    getQueryOrder: function() {
        const that = this
        var data = {
            orderGoodsIds: that.data.orderGoodsIds,
            userId: app.globalData.userId,
            startPage: 1,
            pageSize: 9999
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        queryOrder(data).then(res => {

            if (res.status == 200) {
                wx.hideLoading()
                let mainInfo = res.data.data[0]
                for (let i = 0; i < mainInfo.goods.length; i++) {
                    mainInfo.goods[i].goodsHeadImg = JSON.parse(mainInfo.goods[i].goodsHeadImg)
                }
                that.setData({
                    orderdetails: mainInfo
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