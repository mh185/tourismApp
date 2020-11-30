// pages/destination/moredestination/index.js
import { queryDestination } from '../../../../utils/more/destination.js'

var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host;

const order = ['demo1', 'demo2', 'demo3']
// pages/destination/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:host,//图片域名
    screeningBool: false,
    activeNum:'first',
    areaCode:'',
    city: '',//导航头城市
    scenicList:[],
    hot: ['全部', '热门',],
    AAAA: ['全部', '4A', '3A',],
    hotShow:false,
    gradeList: [
      {
        name:'1A',
        show: false
      }, 
      {
        name: '2A',
        show: false
      }, {
        name: '3A',
        show: false
      }, {
        name: '4A',
        show: false
      }, {
        name: '5A',
        show: false
      }, 
      ],//AA列表
    chooseStar:'',
    iconUrl: iconUrl,
  },
  clickHot(e){
    this.setData({
      hotShow: !this.data.hotShow,
    })
  },
  clickStar(e){
    var t = e.target.dataset.id
    var i = e.target.dataset.index
    this.data.gradeList.map((item,j) => {
      if(i != j){
        var s = `gradeList[${j}].show`
        this.setData({
          [s]: false
        })
      }
    })
    var s = `gradeList[${i}].show`
    this.setData({
      [s]: !this.data.gradeList[i].show
    })
    if (this.data.gradeList[i].show) {
      this.setData({
        chooseStar: t,
      })
    } else {
      this.setData({
        chooseStar: '',
      })
    }
  },
  onReset(){
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
  onConfirm(){
    var starLevel
    this.data.gradeList.map((item, j) => {
      if (item.show) {
        starLevel = item.name
      }
    })
    const params = {
      page: 1,
      size: 10,
      vo: {
        "areaCode": "",//所在区县代码
        "hotScenicSpot": this.data.hotShow ? 1 : 0,//是否热门
        "starLevel": starLevel//景区星级
      }
    }
    this.pageScenic(params)
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  // 景点详情
  toAttractionsDetail(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/more/attractions/attractionsDetail/index?id='+id,
    })
  },
  // 导览地图
  toMuideMap(){
    wx.navigateTo({
      url: '/pages/index/guide/guideMap/index',
    })
  },
  // 返回上一页
  onClickLeft(){
    console.log('1123123123')
    wx.switchTab({
      url: '/pages/index/destination/index',
    })
  },
  // 筛选
  showScreening(){
    // console.log('1123123123')
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
  scroll(e) {
    // console.log(e)
  },
  handleTo(){
    wx.navigateTo({
      url: '/pages/destination/more/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      areaCode:options.areaCode
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
    const params = {
      // page: 1,
      // size: 10,
      vo:{areaCode: this.data.areaCode},
    }
    this.pageScenic(params)
  },
  // 获取景点
  pageScenic(params) {
    queryDestination(params).then((res) => {
      if (res.code == 200) {
        const area = res.data.rows
        this.setData({
          scenicList: area
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