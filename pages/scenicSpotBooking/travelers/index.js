// pages/scenicSpotBooking/travelers/index.js
import { queryAllTraveler, travelerUpdate,travelerDelete } from '../../../utils/more/destination.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    cardList: [],//名片列表
  },
  //修改
  updataCard(event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addTraveler/index?id='+id
    })
  },
  //删除
  deleteCard(event){
    const params = {
      id: event.currentTarget.dataset.id,
    }
    travelerDelete(params).then((res) => {
      if(res.code == 200) {
        this.pageCard()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 设为默认出行人
  travelers(event) {
    console.log('event', event);
    const params = {
      defaultTraveler: 1,
      id: event.currentTarget.dataset.id,
    }
    travelerUpdate(params).then((res) => {
      if(res.code == 200) {
        this.pageCard()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateTo({
      url: '/pages/scenicSpotBooking/index'
    })
  },
  // 添加联系人
  toAddTraveler() {
    wx.navigateTo({
      url: '../addTraveler/index'
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
    this.pageCard()
  },
  // 获取出行人列表
  pageCard() {
    queryAllTraveler().then((res) => {
      if(res.code == 200) {
        res.data.map(item => {
          item.checked = item.defaultTraveler?true : false
        })
        this.setData({
          cardList: res.data
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