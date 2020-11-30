// pages/scenicSpotBooking/addTraveler/index.js
import { insertTravelers,selectOne,travelerUpdate } from '../../../utils/more/destination.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    checked: false,
    name: '',//姓名
    phone: '',//电话
    idCard: '',//身份证
    id:'',
    defaultTraveler: '',//是否默认出行人 1=是 0=否
    inUrl: '',//进入路由
  },
  // 返回上一页
  onClickLeft() {
    // wx.navigateTo({
    //   url: '../index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  // 真实姓名
  onName(event) {
    // event.detail 为当前输入的值
    // console.log(event.detail);
    this.setData({
      name: event.detail
    })
  },
  // 手机号码
  onPhone(event) {
    // console.log(event.detail);
    this.setData({
      phone: event.detail
    })
  },
  // 有效身份证
  onIdCard(event) {
    // console.log(event.detail);
    this.setData({
      idCard: event.detail
    })
  },
  // 设为默认出行人
  defaultYraveler(event) {
    console.log('moren...........', event.detail);
    this.setData({
      checked: event.detail,
    });
  },
  // 保存
  toInUrl() {
    // console.log('this.data.checked', this.data.checked)
    // if(this.data.checked == false) {
    //   this.setData({
    //     defaultTraveler: 0,
    //   });
    // } else {
    //   this.setData({
    //     defaultTraveler: 1,
    //   });
    // }
    const params = {
      defaultTraveler: this.data.checked ? 1:0,
      idCard: this.data.idCard,
      name: this.data.name,
      phone: this.data.phone,
    }
    if(this.data.id){
      params.id = this.data.id
      travelerUpdate(params).then((res) => {
        if(res.code == 200) {
          wx.navigateTo({
            url: '/' + this.data.inUrl,
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    } else {

      insertTravelers(params).then((res) => {
        if(res.code == 200) {
          wx.navigateTo({
            url: '/' + this.data.inUrl,
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */


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
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevpage = pages[pages.length - 2];
    console.log('prevpage.route.........', prevpage.route)
    this.setData({
      inUrl: prevpage.route,
    })
    console.log(options,'options');
    
    if(options.id){
      this.setData({
        id:options.id
      })
      var param = {
        id:options.id
      }
      selectOne(param).then((res) => {
        this.setData({
          name: res.data.name,//姓名
          phone: res.data.phone,//电话
          idCard: res.data.idCard,//身份证
          defaultTraveler: res.data.defaultTraveler,//是否默认出行人 1=是 0=否
          checked: res.data.defaultTraveler ? true : false,
        })
        console.log(res,this.data.name,this.data,'resresres');

      })
    }
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