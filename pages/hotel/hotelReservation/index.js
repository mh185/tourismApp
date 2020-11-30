// pages/hotel/hotelReservation/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    city:'柳州市',
  },
  // 首页
  toIndex: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 酒店列表
  toHotelList: function() {
    wx.navigateTo({
      url: "/pages/hotel/hotelList/index",
    });
  },
  // 选择城市
  toChooseCity(){
    wx.navigateTo({
      url: "/pages/hotel/chooseCity/index",
    });
  },
})