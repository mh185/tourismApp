// pages/homePage/search/index.js
import {searchGoods,hotSearch,myHistorySearch,deleteMyHistorySearch} from '../../../utils/api/index'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    shopList:[],
    isMore:false,
    startPage:1,
    hotSearchList:[],//热门搜索
    historySearchList:[],
    searchTxt:'',
    isSearch:false,
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
  //获取商品
  searchGoods:function(){
    const that=this
    if(that.data.searchTxt==''){
      wx.showToast({
        title:'请选择筛选条件',
        icon: 'none',
        duration: 1500,
      })
      return false
    }
    var params={
      userId:app.globalData.userId,
      search:that.data.searchTxt,
      startPage:that.data.startPage,
      pageSize:15
    }
    for ( var key in params ){
      if ( params[key] ==='' ){
        delete params[key]
      }
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    searchGoods(params).then(res=>{
      if(res.status==200){
      if(that.data.startPage==1){
        this.setData({
          shopList:[],
        })
      }
      var shopList=this.data.shopList.concat(res.data.data)
      if(res.data.total==res.data.iTotalDisplayRecords){
        this.setData({
          isMore:false,
          shopList:shopList,
          isSearch:true
        })
      }else{
        this.setData({
          isMore:true,
          shopList:shopList,
          isSearch:true
        })
      }
      }else{
      wx.showToast({
        title:res.msg,
        icon: 'none',
        duration: 1500,
      })
      }
      wx.hideLoading()
    })
  },
  //跳转详情页面
  shopDetails:function(event){
    var id=event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commodity/productDetails/index?id='+id
    });
  },
  //热门搜索
  hotSearch:function(){
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    hotSearch().then(res=>{
      if(res.status==200){
        this.setData({
          hotSearchList:res.data
        })
      }else{
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  //我的搜索记录
  myHistorySearch:function(){
    var params={
      userId:app.globalData.userId
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    myHistorySearch(params).then(res=>{
      if(res.status==200){
        this.setData({
          historySearchList:res.data
        })
      }else{
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  //删除我的搜索记录
  historyDetele:function(){
    var params={
      userId:app.globalData.userId
    }
    wx.showLoading({
      title: '加载中....',
        mask:true 
    })
    deleteMyHistorySearch(params).then(res=>{
      if(res.status==200){
        wx.showToast({
          title:'删除成功',
          icon: 'none',
          duration: 1500,
        })
        this.myHistorySearch()
      }else{
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading()
    })
  },
  //重新查询
  searchBtn:function(event){
    this.setData({
      searchTxt:event.currentTarget.dataset.searchtxt
    })
    this.searchGoods()
  },
  //
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.hotSearch()
    this.myHistorySearch()
    // this.setData({
    //   startPage:1,
    //   shopList:[],
    //   isSearch:true,
    // })
  },
  //搜索输入框
  searchInput:function(e){
    this.setData({
      searchTxt:e.detail.value
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
    var that=this
    if(that.data.isMore){
      var pageNUm=Number(that.data.startPage)+1
      that.setData({
        startPage:pageNUm
      },()=>that.searchGoods())      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})