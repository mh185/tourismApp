// pages/index/weather/index.js
var app = getApp();
var util = require('../../../utils/util.js')
const iconUrl =app.globalData.iconUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,//beijing
    iconUrl: iconUrl,
    weather: '',
    temperature: '',
    weatherList: [],
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //   let mm= util.formatTimeMonday(new Date(),'/')
  // let date =JSON.parse(options.weather)
  // console.log(date)
   
  
  //  date.forEach(e => {
  //    if(e.date==mm) {
  //      e.week='今天'
  //      this.setData({
  //       // temperature:e.min_temperature!=e.max_temperature?e.min_temperature+'/'+e.max_temperature:e.min_temperature,
  //       weather:e.min_scene!=e.max_scene?e.min_scene+'转'+e.max_scene:e.min_scene
  //      })
  //    }
  //  });

  //  this.setData({
  //   weatherList:date.slice(1)
  //  })

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
    // 获取天气list
   this.getWeither()
    // 白天/夜晚 时间段判断
    this.showTime()
  },
   // 天气
   getWeither(){
    var that = this
    wx.request({
      // url: 'http://183.66.194.186:8000/weaher/city', //服务器url+参数中携带的接口具体地址
      url: 'https://lzzhly.wglj.liuzhou.gov.cn/weather/city', //服务器url+参数中携带的接口具体地址
      // data:{
      //   name:'柳州市'
      // },
      header: {
        "Content-Type": "application/x-www-form-urlencoded", 
      },
      method: 'POST', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      success: function (res) {
        console.log('天气。。。', res)
        if(res.data.code == 200) {
          // app.globalData.weathers = res.data.data
          // that.setData({
          //   weather: res.data.data.wendu,
          //   weatherCity: res.data.data.city.split('，')[0],
          //   airQuality: res.data.data.kongqi.split(' ')[1],
          //   weatherImg:res.data.data.forecast7[1]
          // })
          // console.log(that.data.weatherImg,"111111")
          let mm= util.formatTimeMonday(new Date(),'/')
          const weatherList = res.data.data
          console.log('tianqi..........', weatherList)
            let date=weatherList.forecast7
             date.forEach(e => {
           if(e.date==mm) {
             e.week='今天'
           }
         });
         that.setData({
            temperature: weatherList.wendu,
            weather: weatherList.weather,
            weatherList: date.slice(1) ,
          })
        }else{
          that.setData({
            weather: '',
          })
          wx.showToast({
            title: '天气获取失败',
            icon: 'none',
            duration: 1500,
          })
        }

      }
    })
  },
  /**
   * stime 开始时间 etime 结束时间
   */
  showTime(){
    let thisDate = new Date();
    // 获取当前时间，格式为 2018-9-10 20:08
    const stime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + '06:00'
    const etime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + '17:59'
    this.compareTime (stime, etime)
  },
  compareTime (stime, etime) {
    // 转换时间格式，并转换为时间戳
    function tranDate (time) {
      return new Date(time.replace(/-/g, '/')).getTime();
    }
    // 开始时间
    let startTime = tranDate(stime);
    // 结束时间
    let endTime = tranDate(etime);
    let thisDate = new Date();
    // 获取当前时间，格式为 2018-9-10 20:08
    let currentTime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + thisDate.getHours() + ':' + thisDate.getMinutes();
    // let currentTime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + '03:00';
    let nowTime = tranDate(currentTime);
    // 如果当前时间处于时间段内，返回true，否则返回false
    if (nowTime > startTime && nowTime < endTime) {
      this.setData({
        show: true
      })
    } else {
      this.setData({
        show: false
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