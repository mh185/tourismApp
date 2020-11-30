// pages/user/editPerson/index.js
var tcity = require("../../../utils/citys.js");
import {
    withdrawalRecord,
    getAccountInfo,
    commissionRecord
} from '../../../utils/api/myCenter'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nowNum: "362,342.00", //当前佣金
        listData: [{
            title: "分佣提现",
            time: "2020-05-24  12:36",
            num: -252.00
        }, {
            title: "分佣提现",
            time: "2020-05-24  12:36",
            num: -252.00
        }, {
            title: "分佣提现",
            time: "2020-05-24  12:36",
            num: -252.00
        }],
        startPage: 1,
        pageSize: 10,
        noData: false,
        noMoreData: false,
        dataList: [], // 列表数据
        accountData: {},
        tabIndex: '1'
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function(options) {

    },
    onReady() {
        this.getAccountInfo()
        this.withdrawalRecord();
    },
    onShow() {

    },

    swhTab(e) {
        let index = e.currentTarget.dataset.index;

        this.setData({
            tabIndex: index
        })

        this.setData({
            startPage: 1
        })

        this.setData({
            dataList: []
        })

        this.withdrawalRecord();
    },

    // 获取账户信息

    getAccountInfo() {

        let params = {
            type: 0
        }

        getAccountInfo(params).then(res => {

            if (res.status == 200) {
                res.data.price = res.data.price.toFixed(2)
                this.setData({
                    accountData: res.data
                })
            }
        })
    },

    //提现 & 分佣记录 记录
    withdrawalRecord() {
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        let _this = this;
        let params = {
            startPage: this.data.startPage,
            pageSize: this.data.pageSize
        }
        let getData = this.data.tabIndex == 1 ? commissionRecord : withdrawalRecord;
        getData(params).then(res => {
            if (res.status == 200) {

                // 没有数据
                if (res.data.length == 0 && _this.data.startPage == 1) {

                    _this.setData({
                        noData: true
                    })

                } else {
                    _this.setData({

                        noData: false

                    })

                }
                // 没有更多数据
                if (res.data.length == 0 && _this.data.startPage > 1) {

                    _this.setData({
                        noMoreData: true
                    })

                } else {
                    _this.setData({

                        noMoreData: false

                    })

                }

                // 列表数据
                let data = _this.data.dataList;


                res.data.forEach(item => {

                    this.data.tabIndex == 1 ?
                        item.commission = item.commission.toFixed(2) :
                        item.price = item.price.toFixed(2)
                })

                data = data.concat(res.data);

                _this.setData({

                    dataList: data
                })
            }
            console.log(this.data.dataList, 'res---------')
            wx.hideLoading()
        })

    },

    goSureWithdrawal() {
        if (this.data.accountData.price <= 0) {

            wx.showToast({
                title: '暂无可提现金额',
                icon: 'none'
            })

        } else {

            wx.navigateTo({
                url: '/pages/user/sureWithdrawal/index',
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

        this.setData({
            startPage: ++this.data.startPage
        })

        this.withdrawalRecord();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})