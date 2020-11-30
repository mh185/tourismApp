// pages/user/myOrder/applicationRecord/applicationRecord.js\
import { returnInfo } from '../../../../utils/api/myOrder'
import { formatTimeLine, formatTimeDown } from '../../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodId: '', //商品id
        data: {},
        timer: '',
        downTime: [],
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

        this.getReturnGoodInfo()
    },
    //查询退款信心
    getReturnGoodInfo: function() {
        const that = this
        var data = {
            orderGoodsId: that.data.orderGoodsId,
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        returnInfo(data).then(res => {

            if (res.status == 200) {
                wx.hideLoading()

                res.data.refundTime = formatTimeLine(new Date(res.data.refundTime), '-')
                this.data.timer = setInterval(() => {
                    let t = res.data.refundOutTime - new Date().getTime();
                    if (t <= 0) {
                        clearInterval(this.data.timer);
                    }
                    let downtime = formatTimeDown(t);

                    this.setData({
                        downTime: downtime
                    })

                }, 1000);

                this.setData({
                    data: res.data
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