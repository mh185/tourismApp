// pages/scenicSpotTickets/index.js
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    option1: [
      { text: '位置', value: 0 },
      { text: '位置', value: 1 },
      { text: '位置', value: 2 },
    ],
    option2: [
      { text: '五星级', value: 'a' },
      { text: '五星级', value: 'b' },
      { text: '五星级', value: 'c' },
    ],
    option3: [
      { text: '5KM', value: 'a' },
      { text: '10KM', value: 'b' },
      { text: '15KM', value: 'c' },
    ],
    option4: [
      { text: '热门', value: 'a' },
    ],
    value1: 0,
    value2: 'a',
    listDate:6,
    // iconSrc:iconSrc
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

  },
  toDetails:function(){
    wx.navigateTo({
      url: '/pages/scenicSpotTickets/details/index',
    })
  }
})