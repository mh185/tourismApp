// pages/payStatus/paysuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    snsMsgWait:10,
    inter:''
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
//去购物
goShopping:function(){
  wx.switchTab({
    url: '/pages/homePage/index'
  })
},
//查看订单
goOrder:function(){
  wx.redirectTo({
    url: '/pages/user/myOrder/index'
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      snsMsgWait:10,
      inter:''
    })
    var inter = setInterval(function() {
      this.setData({
        snsMsgWait: this.data.snsMsgWait - 1,
        inter:inter,
      });
      if (this.data.snsMsgWait < 0) {
        clearInterval(inter)
        this.goShopping()
      }
    }.bind(this), 1000);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.inter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.inter)
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