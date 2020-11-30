// pages/index/gourmetSpecialty/foodDetails/index.js
import {
  selectOneSpecialty, 
  likeOrNotGourmetSpecialty, 
  shareGourmetSpecialty
} from '../../../../utils/more/tourGuide.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//路由参数
    iconUrl: iconUrl,
    host: host,
    introduce: '',//美食介绍
    name: '',//美食名称
    price: '',//钱
    userIsLike: '',//点赞状态
    shareCount: '',//分享次数
    likeCount: '',//点赞次数
    imgUrl: '',
  },
  // 分享
  shareGourmetSpecialty() {
    const params = {
      gourmetSpecialtyId: this.data.id
    }
    shareGourmetSpecialty(params).then((res) => {
      if(res.code == 200) {
        this.pageRendering()
      } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  // 点赞
  clickFabulous() {
    const params = {
      gourmetSpecialtyId: this.data.id
    }
    likeOrNotGourmetSpecialty(params).then((res) => {
      if(res.code == 200) {
        this.pageRendering()
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
      url: '../index'
    })
  },
  // 页面渲染
  pageRendering() {
    const params = {
      id: this.data.id,
    }
    selectOneSpecialty(params).then((res) => {
      if(res.code == 200) {
        const details = res.data
        this.setData({
          name: details.name,
          introduce: details.content,
          imgUrl: details.backGroundUrl,
          price: details.price,
          shareCount: details.shareCount,
          likeCount: details.likeCount,
          userIsLike: details.userIsLike,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    this.pageRendering()
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
  onShareAppMessage: function( options ){
    // console.log("options风向....", options)
    const that = this
    // 来自页面内的按钮的转发
    if(options.from == 'button'){
      // console.log("button分享....")
      that.shareGourmetSpecialty()
    }
  }
})