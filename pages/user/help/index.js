// pages/user/help/index.js
import {
  getQuestionList
  } from '../../../utils/api/user'
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:iconUrl,
    questionList:[],
    helpPage:1,//第几页
    helpSize:10,//每页多少条
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({ changed: true })
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
      questionList: []
    }),
    this.getList()
  },
 getList(){
  let params={
    page:this.data.helpPage,
    size:this.data.helpSize,
    type:'TOURISM'
  }
  getQuestionList(params).then(res=>{
    if(res.code==200){
      if(res.data.rows.length < this.data.helpSize){
        this.setData({
          searchLoading:true
        })
       }
      this.setData({
        questionList:this.data.questionList.concat(res.data.rows)
      })
      app.globalData.questionList = this.data.questionList
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
    this.setData({
      helpPage:this.data.helpPage+1
    })
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toDited:function(e){
    // var item = e.currentTarget.dataset.item
    var id = e.currentTarget.dataset.id
    // var a = item.content.replace(/&ldquo;/g, '”');
    // var b = a.replace(/&rdquo;/g, '“');
    // console.log(b, 'item.content', a)
    console.log('item.content', id)
      wx.navigateTo({
        // url: '/pages/user/helpDetails/index?helpDetails='+JSON.stringify(e.currentTarget.dataset.item)+'&name=详情',
        // url: `/pages/user/helpDetails/index?title=${item.title}&name=详情&content=${b}`,
        url: `/pages/user/helpDetails/index?id=${id}`,
      });
 
  }
})