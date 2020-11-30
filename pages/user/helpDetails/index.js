// pages/user/help/index.js
import {
  getQuestionList,
  getAboutUs
} from '../../../utils/api/user'
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    helpDetailsList: [],
    title: '', //标题
    name:'',
    content:'',
  },
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({ changed: true })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options, '22222222222222', app.globalData.questionList)
    if(options.name == '关于我们') {
      this.setData({
        name: options.name,
        content: `“畅游柳州”小程序为您提供线上景区介绍、景区实景、旅游攻略、美食等文旅资讯。`
      })
      // this.getAboutUs()
    } else if (options.id){
      const questionList = app.globalData.questionList
      questionList.map((item, i) => {
        if (item.id == options.id) {
          this.setData({
            content: item.content,
            name: '详情',
            title: item.title,
          });
        }
      })
      // console.log(this.data.helpDetailsList);
    }
  

  },
// 关于我们
  getAboutUs(){
    getAboutUs().then(res => {
      if (res.code == 200) {
        // console.log('000000.....', res)
        this.setData({
          content: res.data.content
        });
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
})