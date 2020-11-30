// pages/index/guide/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNum:'first',
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
  },
  // 导航头点击
  click_option(e){
    var t = e.target.dataset.id
    this.setData({
      activeNum : t
    })
  },
  // 景点 map
  toDetails: function () {
    wx.navigateTo({
      // url: '../guide/guideMap/index',
      url: '../../more/attractions/attractionsDetail/index',

    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '../index',
    })
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

  }
})