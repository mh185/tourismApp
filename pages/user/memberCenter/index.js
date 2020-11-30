// pages/user/memberCenter/index.js
import {
  signInDay
} from '../../../utils/api/myCenter'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    integral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.wxUserInfo
    })
    this.getExperience()
  },
  // 查询经验值
  getExperience: function () {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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