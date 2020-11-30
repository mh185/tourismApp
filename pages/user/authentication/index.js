// pages/user/authentication/index.js
import { getHealthCode, registRealAuth } from '../../../utils/more/healthCode.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idr:'',
    isRead:false,//是否只读
    butTitle:'提交',
    authentication: '',
  },
  onClickLeft() {
    wx.switchTab({
      url: '/pages/user/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      authentication: options.authentication
    })
    if(options.authentication == 1) {
      this.onGetHealthCode()
      this.setData({
        isRead: true,
      })
    }
  },
  // 获取已实名信息
  onGetHealthCode() {
    getHealthCode().then((res) => {
      console.log('res......', res)
      if(res.code == 200) {
        this.setData({
          name: res.data.name,
          idr: res.data.cardNumber,
          // butTitle: '取消实名',
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
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

  },
  // 获取姓名
  onName(event){
    this.setData({
      name: event.detail
    })
  },
  // 获取证件号
  onIdr(event){
    this.setData({
      idr: event.detail
    })
  },
  // 提交
  btn() {
    if(this.data.authentication == 1) {
      console.log('已实名、、、、')
      return
    }
    console.log('实名认证。。。。', this.data.name, this.data.idr)
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none',
        duration: 1500,
      })
    } else if (this.data.idr == '') {
      wx.showToast({
        title: '请填写证件号',
        icon: 'none',
        duration: 1500,
      })
    } else {
      this.onRegistRealAuth()
    }
  },
  // 完成实名认证
  onRegistRealAuth() {
    const params = {
      cardNumber: this.data.idr,
      cardType: 'IDENTITY_CARD',
      realName: this.data.name,
    }
    registRealAuth(params).then((res) => {
      console.log('res......', res)
      if(res.code == 200) {
        this.setData({
          authentication: 1,
          isRead: true,
        })
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      } else {
        wx.showToast({
          title: res.message,
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