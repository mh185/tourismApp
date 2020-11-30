// pages/index/search/index.js
import { getAllSearch, getHotSearch, getUserSearch, deleteSearchAll} from '../../../utils/more/homeSearch.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl;
// var QQMapWX = require('../../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.min.js');
// var qqmapsdk = new QQMapWX({
//   key: 'TREBZ-UO4RW-LMZRQ-O524A-KSIL5-HUFBO'
// });
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:iconUrl,
    showResuilt: true,
    keyWord: '',
    keyList:[],
    hotKeyList:[],
    searchList: [],
    latitude: '',
    longitude: '',
  },
  //删除历史记录
  deleteSearchAll(){
    var that = this
    deleteSearchAll().then((res) =>{
      that.getUserSearch()
    })
  },
  toOther(e){
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    // HOTEL("hotel", "酒店"),
    //   TICKETS("tickets", "门票"),
    //   SCENIC_SPOT("scenic_spot", "景区"),
    //   DELICIOUS_FOOD("delicious_food", "美食"),
    //   GOURMET_SPECIALTY("gourmet_specialty", "美食特产"),
    //   ROUTE("route", "精选路线"),
    //   TRAVELS("travels", "旅游攻略"),
    //   MEETING_LIVE("meeting_live", "会议直播"),
    //   PRODUCT("product", "商品"),
    var url = {
      hotel:'',
      tickets:'',
      delicious_food: `/pages/more/deliciousFood/foodDetails/index?id=${id}`,
      gourmet_specialty: `/pages/index/gourmetSpecialty/foodDetails/index?id=${id}`,
      scenic_spot: `/pages/more/attractions/attractionsDetail/index?id=${id}`,
      route:`/pages/more/boutiqueRoute/routerDetail/index?id=${id}`,
      travels: `/pages/more/travelNotesIntroduction/travelStrategyDetails/index?id=${id}`,
      meeting_live:'',
      product:'',
    }
    if (url[index]){
      wx.navigateTo({
        url: url[index],
      })
    } else {
      wx.showToast({
        title: '暂未开通',
        icon: 'none',
        duration: 1500,
      })
    }

  },
  // 获取用户授权
  getAuthorization() {
    var that = this
    wx.getSetting({
      success(res) {
        // console.log('res', res)
        if (!res.authSetting['scope.userLocation']) {
          // console.log('用户授权')
          // 发起授权
          wx.authorize({
            scope: 'scope.userLocation',
            // 同意授权
            success() {
              that.getLocation()
            },
            // 不同意授权
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
  // 获取当前经纬度
  getLocation() {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res, 'res33333......')
        // const latitude = res.latitude
        // const longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 搜索事件
  onSearch(e){
    const z = e.detail
    this.setData({
      // showResuilt: false,
      keyWord: z
    })
    this.getSearchData()
  },
  onChange(e) {
    const c = e.detail
    if(c == '') {
      this.setData({
        showResuilt: true,
      })
    }
  },
  // 最近历史
  onUserHistory(e) {
    const kw = e.currentTarget.dataset.keyword
    this.setData({
      keyWord: kw,
    })
    this.getSearchData()
  },
  // 热门搜索
  onHotHistory(e) {
    const kw = e.currentTarget.dataset.keyword
    this.setData({
      keyWord: kw,
    })
    this.getSearchData()
  },
  // 搜索结果
  getSearchData(){
    var that = this
    if (this.data.keyWord == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none',
        duration: 1500,
      })
    } else {
      const params = {
        keyWord: this.data.keyWord
      }
      getAllSearch(params).then((res) => {
        that.getUserSearch()

        if (res.code == 200) {
          this.setData({
            showResuilt: false,
          })
          if (res.data.length == 0) {
            wx.showToast({
              title: '暂无相关数据',
              icon: 'none',
              duration: 1500,
            })
            
          } else {
   
          }
          this.setData({
            // showResuilt: false,
            searchList: res.data
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('options....', options)
    const opt = options.id
    if(opt == '') {
      // this.setData({
      //   showResuilt: true
      // })
    } else {
      this.setData({
        keyWord: opt,
      })
      this.getSearchData()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getUserSearch(){
    var param = {
      page:1,
      size:10,
    }
    getUserSearch(param).then((res) => {

      if (res.code == 200) {
        this.setData({
          keyList: res.data.rows
        })
        // wx.hideLoading()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  getHotSearch(){
    var param = {
      page:1,
      size:10,
    }
    getHotSearch(param).then((res) => {
      if (res.code == 200) {
        this.setData({
          hotKeyList: res.data.rows
        })
        // wx.hideLoading()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAuthorization()
    this.getHotSearch()
    this.getUserSearch()
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