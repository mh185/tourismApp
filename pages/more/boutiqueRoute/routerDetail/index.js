// pages/boutiqueRoute/routerDetail/index.js
var WxParse = require('../../../../components/wxParse/wxParse.js');
var app = getApp();
const iconUrl = app.globalData.iconUrl
import {getRouteTravelAgents, getRouteOne, getRouteBanner} from "../../../../utils/api/boutiqueRoute"
const host =app.globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current:1,//轮播图片首页
    iconUrl: iconUrl,
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    id:'',//路线ID
    banner:'',//bannert
    travelAgents:"",//旅行社
    text:"",//文本
    host:host,
    indicatorDots: false,//是否显示点
    vertical: false,//是否纵向滑动
    autoplay: true,//是否自动切换
    interval: 2000,//自动切换时间间隔
    duration: 500,//滑动动画时长
  },
  // 轮播
  swiperBindchange(event){
    // console.log("000000000", event.detail);
    var current = event.detail.current
    this.setData({
      current:current + 1
    })
  },
  // to路线详情列表
  onClickLeft() {
    wx.navigateTo({
      url: '/pages/more/boutiqueRoute/index',
    })
    // wx.navigateBack({
    //   delta:1
    // })
  },
  // 旅行社详情
  toTravelAgencyDetails() {
    wx.navigateTo({
      url: `/pages/more/boutiqueRoute/travelAgencyDetails/index?id=${this.data.id}&logo=${this.data.travelAgents.logoFileManageUrl}&name=${this.data.travelAgents.name}&phone=${this.data.travelAgents.phone}`,
      // url: '../travelAgencyDetails/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options,"options");
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
    let that=this;
    let params={
      id: this.data.id
    }
   //旅行社
    getRouteTravelAgents(params).then(res=>{
      if (res.code == 200) {
        this.setData({
          travelAgents: res.data
        })
    } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
        
    }
    })
    //banner
    getRouteBanner(params).then(res=>{
      if (res.code == 200) {
        this.setData({
          banner: res.data
        })
    } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
        
    }
    })
    //文本
    getRouteOne(params).then(res=>{
      if (res.code == 200) {
        this.setData({
          text: res.data
        })
        //  解析图片base64的方法 -
        WxParse.wxParse('courseDetail', 'html', that.data.text.content, that, 0)
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

  },
  //生成海报
  generatePoster:function(){
    console.log(this.data.banner)
    let prams={
      banner:this.data.banner[0].fileManageUrl,
      title:this.data.text.title
    }
   wx.navigateTo({
     url: '/pages/poster/index?shareDate='+JSON.stringify(prams),
   })
  }
})