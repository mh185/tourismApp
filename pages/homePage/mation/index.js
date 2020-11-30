// pages/homePage/mation/index.js
import {querynotice} from '../../../utils/api/index'
var util=require("../../../utils/util")
var app = getApp();
const imgUrl=app.globalData.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:imgUrl,
    userId:'',
    informationList:[],
    startPage:1,
    isMore:false
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
      userId:app.globalData.userId
    })
    
    this.querynotice()
  },
  //查询公告
  querynotice:function(){
    var that=this
    var params={
      startPage:that.data.startPage,
      pageSize:20,
    }  
    wx.showLoading({
      title: '加载中....',
      mask:true 
    })
    querynotice(params).then(res=>{
      if(res.status==200){
          if(that.data.startPage==1){
            this.setData({
              informationList:[]
            })
          }
          var list=res.data.data
          list.forEach(v=>{
            v.conent=that.delHtmlTag(v.body)
            v.createDate=util.formatTimeLine(new Date(v.createDate))
          })    
          var datalist=this.data.informationList.concat(list)
          this.setData({
            informationList:datalist
          })
          if(res.data.total>res.data.iTotalDisplayRecords){
            this.setData({
              isMore:true
            })
          }else{
            this.setData({
              isMore:false
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
  //去除标签
  delHtmlTag:function(str){
    return str.replace(/<[^>]+>/g,"");
  },
  //详情
  mationDetails:function(event){
    var mationtxt=event.currentTarget.dataset.mationtxt;
    wx.navigateTo({
      url: '/pages/homePage/mationDetails/index?id='+mationtxt.id
    });
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
      },()=>that.querynotice())      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})