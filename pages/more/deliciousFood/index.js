// pages/more/deliciousFood/index.js
import {pageQuery,pageQueryByCityCode,} from '../../../utils/more/tourGuide.js'
var app = getApp();
const host = app.globalData.host
const iconUrl = app.globalData.iconUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    page: 1,
    size: 5,
    activeNum:'first',//城市颜色切换
    host: host,
    cityId: '',// 城市 ID
    foodList: [],//美食列表
    cityList: [],//城市列表
    // imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
  },
  // 头部导航栏颜色
  click_option(e){
    // 切换颜色
    const t = e.target.dataset.id
    const index = e.target.dataset.index
    // console.log('t......',e, t, index)
    this.setData({
      activeNum : index,
      page: 1,
      foodList: [],
    })
    if(t == 'first') {
      this.setData({
        cityId: ''
      })
    } else {
      this.setData({
        cityId: t
      })
    }
    // 美食列表渲染
    this.pagefood()
  },
  // 美食详情
  toFoodDetails: function (e) {
    const id = e.currentTarget.dataset.item
    // console.log("e.......", e, id)
    wx.navigateTo({
      url: '../deliciousFood/foodDetails/index?id=' + id,
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      // url: '../../more/index',
      url: '/pages/index/index',
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
    // console.log('页面显示.....')
    this.pageCity()
    // console.log('获取.....')
    this.setData({
      page: 1,
      foodList: [],
    })
    this.pagefood()
  },
  // 获取城市
  pageCity() {
      console.log('city....')
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
  pagefood() {
    const params = {
      areas_id: this.data.cityId,
      page: this.data.page,
      size: this.data.size,
      sort: 'sort',
    }
    pageQuery(params).then((res) => {
      // console.log('res....',res)
      if (res.code == 200) {
        const food = res.data.rows
        if (food.length == 0) {
          wx.showToast({
            title: '无数据',
            icon: 'none',
            duration: 1500,
          })
        }
        if (food.length < this.data.size) {
          this.setData({
            searchLoading: true
          })
        }
        this.setData({
          foodList: this.data.foodList.concat(food)
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
    console.log("到底了！！");
    wx.showLoading({
      title: '玩命加载中',
    })
    this.onClickMore()
  },
  onClickMore: function () {
    console.log("点击")
    this.setData({
      page: this.data.page + 1
    })
    this.pagefood()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})