// pages/destination/moredestination/index.js
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
const weathers = app.globalData.weathers
import { queryTopScenicSpot, navType } from '../../../../utils/api/attraction'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    weathers: weathers,
    host:host,
    screeningBool: false,
    // screeningBool: true,
    activeNum:'first',
    searchLoading:false,
    navPage:1,
    navSize:10,
    hotData:[],
    iconUrl: iconUrl,
    cityList: [],
  },
  // 获取区县
  getCityList(){
    navType().then((res) => {
      if (res.code == 200) {
        this.setData({
          cityList: res.data
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
  // to 天气
  toWeather() {
    wx.navigateTo({
      url: '/pages/index/weather/index'
    })
  },
  // 景区详情
  toAttractionsDetail(ev) {
    // console.log(ev);
    var id = ev.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/more/attractions/attractionsDetail/index?id=${id}`
    })
  },
  // 返回首页
  onClickLeft(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 筛选
  showScreening(){
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  // 导航头点击
  click_option(e){
    var t = e.target.dataset.id
    this.setData({
      activeNum : t
    })
  },
  // 重置
  onReset() {
    this.data.gradeList.map((item, j) => {
      var s = `gradeList[${j}].show`
      this.setData({
        [s]: false
      })
    })
    this.setData({
      chooseStar: '',
      hotShow: false,
    })
  },
  // 确认
  onConfirm() {
    this.setData({
      hotData: [],
      navPage: 1,
    })
    this.gethotData()
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      weathers: app.globalData.weathers
    })
    this.getCityList()
    this.getQueryTopScenicSpot()
  },
  getQueryTopScenicSpot() {
    var starLevel = ''
    this.data.gradeList.map((item, j) => {
      if (item.show) {
        starLevel = item.name
      }
    })
    let params = {
      page: this.data.navPage,
      size: this.data.navSize,
      "hotScenicSpot": this.data.hotShow ? 1 : 0,//是否热门
      "starLevel": starLevel,//景区星级
    }
    queryTopScenicSpot(params).then(res => {
      if (res.code == 200) {
        if (res.data.rows.length < this.data.navSize) {
          this.setData({
            searchLoading: true
          })
        }
        this.setData({
          hotData: this.data.hotData.concat(res.data.rows)
        })
        wx.hideLoading()
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
    wx.showLoading({
      title: '玩命加载中',
    })
    this.onClickMore()
  },
  onClickMore: function () {
    console.log("点击")
    this.setData({
      navPage: this.data.navPage + 1
    })
      //热门推荐
      this.gethotData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})