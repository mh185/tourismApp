// pages/user/editPerson/index.js
import {
    fileUpload
} from '../../../utils/request'
import {
    updateUser,
    auth
} from '../../../utils/api/editPerson'
import {
    formatTime
} from '../../../utils/util'
import {
    validateIdCard
} from '../../../utils/validate'
const app = getApp();
let entTime = formatTime(new Date()).replace(/(\/)/g, '-');
entTime = entTime.substr(0, 10);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gender: '',
        idCard: '',
        idCardTips: '',
        realName: '',
        side: '', // 正面反面
        cardPositiveImg: '',
        cardReverseImg: '',
        authStatus: '',
    },
  // 返回上一页
  onClickLeft() {
    wx.navigateTo({
      url: '/pages/user/editPerson/index'
    })
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function (options) {
        var that = this;
        this.setData({
            realName: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.realName : '',
            idCard: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.idCard : '',
            cardPositiveImg: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.cardPositiveImg : '',
            cardReverseImg: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.cardReverseImg : '',
            authStatus: app.globalData.wxUserInfo ? app.globalData.wxUserInfo.authStatus : '',
        });
    },

    // 身份证
    bindIdCardInput: function (e) {
        if (e.detail.value) {
            const idCardStatus = validateIdCard(e.detail.value);
            if (!idCardStatus) {
                this.setData({
                    idCardTips: '请输入正确的身份证号！'
                })
            } else {
                this.setData({
                    idCardTips: ''
                })
            }
        } else {
            this.setData({
                idCardTips: ''
            })
        }
    },
    // 选择图片
    uploadImg: function (e) {
        let side = e.currentTarget.dataset.side;

        this.setData({
            side: side
        })
        var that = this;
        wx.showActionSheet({
            itemList: ['拍照', '从手机相册选择'],
            success(res) {
                var tapIndex = res.tapIndex
                if (tapIndex == 0) {
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['camera'], //相机
                        success(res) {
                            if (res) {
                                const tempFilePaths = res.tempFilePaths[0];
                                that.uploadFile(tempFilePaths);
                            }
                        }
                    })
                } else if (tapIndex == 1) {
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['album'], //相机
                        success(res) {
                            if (res) {
                                const tempFilePaths = res.tempFilePaths[0];
                                that.uploadFile(tempFilePaths);
                            }
                        }
                    })
                }
            },
        });
    },
    // 上传图片
    uploadFile: function (file) {
        const that = this;
        fileUpload({
            file
        }).then(resg => {
            if (resg.status == 200) {
                const img = `${app.globalData.imgUrl}${resg.data.uploadfilepath}${resg.data.uploadfilename}`;

                switch (that.data.side) {
                    case 'positive':

                        this.setData({
                            cardPositiveImg: img
                        });

                        break;
                    case 'reverse':

                        this.setData({
                            cardReverseImg: img
                        });

                        break;
                }
            }
        });
    },

    // 重新登录

    upInfo() {

        wx.login({
            success: res => {
                wx.request({
                    url: that.globalData.host + '/login/v1/in/applets?code=' + res.code,
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: element => {
                        console.log('--------login', element)
                        if (element.data.status == 1) {
                            if (element.data.data.phone != null && element.data.data.phone != '') {
                                that.globalData.userId = element.data.data.id
                                wx.setStorageSync('userId', that.globalData.userId)
                                that.globalData.wxUserInfo = element.data.data
                                that.globalData.openId = element.data.data.openId
                            }
                        } else {
                            that.globalData.openId = element.data.data
                        }
                    }
                })
            }
        });
    },



    /**
     * 提交
     */
    formSubmit: function (e) {
        let _that = this;
        let data = e.detail.value;
        data.cardPositiveImg = _that.data.cardPositiveImg;
        data.cardReverseImg = _that.data.cardReverseImg;


        if (data.realName == '' || data.idCard == '' || data.cardPositiveImg == '' || data.cardReverseImg == '') {

            wx.showToast({
                title: '认证信息未填写完成',
                icon: 'none'
            })

            return false;
        }
        if (this.idCardTips == '') {
            return false;
        }
        wx.showLoading({
            title: '加载中....',
            mask: true
        })
        auth(data).then(res => {
            wx.hideLoading()
            if (res.status == 200) {
                app.globalData.wxUserInfo = res.data;
                wx.showToast({
                    title: '提交成功',
                    icon: 'none',
                    duration: 1500,
                    success: function () {
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }, 500)
                    }
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
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})