// pages/logIn/otherLogin/index.js
import {setSmscode,telLogin} from '../../../utils/api/index'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telPhone:'',//手机号
    smsCode:'1234',//验证码
    smsFlag: true,
    snsMsgWait: 60,
    checked:false, //是否选中
    disabled:true,// 登录是否禁用

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  geTel:function(e){
    this.setData({
      telPhone:e.detail.value
    })
  },
  notelPhone:function(e){
    this.setData({
      telPhone:''
    })
  },
  getSmsCode:function(e){
    this.setData({
      smsCode:e.detail.value
    })
  },
   // 获取验证码
   sendCode: function() {  
    var that=this
    var params={
      type:'REGISTER',
      phone:this.data.telPhone
    }
    wx.showLoading({
      title: '加载中....',
          mask:true 
    })
    setSmscode(params).then(res=>{
      if(res.status==200){
        wx.showToast({
          title:'验证码发送成功',
          icon: 'none',
          duration: 1500,
        })
       // 60秒后重新获取验证码
        var inter = setInterval(function() {
          this.setData({
            snsMsgWait: this.data.snsMsgWait - 1
          });
          if (this.data.snsMsgWait == 0) {
            clearInterval(inter)
            this.setData({
              snsMsgWait: 60,
            });
          }
        }.bind(this), 1000);
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
     telLogin:function(){
    var that=this
     
      wx.login({
        success: res => {


          var params={
            telPhone:that.data.telPhone,
            smsCode:that.data.smsCode,
            code:res.code
          }
          wx.showLoading({
            title: '加载中....',
                mask:true 
          })
          telLogin(params).then(res=>{
            if(res.status==200){
              app.globalData.wxUserInfo=res.data
              app.globalData.userId=res.data.id
              app.globalData.openId=res.data.openId
              wx.showToast({
                title:'登录成功',
                icon: 'none',
                duration: 1500,
                success:function(){
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 2,
                    })
                  },1500)
                }
              })
            }else if(res.status==-1){
              wx.showToast({
                title:'用户未注册，请用微信登录',
                icon: 'none',
                duration: 1500,
                success:function(){
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 1,
                    })
                  },1500)
                }
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


        }})
   
  },
  /**
   * 跳转用户注册协议
   */
  handleAgreement:function() {
    wx.navigateTo({
      url: '../registrationAgreement/index',
      
    })
  },
  /**
   * 
   */
  checkboxChange:function() {
    this.setData({
      checked:!this.data.checked,
      disabled:!this.data.disabled,
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

  }
})