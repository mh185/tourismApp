// pages/more/travelNotesIntroduction/travelStrategyDetails/index.js
var WxParse = require('../../../../components/wxParse/wxParse.js');
import {getTravelsBanner,getTravelsText,thumbsUp,travelsShare} from '../../../../utils/api/travels'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    current:1,
    id:'',
   travelsRotation:[],//轮播
   travelsContent:[],//内容
   routes: '',
   travelDay: '',
   travelTool: '',
   travelTime: '',
   host:host,
   typeEnum:'.mp4',
   isThumbsUp:0,
  },
  // to游记攻略列表
  onClickLeft() {
    wx.navigateTo({
      url: '/pages/more/travelNotesIntroduction/index'
    })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  // to 景区详情
  toScenicDetails() {
    wx.navigateTo({
      url: `/pages/more/attractions/attractionsDetail/index?id=${this.data.travelsContent.scenicSpotId}`
    })
  },
  // 轮播
  swiperBindchange(event){
    console.log(event.detail);
    var current = event.detail.current
    this.setData({
      current:current + 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options");
     this.setData({
       id:options.id
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
    this.getTravelsBanner();
    this.getTravelsText()
  },
  //获取banner
  getTravelsBanner:function(){
    let params={
      travelsId :this.data.id
    }
    getTravelsBanner(params).then(res=>{
      if (res.code == 200) {
        this.setData({
          travelsRotation: res.data
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
  //获取内容详情
  getTravelsText:function(){
    let that=this;
    let params={
      travelsId :this.data.id
    }
    getTravelsText(params).then(res=>{
      if (res.code == 200) {
        const t = res.data
        this.setData({
          travelsContent: res.data
        })
        //  解析图片base64的方法 -
        WxParse.wxParse('courseDetail', 'html', that.data.travelsContent.travelDetails, that, 0)
        if(t.routes != '') {
          this.setData({
            routes: t.routes
          })
        }
        if(t.travelDay != '') {
          this.setData({
            travelDay: t.travelDay
          })
        }
        if(t.travelTool != '') {
          this.setData({
            travelTool: t.travelTool
          })
        }
        if(t.travelTime != '') {
          this.setData({
            travelTime: t.travelTime
          })
        }
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
  // 分享
  travelsShare() {
    const params = {
      travelsId: this.data.id
    }
    travelsShare(params).then((res) => {
      if(res.code == 200) {
        this.getTravelsText()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function( options ){
    // console.log("options风向....", options)
    const that = this
    // 来自页面内的按钮的转发
    if(options.from == 'button'){
      // console.log("button分享....")
      that.travelsShare()
    }
  },
  bindPlayVideo() {
    console.log('1')
    this.videoContext.play()
  },
  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  onthumbsUp(){
    let params={
      travelsId :this.data.id
    }
    thumbsUp(params).then(res=>{
      if (res.code == 200) {
        this.setData({
          'travelsContent.isThumbsUp': res.data.isThumbsUp,
          'travelsContent.thumbsUp':res.data.thumbsUp
        })
    } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
    }
    })
  }
})