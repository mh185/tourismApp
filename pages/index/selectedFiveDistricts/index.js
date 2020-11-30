// pages/index/selectedFiveDistricts/index.js
import { queryTopScenicSpot } from '../../../utils/api/attraction.js'
var app = getApp();
const host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenicLists: [],//景区列表
    host: host,
  },
  // to 景区详情
  toAttractionsDetail(ev) {
    var id = ev.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/more/attractions/attractionsDetail/index?id=${id}`
    })
  },
  //获取景区
  getscenicList() {
    queryTopScenicSpot().then((res) => {
      if (res.code == 200) {
        this.setData({
          scenicLists: res.data
        })
      } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  // 返回首页
  onClickLeft(){
    wx.switchTab({
      url: '/pages/index/index',
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
    this.getscenicList()
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