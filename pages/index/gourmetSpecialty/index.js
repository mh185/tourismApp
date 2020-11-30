// pages/index/gourmetSpecialty/index.js
import {pageQuerySpecialty,pageQueryByCityCode} from '../../../utils/more/tourGuide.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNum:'first',//城市颜色切换
    cityList: [],//城市列表
    foodList: [],//美食列表
    iconUrl: iconUrl,
    host: host,
    // active:0,
    // navType:[],//城市列表
    // imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
  },
  // 头部导航栏颜色
  click_option(e){
    // 切换颜色
    const t = e.target.dataset.id
    const index = e.target.dataset.index
    // console.log('t......',e, t, index)
    this.setData({
      activeNum : index
    })
    // 美食列表渲染
    const params = {
      areasId: '',
      page: 1,
      size: 10,
      sort: 'sort',
    }
    if(t == 'first') {
      this.pagefood(params)
    } else {
      params.areasId = t
      this.pagefood(params)
    }
  },
  // 美食详情
  toFoodDetails: function (e) {
    const id = e.currentTarget.dataset.item
    // console.log('id.......', id, e)
    wx.navigateTo({
      url: '/pages/index/gourmetSpecialty/foodDetails/index?id=' + id,
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      // url: '../../more/index',
      url: '../index',
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
    this.pageCity()
    const params = {
      areasId: '',
      page: 1,
      size: 10,
      sort: 'sort',
    }
    this.pagefood(params)
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
  // 获取美食
  pagefood(p) {
    pageQuerySpecialty(p).then((res) => {
      // console.log('res....',res)
      if (res.code == 200) {
        const food = res.data.rows
  
        this.setData({
          foodList: food
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