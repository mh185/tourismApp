// pages/index/guide/index.js
import {
  guideType,
  guideList
} from '../../../utils/api/attraction'
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'

var app = getApp();
const host = app.globalData.host
const iconUrl = app.globalData.iconUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    host: host,
    activeNum: 'first',
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    listData: [], //列表
    navList: [], //导览类型
    cityList: [],//城市列表
    index: '',
    active: 0,
    page: 1,
    finished: false,
    searchLoading: false,
  },
  // 地区景点
  toMoredestination(e) {
    console.log('e........', e)
    const t = e.currentTarget.dataset.id
    this.setData({
      activeNum: t,
      page: 1,
      scenicList: [],
      searchLoading: false,

    })
    console.log('ttt', t)
    let params = {}
    if (t != 'first') {
      // params.travelsTypeId = event.detail.index
      // params.areaCode = event.detail.name
      this.setData({
        travelsTypeId: e.target.dataset.index,
        areaCode: t
      })
    } else {
      this.setData({
        travelsTypeId: '',
        areaCode: ''
      })
    }
    this.getList(params)
  },
  onChange: function (event) {
    this.setData({
      searchLoading: false,
      page: 1
    })
    let params = {}
    if (event != '' && event != null && event.detail.index != 0) {
      // params.travelsTypeId = event.detail.index
      // params.areaCode = event.detail.name
      this.setData({
        travelsTypeId: event.detail.index,
        areaCode: event.detail.name
      })
    } else {
      this.setData({
        travelsTypeId: '',
        areaCode: ''
      })
    }
    this.getList(params)
  },
  // 导航头点击
  click_option(e) {
    var t = e.target.dataset.id
    this.setData({
      activeNum: t
    })
    this.setData({
      searchLoading: false,
      page: 1
    })
    console.log('ttt',t)
    let params = {}
    if (t != 'first') {
      // params.travelsTypeId = event.detail.index
      // params.areaCode = event.detail.name
      this.setData({
        travelsTypeId: e.target.dataset.index,
        areaCode: t
      })
    } else {
      this.setData({
        travelsTypeId: '',
        areaCode: ''
      })
    }
    this.getList(params)
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
  // 景点 map
  toDetails: function (ev) {
    // console.log(ev);

    var id = ev.currentTarget.dataset.id
    // console.log(id);

    wx.navigateTo({
      // url: '../guide/guideMap/index',
      url: `../../more/attractions/attractionsDetail/index?id=${id}`,
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '../index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onPullDownRefresh: function () {

    console.log(11111);
  },
  onClickMore:function(){
    console.log("点击")
    this.setData({
     navPage:this.data.navPage+1
    })
    this.getList()
  },
  onReachBottom() {
    console.log("到底了！！");
    wx.showLoading({
      title: '玩命加载中',
    })
    this.onClickMore()
    // console.log(this);
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
    this.getList()
    // //获取导览类型
    // this.setData({
    //   finished: false,
    //   page:1,
    //   listData:[],
    // })
    // this.guideType();
    //获取列表
  },
  guideType: function () {
    guideType().then(res => {
      // console.log(res)
      if (res.code == 200) {
        this.setData({
          navList: res.data,
          num: res.data.code
        })
        this.onChange()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },


  getList: function (options) {
    const page = this.data.page
    let params = {
      'areaCode': this.data.areaCode,
      // 'currentLat': '42.1135',
      // 'currentLon': '116.5413',
      travelsTypeId: this.data.travelsTypeId,
      'currentLat': '',
      'currentLon': '',
    }
    // if(typeof params === 'object'){
    //   params = Object.assign(params,options)
    // }
    guideList(params, page).then(res => {
      if (res.code == 200) {
        const rows = res.data.rows
        rows.sort((a,b) => {
          return a.id -b.id
        })
        let list=this.data.listData
        let page=this.data.page
        list = page === 1 ? rows : list.concat(rows)
        if (rows.length < 10) {
          this.setData({
            searchLoading: true
          })
          // wx.showToast({
          //   title: '已经没有了',
          //   icon:'none'
          // })
        }
        this.setData({
          listData: list,
          page: page + 1
        })
      } else {
        wx.showToast({
          title: res.message,
          icon:'none',
          duration: 1500
        })
      }
      wx.hideLoading()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})