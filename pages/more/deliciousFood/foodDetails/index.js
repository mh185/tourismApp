// pages/more/deliciousFood/foodDetails/index.js
import {selectOne,} from '../../../../utils/more/tourGuide.js'

var WxParse = require('../../../../components/wxParse/wxParse.js');
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    host: host,
    introduce: '',//美食介绍
    name: '',//美食名称
    imgUrl: '',
    ids:''
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateTo({
      url: '../index'
    })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options.....', options)
   this.setData({
     ids:options.id
   })
    this.getList(options.id)
  },
  getList(e){
    let that=this;
    const params = {
      id: [e],
    }
    selectOne(params).then((res) => {
      if(res.code == 200) {
        const details = res.data
        this.setData({
          name: details.name,
          introduce: details.content,
          imgUrl: details.backGroundUrl,
        })
        //  解析图片base64的方法 -
        WxParse.wxParse('courseDetail', 'html', that.data.introduce, that, 0)
      
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
    this.getList(this.data.ids)
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