// pages/index/guide/tencentMap/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBackPrePage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.show
    console.log('....111111', options)
    // this.data.show
    wx.openLocation({
      longitude: Number(options.lon),
      latitude: Number(options.lat),
      scale: 18,
      success: res=>{
        this.setData({
          isBackPrePage: true
        })
      },
      complete: res => {
        console.log(res)
      }
    })
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
    console.log(4444,this)
    if(this.data.isBackPrePage){
      wx.navigateBack({
        delta: 1
      })
    }
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