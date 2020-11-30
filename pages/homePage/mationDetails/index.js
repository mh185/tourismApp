// pages/homePage/mationDetails/index.js
import {queryThemeDetail} from '../../../utils/api/index'
var util=require("../../../utils/util")
var app = getApp();
const imgUrl=app.globalData.imgUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfor:null,
    imgUrl:imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var id = options.id;
    wx.showLoading({
      title: '加载中....',
      mask:true 
    })
    queryThemeDetail({id:id}).then(res=>{
      if(res.status==200){
        var data = res.data;
        data.createDate=util.formatTimeLine(new Date(data.createDate));
        data.body=data.body.replace(/<img[^>]*>/gi, function (match, capture) {
          return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
        })
        data.body=data.body.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto" ')
        this.setData({
          detailInfor:data
        })
      }else{
        wx.showToast({
          title:res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
      wx.hideLoading();
    })
  },
})