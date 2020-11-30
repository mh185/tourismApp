// pages/logIn/index.js
import {
    login,
    getTel,
    userRegisterByWx,
    getSessionKey,
    getToken
} from '../../utils/api/index'
var app = getApp();
const iconUrl = app.globalData.iconUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfor: '',
        sessionkey: '',
        encrypdata: '',
        ivdata: '',
        phone: '',
        disabled: true, //登录是否禁用
        userInfoDate:[],
        iconUrl:iconUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    
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
        let _this=this
        wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              _this.setData({
                userInfoDate:res.userInfo
              })
            //   app.globalData.wxUserInfo=res.userInfo
            }
          })
    },
    //获取用户信息 
    getPhoneNumber: function (e) {
        const that = this
        that.setData({
            encrypdata: e.detail.encryptedData,
            ivdata: e.detail.iv
        })
        that.getUser()
    },
    //获取用户信息
    getUser: function () {
        const that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var params = {
                        code: res.code
                    }
                    wx.showLoading({
                        title: '加载中....',
                        mask: true
                    })
                    login(params).then(res => {
                      wx.hideLoading()
                        if (res.code == 200) {
                            app.globalData.wxUserInfo = res.data
                            app.globalData.userId = res.data.userId
                            app.globalData.openId = res.data.openId
                            wx.setStorage({
                                key: 'userInfo',
                                data: 'res.data'
                            })
                            that.setData({
                                sessionkey: res.data.sessionKey
                            })
                            that.getTel()
                            // that.getSessionKey()
                        } else if (res.status == 0) {
                            app.globalData.openId = res.data
                            // that.getSessionKey()
                        } else {
                            // wx.showToast({
                            //     title: res.msg,
                            //     icon: 'none',
                            //     duration: 1500,
                            // })
                        }
                    })
                } else {}
            }
        });
    },

    //获取用户SessionKey
    getSessionKey: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var params = {
                        code: res.code,
                        openId: app.globalData.openId
                    }
                    getSessionKey(params).then(parameter => {
                        if (parameter.status == 200) {
                            that.setData({
                                sessionkey: parameter.data
                            })
                            that.getTel()
                        }
                    })
                }
            }
        })
    },
    //获取用户手机号
    getTel: function () {
        var that = this
        var params = {
            encryptedData : this.data.encrypdata,
            iv: this.data.ivdata,
            sessionKey : this.data.sessionkey,
            appId:"wx7e192938c604b4a3"
        }
        getTel(params).then(res => {
          console.log('电话号码。。。。。', res)
            if (res.code == 200) {
                that.setData({
                  phone: res.data,
                })
                app.globalData.userPhone = res.data.phoneNumber
                wx.setStorageSync('userPhone', res.data.phoneNumber)
                that.userRegisterByWx()
            } else {
                wx.showToast({
                    title: '获取手机号失败',
                    icon: 'none',
                    duration: 1500,
                })
            }
        });
    },

    //登录注册
    userRegisterByWx: function () {
        const that = this
        var params = {
            mobile : that.data.phone.phoneNumber,
            appId: app.globalData.appid,
            userId:app.globalData.userId,
            // encryptedData : this.data.encrypdata,
            // iv: this.data.ivdata,
            sessionKey : this.data.userInfoDate.sessionkey,
            nickName:this.data.userInfoDate.nickName,
            avatarUrl:this.data.userInfoDate.avatarUrl,
            gender: this.data.userInfoDate.gender,
            language: this.data.userInfoDate.language,
            city: this.data.userInfoDate.city,
            province: this.data.userInfoDate.province,
            country: this.data.userInfoDate.country
        }
        console.log(params,"ppppp")
        // debugger
        userRegisterByWx(params).then(res => {
            if (res.code == 200) {
                app.globalData.wxUserInfo = res.data
                app.globalData.userId = res.data.id
                app.globalData.openId = res.data.openId
                app.globalData.productUserId=res.data.productUserId
                that.getToken()
                wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: 1500,
                    success: function () {
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }, 1500)
                    }
                })
            } else {
                if (res.msg == '该用户已被注册') {
                    that.getLogin()
                    return false
                }
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 1500,
                })

            }
            wx.hideLoading()
        })
    },
    //获取token
    getToken:function(){
        var params={
            openId :app.globalData.openId
        }
        getToken(params).then(res => {
            console.log(res);
            if(res.code == 200){
                app.globalData.token=res.data.token
            }
        })
    },
    //手机号登录
    otherLogin: function () {
        wx.navigateTo({
            url: '/pages/logIn/otherLogin/index'
        });
    },
    //登录
    getLogin: function () {
        
        wx.login({
            
            success: res => {
                wx.request({
                    url: app.globalData.host + '/login/v1/in/applets?code=' + res.code+'&appid=wx7e192938c604b4a3',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: element => {
                        if (element.data.status == 1) {
                            if (element.data.data.phone != null && element.data.data.phone != '') {
                                app.globalData.userId = element.data.data.id
                                app.globalData.wxUserInfo = element.data.data
                                app.globalData.openId = element.data.data.openId
                                wx.showToast({
                                    title: '登录成功',
                                    icon: 'none',
                                    duration: 1500,
                                    success: function () {
                                        setTimeout(function () {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }, 1500)
                                    }
                                })
                            }
                        } else {
                            app.globalData.openId = element.data.data
                        }
                    }
                })


            }
        })
    },
    /**
     * 是否勾选协议
     * 
     */
    checkboxChange: function () {
        this.setData({
            checked: !this.data.checked,
            disabled: !this.data.disabled,
        })
    },
    /**
     * 跳转用户注册协议
     */
    handleAgreement: function () {
        wx.navigateTo({
            url: '../logIn/registrationAgreement/index',

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