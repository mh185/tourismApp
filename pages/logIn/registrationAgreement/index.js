// pages/logIn/registrationAgreement/index.js
import { selectUserAgreement } from '../../../utils/api/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content: "124",
    // nodes:''
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateTo({
      url: '/pages/logIn/index'
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
    this.getTitle()
  },
 getTitle:function(){
  const params = {
    // type: 'CULTURAL_TOURISM',
    type: 'TOURISM',
  }
  selectUserAgreement(params).then((res) => {
    if(res.code == 200) {
      this.setData({
        content: res.data.content
      })
    } else {
      wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
      })
    }
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