// pages/more/scenicSpotHeat/index.js
import {guideList} from '../../../utils/api/attraction'
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'

var QQMapWX = require('../../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'TREBZ-UO4RW-LMZRQ-O524A-KSIL5-HUFBO'
});
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
Page({
  /**
   * 页面的初始数据
   */
  data: {
    screeningBool: false,
    isLocation:false,
    iconUrl: iconUrl,
    host:host,
    latitude: '',
    longitude: '',
    adcode:'',
    selectItemId:'',
    cityList:[],
    scenicListData:[],
    searchLoading: false,
    location: '',
    page:1,
    // imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    // city: ['柳州', '柳北', '柳州', '柳北', '柳州', '柳北', '柳州', '柳北', '柳州',],
  },
  // 获取城市
  pageCity() {
    const city = {
      cityCode: '450200',
    }
    pageQueryByCityCode(city).then((res) => {
      if (res.code == 200) {
        const area = res.data
        this.setData({
          cityList: area
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
  // 筛选
  showScreening(){
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  // 景点详情
  toDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../attractions/attractionsDetail/index?id=' + id,
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      // url: '../../more/index',
      url: '/pages/index/index',
    })
  },
  reset(){
    this.setData({
      selectItemId: '',
      adcode:'',
      // latitude: '',
      // longitude: '',
    })
  },
  onSelectCity(e){
    // console.log(e.currentTarget.dataset.id,'e.currentTarget.dataset.id')
    var a = e.currentTarget.dataset.item
    this.setData({
      selectItemId: a.name,
      adcode: a.code,
      latitude: '',
      longitude: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    if (!this.data.isLocation){
      this.getAuthorization()
    }
    // const params = {}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 获取当前位置

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow', this.data.isLocation)

    this.setData({
      scenicListData:[]
    })
    this.pageCity()
    if (this.data.isLocation){
      this.setData({
        page: 1
      })
      this.scenicList()
    }
  },
  // 获取授权
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
              that.confirm()
              console.log('用户授权失败', res)
            }
          })
        } else {
          that.getLocation()
        }
      }
    })
  },
  // 重新定位
  toLocation(){
    this.getAuthorization()
  },
  // 获取定位
  getLocation(){
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        qqmapsdk.reverseGeocoder({
          //腾讯地图api 逆解析方法 首先设计经纬度
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          //逆解析成功回调函数
          complete: function (res) {
            console.log(res, 'sssss')
            that.setData({
              location: res.result.address_component.district,
              // adcode: res.result.ad_info.adcode,
            })
            that.setData({
              isLocation: true
            })
            // 定位成功后获取景区
            that.scenicList()
          }
        })
      }
    })
  },
  confirm(){
    this.setData({
      scenicListData: [],
      page:1,
    })
    this.scenicList()
  },
  scenicList() {
    const params = {
      areaCode: this.data.adcode,
      currentLat: this.data.latitude,
      currentLon: this.data.longitude,
    }
    guideList(params, this.data.page).then((res) => {
      wx.hideLoading()
      if(res.code==200){
        if(res.data.rows.length < 10){
         this.setData({
           searchLoading:true
         })
        }
        this.setData({
          scenicListData : this.data.scenicListData.concat(res.data.rows),
          screeningBool:false
        })
       wx.hideLoading()
     }else {
       wx.showToast({
           title: res.message,
           icon: 'none',
           duration: 1500,
       })
     }

    })
  },
  onClickMore:function(){
    console.log("点击")
    this.setData({
      page:this.data.page+1
    })
    this.scenicList()
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
    console.log("到底了！！");
    wx.showLoading({
     title: '玩命加载中',
   })
   this.onClickMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})