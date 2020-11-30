// pages/commodity/allComment/index.js
import {queryThemeComment} from '../../../utils/api/index'
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    userId:app.globalData.userId,
    ThemeComment:[],//评论
    isMore:true,
    id:'',//商品id
    startPage:1,
    commentPoint:[{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    },{
      dark:'../../../images/icon-pentag-no.png',
      bright:'../../../images/icon-pentag-Yes.png',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getQueryThemeComment()
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
      startPage:1
    })
  },
//获取评论
getQueryThemeComment:function(){
  var params={
    id:this.data.id,
    startPage:this.data.startPage,
    pageSize:10
  }
  wx.showLoading({
    title: '加载中....',
        mask:true 
  })
  queryThemeComment(params).then(res=>{
    if(res.status==200){
      this.setData({
        ThemeComment:res.data.data
      })
      if(res.data.total==res.data.iTotalDisplayRecords){
        this.setData({
          isMore:false
        })
      }else{
        this.setData({
          isMore:true
        })
      }

    }else{
      this.setData({
        isMore:true
      })
      wx.showToast({
        title:res.msg,
        icon: 'none',
        duration: 1500,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isMore){
      var page=this.data.startPage++
      this.setData({
        startPage:page
      })
      this.getQueryThemeComment()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})