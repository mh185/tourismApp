// pages/more/attractions/index.js
var app = getApp();
var page=1;
var size=10;
const iconUrl = app.globalData.iconUrl
var host=app.globalData.host
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'
import { scenicList } from '../../../utils/api/attraction'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    areaCode: '',
    scenicSpotName: '',
    host:host,
    iconUrl: iconUrl,
    activeNum:'first',
    active:0,
    listData:[],//景区列表
    cityList: [],//城市列表
    keyWord: '',
  },
  // to景点详情
  toDetails: function (ev) {
    var id = ev.currentTarget.dataset.id
    wx.navigateTo({
      url: `../attractions/attractionsDetail/index?id=${id}`,
    })
  },
  // 关键字搜索
  onChange(e) {
    this.setData({
      keyWord: e.detail,
      scenicSpotName: e.detail,
      listData: [],
    })
    console.log('获取景区列表。。。', e);
    page = 1
    this.getScenicList()
  },
  // 区县点击
  click_option(e){
    // console.log('获取景区列表。。。', e);
    const t = e.target.dataset.id
    this.setData({
      activeNum: t,
      listData: [],
    })
    if(t != 'first') {
      this.setData({
        areaCode: t
      })
    } else {
      this.setData({
        areaCode: ''
      })
    }
    // console.log('areaCode', this.data.areaCode);
    page = 1
    this.getScenicList()
  },
  // 获取景区列表
  getScenicList(){
    const params = {
      areaCode: this.data.areaCode,
      scenicSpotName: this.data.scenicSpotName,
    }
    console.log('params.....', params);
    scenicList({ params, page, size }).then(res => {
      console.log({ page, size });
      if (res.code == 200) {
        if(res.data.rows.length < size){
          this.setData({
            searchLoading:true
          })
        }
        this.setData({
          listData:this.data.listData.concat(res.data.rows)
        })
        wx.hideLoading()
        console.log('listData.........', this.data.listData)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
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
  // 返回首页
  onClickLeft() {
    // console.log("返回首页。。。。。。。。。")
    wx.switchTab({
      url: '/pages/index/index',
      // url: '../index',
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
    if(!this.data.listData.length) {
      this.getScenicList()
    }
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
  
  onReachBottom: async function () {
    console.log("到底了！！");
    wx.showLoading({
     title: '玩命加载中',
   })
   this.onClickMore()
  },
  onClickMore:function(){
    // this.setData({
      page = page+1
    // })
    this.getScenicList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})