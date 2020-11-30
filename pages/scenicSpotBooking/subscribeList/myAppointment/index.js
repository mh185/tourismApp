// pages/scenicSpotBooking/subscribeList/myAppointment/index.js
import { queryBookingDetail, queryBookingDelete } from '../../../../utils/more/destination.js'
import { GetByID, cancel, EnterGarden } from '../../../../utils/more/scenicSpotBooking.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
const scenicHost = app.globalData.scenicHost
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    scenicHost: scenicHost,
    host: host,
    id: null,
    bookingDetail:{},
    img: '',
    stateName: true,
    confirmAdmission: false,
    latitude: '',
    longitude: '',
    stateName_colour: '',
  },
  //图片显示
  seeImgUrl(){
    const img = this.data.img
    console.log('图片。。。。', this.data.img)
    if(img == undefined || img == null || img == ''){
      this.setData({
        img: `http://47.108.86.202:8081/icon/morenjingqutupian.png`
      })
    console.log('图片1。。。。', this.data.img)
    }else{
      if(img.indexOf('https')==-1) {
        this.setData({
          img: 'https://file.gxota.net/'+img
        })
    console.log('图片2。。。。', this.data.img)
      }else{
        this.setData({
          img: img
        })
    console.log('图片3。。。。', this.data.img)
      }
    }
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
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  //确认入园
  onConfirmAdmission() {
    const params = {
      id: this.data.id,
      // lat: this.data.latitude,
      // lng: this.data.longitude,
      lat: '24.383537',
      lng: '109.54573',
    }
    EnterGarden(params).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1500,
      })
      this.GetByID()
    })
  },
  //预约详情
  GetByID(){
    const params = {
      id: this.data.id
    }
    GetByID(params).then(res => {
      if(res.code == 0) {
        this.setData({
          bookingDetail: res.data,
          img: res.data.scenicCoverImg,
        })
        if(res.data.stateName == '预约成功') {
          this.setData({
            stateName_colour: 'stateName_red'
          })
        } else if(res.data.stateName == '已入场') {
          this.setData({
            stateName_colour: 'stateName_yellow'
          })
        } else {
          this.setData({
            stateName_colour: 'stateName_ash'
          })
        }
        this.seeImgUrl()
        if (this.data.bookingDetail.stateName != '预约成功'){
          this.setData({
            stateName: false,
            confirmAdmission: false,
          })
        }
        this.confirmAdmission()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //取消预约
  onCancel() {
    var params = {
      id: this.data.id
    }
    cancel(params).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1500,
      })
      this.GetByID()
    })
  },
  //确认入园 时间判断
  confirmAdmission(){
    //获取当前时间
    var nowTime = new Date().getTime()
    //获取预约开始时间
    if (this.data.bookingDetail) {
      var ymd = this.data.bookingDetail.appointment.split(' ')[0]
      var startTime = ymd + ' ' + this.data.bookingDetail.timePeriod.split('-')[0]
      // var endTime = ymd + ' ' + this.data.bookingDetail.timePeriod.split('-')[1]
      var endTime = ymd + ' ' + '24:00'
      var startTimeStamp = new Date(startTime).getTime()
      var endTimeStamp = new Date(endTime).getTime()
    }
    console.log('预约时间。。。', nowTime, startTimeStamp, endTimeStamp)
    //确认入园
    if (startTimeStamp <= nowTime && nowTime <= endTimeStamp){
      if (this.data.bookingDetail.stateName == '预约成功') {
        this.setData({
          confirmAdmission: true
        })
        this.getAuthorization()
        console.log('222222', this.data.latitude, this.data.longitude)
      }
    }
    //预约当天24:00 未取消 未入园
    if (endTimeStamp < nowTime){
      if (this.data.bookingDetail.stateName == '预约成功') {
        this.setData({
          confirmAdmission: false,
          stateName: false,
        })
        this.getAuthorization()
        console.log('222222', this.data.latitude, this.data.longitude)
      }
    }
  },
  // onCancel(){
  //   var param = {
  //     id: this.data.id
  //   }
  //   var that = this
  //   wx.request({
  //     url: `${scenicHost}/Appointment/v2/cancel/${that.data.id}`,
  //     data: {},
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       AppId: '772wgl',
  //     },
  //     method: 'GET',
  //     success: function (res) {
  //       wx.showToast({
  //         title: res.data.msg,
  //         icon: 'none',
  //         duration: 1500,
  //       })
  //       if (res.data.code == 0) {
  //         that.queryBookingDetail()
  //         // res.data.data.time = res.data.data.appointment.split(" ")[0]
  //         // that.setData({
  //         //   bookingDetail: res.data.data
  //         // });
  //         // wx.hideLoading()
  //       } else {
  //         // wx.showToast({
  //         //   title: res.message,
  //         //   icon: 'none',
  //         //   duration: 1500,
  //         // })
  //       }
  //     }
  //   })
  //   // queryBookingDelete(param).then((res) => {
  //   //   if(res.code == 200){
  //   //     wx.navigateBack({
  //   //       delta: 1
  //   //     })
  //   //   } else {
  //   //     wx.showToast({
  //   //       title: res.message,
  //   //       icon: 'none',
  //   //       duration: 1500,
  //   //     })
  //   //   }
  //   // })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.queryBookingDetail()
    this.GetByID()
    // this.seeImgUrl()
  },
  // 获取用户授权
  getAuthorization() {
    var that = this
    wx.getSetting({
      success(res) {
        console.log('res', res)
        if (!res.authSetting['scope.userLocation']) {
          console.log('用户授权')
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              that.getLocation()
            },
            fail(res) {
              console.log('用户授权失败', res)
            }
          })
        } else {
          that.getLocation()
        }
      }
    })
  },
  // 获取定位
  getLocation() {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log('1111111', that.data.latitude, that.data.longitude)
      }
    })
  },
  // 查询结果
  queryBookingDetail() {
    var that = this
    // const params = {
    //   id: this.data.id,
    // }
    wx.request({
      url: `${scenicHost}/Appointment/v2/GetByID/${that.data.id}`,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        AppId: '772wgl',
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          res.data.data.time = res.data.data.appointment.split(" ")[0]
          that.setData({
            bookingDetail: res.data.data,
            img: res.data.data.scenicCoverImg
          });
          // wx.hideLoading()
          that.seeImgUrl()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
    // queryBookingDetail(params).then((res) => {
    //   if (res.code == 200) {
    //     this.setData({
    //       bookingDetail: res.data
    //     });
    //     wx.hideLoading()
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