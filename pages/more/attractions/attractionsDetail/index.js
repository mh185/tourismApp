// pages/more/attractions/attractionsDetail/index.js
var WxParse = require('../../../../components/wxParse/wxParse.js');
var app = getApp();
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'TREBZ-UO4RW-LMZRQ-O524A-KSIL5-HUFBO'
});
const iconUrl = app.globalData.iconUrl
import {getDetail} from '../../../../utils/api/attraction'
// import {getTel} from '../../../../utils/api/user'
const host = app.globalData.host
// const weathers = app.globalData.weathers
Page({
  data: {
    contactTel:'',//拨打电话
    iconUrl: iconUrl,
    host:host,
    weather: '',
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    detailData:[],
    travelsRotation:[],//轮播
    current:1,
    id:'',
    // domReady:false,//视频
  },
  // to 天气
  toWeather() {
    wx.navigateTo({
      url: '/pages/index/weather/index'
      // url: '/pages/index/weather/index?weather='+JSON.stringify(this.data.weathers.forecast7),
    })
  },
  // to 导航
  toScenic(){
    wx.openLocation({
      longitude: this.data.detailData.lon,
      latitude: this.data.detailData.lat,
      scale: 18,
      complete: res => {
        console.log(res)
      }
    })
  },
  // 轮播
  swiperBindchange(event){
    console.log("000000000", event.detail);
    var current = event.detail.current
    this.setData({
      current:current + 1
    })
  },
  // 导览地图
  toGuideMap() {
    wx.showToast({
      title: '手绘地图正在绘制中',
      icon: "none"
    })
    // if(this.data.detailData.handDrawingUrl == null) {

    // } else {
    //   wx.navigateTo({
    //     // url: '/pages/index/guide/guideMap/index?id=' + this.data.id
    //     url: '/pages/index/guide/guideMaptwo/index?id=' + this.data.id
    //   })
    // }
  },
  // 返回上一页
  onClickLeft() {
    let pages = getCurrentPages();
    let currPage = null;
    // console.log(pages) 的到一个数组
    if (pages.length) {
      // 获取当前页面的前以页面的对象
      currPage = pages[pages.length - 2];
    }
    // 获取当前页面的前一页面的路由
    let route = currPage.route
    console.log('route..........', route)
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const id = options.id
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
    this.setData({
      weather: app.globalData.weathers.wendu
    })
    this.getDetailContent();
  },
  getDetailContent(){
    let that=this;
    const params = {
      id: this.data.id
    }
    getDetail(params).then(res=>{
      // console.log(res);
      if(res.code == 200){
        this.setData({
          detailData: res.data,
          // domReady: true
          travelsRotation: res.data.fileManageList
        })
        // //  解析图片base64的方法 -
        WxParse.wxParse('courseDetail', 'html', that.data.detailData.description, that, 0)
        if(this.data.travelsRotation.length < '1') {
          this.setData({
            current: '0'
          })
        }
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //拨打电话
  toPhone(){
    this.freeTell()
  },
  //拨打电话
  freeTell:function (){
    wx.makePhoneCall({
      // phoneNumber: this.data.contactTel+"",
      phoneNumber: this.data.detailData.phone,
    }).catch((e) => {
      // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
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
     let prams={
       banner:this.data.travelsRotation[0].url,
       title:this.data.detailData.name
     }
    wx.navigateTo({
      url: '/pages/poster/index?shareDate='+JSON.stringify(prams),
    })
  }
})