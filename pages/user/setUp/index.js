// pages/user/setUp/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
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
    this.setData({
      userId:app.globalData.userId
    })
  },
  harvestAddress:function(){
    if(this.data.userId!=null&&this.data.userId!=''){
      wx.navigateTo({
        url: '/pages/user/setUp/harvestAddress/index',
        });
    }else{
      wx.showToast({
        title:'请先前往登录',
        icon: 'none',
        duration: 1500,
        success:function(){
          setTimeout(function(){
            wx.navigateTo({
              url: "/pages/logIn/index"
            });
          },1500)
        }
      })
      return false
    }
    
  },
  //退出登录
  dropOut:function(){
    app.globalData.wxUserInfo=null
    app.globalData.userId=null
    app.globalData.openId=null
    wx.switchTab({
      url: '/pages/homePage/index'
    })
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