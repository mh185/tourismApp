// pages/user/sureWithdrawal/index.js
import {
    getAccountInfo,
    getBindBankCard,
    bindBankCard,
    withdrawal

} from '../../../utils/api/myCenter'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountData: {}, // 账号信息
        bankInfo: {
            name: '',
            bankName: '',
            number: ''
        }, // 银行卡信息
        tps: '',
        isdisabled: false,
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getAccountInfo();
        this.getBank();
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
                    accountData: res.data,
                    tps: `可提现¥${res.data.price}`
                })
            }
        })
    },

    // 获取银行卡信息

    getBank() {

        let params = {};

        getBindBankCard(params).then(res => {

            if (res.status == 200) {

                this.setData({
                    bankInfo: res.data,
                    isdisabled: true
                })
            } else {


            }
        })

    },


    // 表单输入信息
    fillBankInfo(e) {

        let v = e.detail.value
        let type = e.currentTarget.dataset.type;
        let bankInfo = this.data.bankInfo;

        switch (type) {
            case 'name':
                bankInfo.name = v;
                break;
            case 'bankCard':
                bankInfo.number = v;
                break;
            case 'bankName':
                bankInfo.bankName = v;
                break;
        }

        this.setData({
            bankInfo: bankInfo
        })

        console.log(v, '---------v------')
    },

    // 綁定銀行卡

    bindBankCard() {

        let params = this.data.bankInfo;

        bindBankCard(params).then(res => {

            if (res.status == 200) {

                console.log('綁定成功~');

                this.withdrawal(res.data.id);
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }

        })

    },

    // 提交

    commitInfo() {

        let b = this.data.bankInfo;

        if (!this.data.isdisabled) {

            if (b.name == '' || b.bankName == '' || b.number == '') {

                wx.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                })

                return false;

            } else {

                this.bindBankCard();


            }

        } else {

            this.withdrawal(this.data.bankInfo.id);
        }

    },

    // 提现

    withdrawal(bankId) {

        let params = {
            bankId: bankId
        };

        withdrawal(params).then(res => {

            if (res.status == 200) {

                wx.showToast({
                    title: '提现成功',
                    icon: 'none'
                })

                wx.navigateTo({
                    url: '/pages/user/withdrawal/index',
                })

            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
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