// pages/hotel/reservationSuccessful/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    money: '￥258.00',
    paymentMethod: '微信支付',
    paymentTime: '2019-12-23 09:44'
  },
  back() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 首页
  toIndex() {
    wx.switchTab({
      url: '../../index/index'
    });
  }
})