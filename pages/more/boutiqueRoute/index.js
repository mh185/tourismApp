// pages/boutiqueRoute/travelAgencyDetails/index.js
import {getRoutesType,routesLine } from "../../../utils/api/boutiqueRoute"
var app = getApp();
const host =app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    listDate: [],
    allData:[],
    active: "",
    navType:[],//导航集合
    host:host
  },
  // // 返回上一页
  // onClickLeft() {
  //   wx.navigateTo({
  //     url: '../../more/index',
  //   })
  // },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      // url: '../../more/index',
      url: '/pages/index/index',
    })
  },
  // 路线详情
  toDetails: function (e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../boutiqueRoute/routerDetail/index?id='+e.currentTarget.dataset.index
    })
  },
  // 筛选
  onChange(i){
    console.log(i);
    // var a = []
    // this.data.allData.map((item, j) =>{
    //   if(i.detail.index == item.id) {
    //     a.push(item)
    //   }
    // })
    let params={
      page:1,
      size:10
    }
    if(i!=null&&i.detail.title !='全部'){
      // params.routesTypeId=i.detail.title
      params.routesTypeId=i.detail.index
  
    }
    routesLine(params).then(res=>{
      if (res.code==200) {
          // 改变 data 中的数据
        this.setData({
          listDate:res.data 
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"options")
    // var sj = []
    // this.setData({
    //   listDate: sj
    // })
    // this.setData({
    //   allData: sj
    // })
  
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
    getRoutesType().then(res=>{
      if (res.code == 200) {
         this.setData({
            navType:res.data
         })
         console.log(this.data.navType)
         this.setData({
          active:0 
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