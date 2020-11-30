// pages/hotel/hotelDetails/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    hotelName: '柳州市城中区万豪JW酒店',
    hotelAddress: '瑞安路2号万达广场6楼',
    checkInDate: '9月1日',
    checkInWeek: '周一',
    checkOutDate: '9月10日',
    checkOutWeek: '周五',
    number: '2'
  },
  // 酒店列表
  toHotelList: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 确认酒店订单
  toConfirmHotelOrder: function() {
    wx.navigateTo({
      url: '../confirmHotelOrder/index',
    })
  },
  // 酒店相册
  toHotelImgs(){
    wx.navigateTo({
      url: '../hotelImgs/index',
    })
  },
  // 选择时间
  toChooseTime(){
    wx.navigateTo({
      url: '../chooseTime/index',
    })
  }
})