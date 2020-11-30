// pages/user/index.js
import {
  getTel,
  getAboutUs
  } from '../../utils/api/user'
import { getRealAuth } from '../../utils/more/healthCode.js'

var app = getApp();
const iconUrl = app.globalData.iconUrl
// pages/homePage/index.js
const userid=app.globalData.userId
 const userinfo=app.globalData.wxUserInfo
Page({

  /**ß
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    userId: userid,
    userInfor: userinfo,
    phone: '',
    show:false,//联系我们弹出框
    contactTel:"012-9922",//联系我们电话
    erweima: iconUrl + "/erweima.png",
    authentication:true,//实名
  },
// 返回首页
onClickLeft() {
  wx.switchTab({
    url: '/pages/index/index'
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userId: app.globalData.userId,
      userInfor: app.globalData.wxUserInfo,
      phone: app.globalData.userPhone
    })
    console.log(this.data.userInfor)
    if(this.data.userInfor!=null&&this.data.userInfor!='') {
      this.onGetRealAuth()
    }
  },
  // 查看用户是否已经实名认证
  onGetRealAuth() {
    getRealAuth().then((res) => {
      console.log('res......', res)
      if (res.code == 200) {
        this.setData({
          authentication: res.data
          // authentication: 1
        })
        // 0 没认证
        // if (!res.data){
        //   wx.navigateTo({
        //     url: '/pages/index/healthCode/index',
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: '/pages/index/healthCode/healthQrCode/index',
        //   })  
        // }
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  //前往编辑个人信息页面
  goEditPerson: function () {
    wx.navigateTo({
      url: '/pages/user/editPerson/index',
    });
  },

  getPerson: function (e) {
    app.globalData.wxInfo = e.detail;
    wx.navigateTo({
      url: "/pages/logIn/index"
    });
  },
  /**
   * 跳转我的卡卷
   */
  cardRoll:function() {
    wx.navigateTo({
      url: '/pages/user/cardRoll/index',
    })
  },
  //跳转收藏
  myCollection: function () {
    if (app.globalData.userId != null && app.globalData.userId != '') {
      wx.navigateTo({
        url: '/pages/user/myCollect/index',
      });
    } else {
      wx.showToast({
        title: '您还未登录，请先登录',
        icon: 'none',
        duration: 1500,
      })
    }
  },

  //跳转设置
  setUp: function () {
    wx.navigateTo({
      url: '/pages/user/setUp/index',
    });
  },

  //跳转我的订单
  myOrder: function () {
    if (app.globalData.userId != null && app.globalData.userId != '') {
      wx.navigateTo({
        url: '/pages/user/myOrder/index',
      });
    } else {
      wx.showToast({
        title: '您还未登录，请先登录',
        icon: 'none',
        duration: 1500,
      })
    }
  },

  //跳转会员中心
  toMemberCenter: () => {
    if (app.globalData.userId != null && app.globalData.userId != '') {
      wx.navigateTo({
        url: '/pages/user/memberCenter/index',
      });
    } else {
      wx.showToast({
        title: '您还未登录，请先登录',
        icon: 'none',
        duration: 1500,
      })
    }
  },
  //获取电话
  getTell:function(){
    getTel().then(res=>{
      if (res.code == 200) {
        this.setData({
          contactTel: res.data[0].contactTel
        })
        this.freeTell()
    } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
    }
    })
  },
  //拨打电话
  freeTell:function (){
  
    wx.makePhoneCall({
      phoneNumber: this.data.contactTel+'',
    }).catch((e) => {
      // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
    })
  },
  showPopup:function (){
    this.setData({ show: true });
  },

  onClose:function () {
    this.setData({ show: false });
  },
  //帮助中心
  toHelp:function(){
      wx.navigateTo({
        url: '/pages/user/help/index',
      });
  },
  //关于我们
  toAboutUs:function(){

    wx.navigateTo({
      url: '/pages/user/helpDetails/index?name=关于我们',
    });
    
  },
  //实名认证
  toAuthentication:function(){
    wx.navigateTo({
      url: `/pages/user/authentication/index?authentication=${this.data.authentication}`,
    });
  }
})