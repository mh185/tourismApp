// pages/hotel/hotelList/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    value: '',
    hotelName: '柳州市万豪JW酒店',
    hotelAddress: '瑞安路2号万达广场6楼',
    money: '199.00',
    distance: '1.5Km'
  },
  // 酒店详情
  toHotelDetails: function() {
    wx.navigateTo({
      url: '../hotelDetail/index',
    })
  },
  // to 酒店预订
  tohotelReservation: function() {
    wx.navigateTo({
      url: '../hotelReservation/index',
    })
  },
})