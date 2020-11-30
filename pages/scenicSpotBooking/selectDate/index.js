// pages/scenicSpotBooking/selectDate/index.js
import { getScenicDetailInfo } from '../../../utils/more/scenicSpotBooking.js'
var app = getApp();
const host = app.globalData.scenicHost

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    host:host,
    dateList:[],
    scenicId: '',
  },
  // 景区详情
  scenicDetails(){
    const selectScenicId = wx.getStorageSync('selectScenicId')
    var that = this
    var param = {
      id: selectScenicId
    }
    getScenicDetailInfo(param).then(res => {
      if (res.code == 0) {
        that.setData({
          dateList: res.data.dateList
        })
        // that.calendar
        // console.log('res11111.....', res.data)
        // console.log('222222222222222.....', res.data.data)
        // console.log('3333333333333333.....', that.data.scenicList)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
    })
    // wx.request({
    //   url: `${host}/Appointment/v2/detailInfo/${selectScenicId}`, //服务器url+参数中携带的接口具体地址
    //   data:{
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded", 
    //     AppId:'772wgl',
    //   },
    //   method: 'GET', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
    //   success: function (res) {
    //     console.log('res.....', res)
    //       if (res.data.code == 0){
    //         that.setData({
    //           dateList: res.data.data.dateList
    //         })
    //         that.calendar
    //       // console.log('res11111.....', res.data)
    //       // console.log('222222222222222.....', res.data.data)
    //       // console.log('3333333333333333.....', that.data.scenicList)
    //     }else{
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 1500,
    //       })
    //     }
    //   }
    // })
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  formatDate(date) {
    date = new Date(date);
    var t =  `00${date.getDate()}`.slice(-2)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${t}`;
  },
  onConfirm(event) {
    var data = this.formatDate(event.detail)
    var r
    this.data.dateList.map((item) => {
      console.log(item.date == data, item.date , data,'item.date == data')
      if (item.date == data){
        console.log(item.date, data)
        r = item
      }
    })
    console.log(r,'r')

    wx.setStorageSync('chooseScenicItem', r)
    wx.setStorageSync('chooseScenicDate', this.formatDate(event.detail))
    wx.navigateBack({
      delta: 1
    })
  },
  // onClose() {
  //   this.setData({ show: false });
  // },
  // formatDate(date) {
  //   date = new Date(date);
  //   return `${date.getMonth() + 1}/${date.getDate()}`;
  // },
  // onConfirm(event) {
  //   this.setData({
  //     show: false,
  //     date: this.formatDate(event.detail),
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options选择日期。。。。', options)
    this.setData({
      scenicId: options.scenicId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.calendar = this.selectComponent("#calendar");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.scenicDetails()
    // var param = {
    //   scenicSpotId: this.data.scenicId
    // }
    // queryRemainCapacity(param).then((res) => {
    //   if(res.code == 200) {
    //     this.setData({
    //       dateList :res.data
    //     })
    //     this.calendar
    //   console.log(this.calendar, this.selectComponent("#selecCalendar"),'dateList');

    //   } else {
    //     wx.showToast({
    //       title: res.message,
    //       icon: 'none',
    //       duration: 1500,
    //     })
    //   }
    // })
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