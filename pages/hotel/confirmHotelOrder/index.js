// pages/hotel/confirmHotelOrder/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    hotelName: '柳州市城中区万豪JW酒店',
    checkInDate: '9月1日',
    checkOutDate: '9月10日',
    number: '2',
    name: '李先生',
    telephone: '136****5842',
    idNumber: '5001***********112',
    radio: '1',
    money: '542.00'
  },
  back() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 房间数量
  numberRooms(event) {
    console.log(event.detail);
  },
  // 抬头类型
  headUpType(event) {
    this.setData({
      radio: event.detail,
    });
  },
  // 预定成功
  reservationSuccessful: function() {
    wx.navigateTo({
      url: '../reservationSuccessful/index',
    })
  },
})