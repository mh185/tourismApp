// pages/user/editPerson/index.js
import {
  signIn,
  signInDay
} from '../../../utils/api/myCenter'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signInDay: [1, 2, 3, 4, 5, 6, 7], //签到天数
    nowDay: 0, //当前签到天数
    continuitieDay: 0, //连续签到
    Integral: 0, //积分
    toSignIn: false,
    toSignInDay: false,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.signIn();
  },
  // 签到
  signIn: function () {
    signIn({
      userId: app.globalData.userId
    }).then(res => {
      if (res.status == 200) {
        this.setData({
          toSignIn: true
        });
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 1500
        });
      }
      this.signInDay()
    });
  },
  // 查询签到天数
  signInDay: function () {
    // wx.showLoading({
    //   title: '加载中....',
    //   mask: true
    // })
    signInDay({
      userId: app.globalData.userId
    }).then(res => {
      if (res.status == 200) {
        this.setData({
          toSignInDay: true,
          nowDay: res.data.day,
          continuitieDay: res.data.continuitieDay,
          Integral: res.data.Integral
        });
        // wx.hideLoading()
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (options) {

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