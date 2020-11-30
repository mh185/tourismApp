// pages/scenicSpotBooking/subscribeList/index.js

import {  GetList  } from '../../../utils/more/scenicSpotBooking.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.scenicHost
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    host: host,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    cardList: [],
    page: 1,
    size: 10,
  },
  // 我的预约详情
  toMyAppointment(e) {
    // console.log("e...", e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../subscribeList/myAppointment/index?id=${id}`
    })
  },
  // 返回上一页
  onClickLeft() {
    // wx.navigateTo({
    //   url: '../index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.queryIndexBookingList()
  },
  // 查询结果
  queryIndexBookingList() {
    // var that = this
    // const phone = app.globalData.wxUserInfo.mobile
    // const params = {
    //   page: this.data.page,
    //   size: this.data.size,
    // }
    // wx.request({
    //   url: `${host}/Appointment/v2/GetList?tel=${phone}`,
    //   data: {},
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     AppId: '772wgl',
    //   },
    //   method: 'GET',
    //   success: function(res) {
    //       console.log('res景区预约....', res)
    //       if (res.data.code == 0) {
    //       // if (res.data.length < this.data.size) {
    //       //   this.setData({
    //       //     searchLoading: true
    //       //   })
    //       // }
    //       that.setData({
    //         cardList: res.data.data
    //       });
    //       console.log('cardList....', this.data.cardList)
    //       // wx.hideLoading()
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 1500,
    //       })
    //       // wx.navigateTo({
    //       //   url: '/pages/logIn/index'
    //       // })
    //     }
    //   }
    // })
    const params = {
      tel: app.globalData.wxUserInfo.mobile,
    }
    GetList(params).then((res) => {
      if (res.code == 0) {
        const list = res.data
        list.map((item, i) => {
          if(item.stateName == '预约成功') {
            item.stateName_colour = 'stateName_red'
          } else if(item.stateName == '已入园') {
            item.stateName_colour = 'stateName_yellow'
            // this.setData({
            //   stateName_colour: 'stateName_yellow'
            // })
          } else {
            item.stateName_colour = 'stateName_ash'
            // this.setData({
            //   stateName_colour: 'stateName_ash'
            // })
          }
        })
        this.setData({
          cardList: res.data
        });
        // if (res.data.length < this.data.size) {
        //   this.setData({
        //     searchLoading: true
        //   })
        // }
        // this.setData({
        //   cardList:this.data.cardList.concat(res.data)
        // });
        // wx.hideLoading()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 分页点击加载
  onClickMore: function() {
    console.log("点击")
    this.setData({
      page: this.data.page + 1
    })
    this.queryIndexBookingList()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.onClickMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})