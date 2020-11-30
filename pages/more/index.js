// pages/more/index.js
import {
  getTel,
  } from '../../utils/api/user'
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contactTel:'',//拨打电话
    iconUrl: iconUrl,
    consultingService: [
      {
        imgName: 'jingqutubiao',
        name: '景区'
      },
      // {
      //   imgName: 'meishi',//少张图片
      //   name: '门票'
      // },
      {
        imgName: 'jxlx',
        name: '精品路线'
      },{
        imgName: 'jingqutianqitubiao',
        name: '柳州天气'
      },{
        imgName: 'meishi',
        name: '美食'
      },{
        imgName: 'daoyouchaxuntubiao',
        name: '导游查询'
      },{
        imgName: 'lvxingshechaxuntubiao',
        
        name: '旅行社查询'
      },{
        imgName: 'youjigonglue',
        name: '游记攻略'
      },
      // {
      //   imgName: 'meishi',//少张图片
      //   name: '线路导航'
      // },
    ],
    transportation: [
      {"name": "飞机出行"},
      {"name": "火车出行"},
      {"name": "汽车出行"},
    ],
    playAssistant: [
      {
        "name": "找公厕",
        imgName: 'zhaocesuoicon',
      },{
        "name": "景区导览",
        imgName: 'jingqudaolan',
      },{
        "name": "景区热度",
        imgName: 'jingquredu',
      },{
        "name": "旅游投诉",
        imgName: 'lvyoutousu',
      },
    ]
  },
  // 功能页面跳转
  toPage(event) {
    // console.log("event", event)
    var id = event.currentTarget.dataset.id
    var o = {
      "景区": "../more/attractions/index",
      "酒店": "",
      "门票": "/pages/scenicSpotTickets/index",
      "精品路线": "../more/boutiqueRoute/index",
      "柳州天气": "/pages/index/weather/index",
      "导游查询": "../more/tourGuide/index",
      "旅行社查询": "../more/travelAgencyInquiry/index",
      "游记攻略": "../more/travelNotesIntroduction/index",
      "线路导航": "",
      "美食": "../more/deliciousFood/index"
    }
    wx.navigateTo({
      url: o[id],
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 游玩助手
  clickPlayAssistant:function(e){
    // console.log(e.currentTarget.dataset.item)
    const mit=e.currentTarget.dataset.item.name;
    if(mit=="旅游投诉"){
      this.getTell();
    } else if(mit == "景区热度") {
      wx.navigateTo({
        url: '/pages/more/scenicSpotHeat/index',
      })
    } else if(mit == "景区导览") {
      wx.navigateTo({
        url: '/pages/index/tour/index',
      })
    } else if(mit == "找公厕") {
      // console.log('findToilet.........')
      wx.navigateTo({
        url: '/pages/more/findToilet/index',
      })
    }
  },
    //获取电话
    getTell:function(){
      getTel().then(res=>{
        contactTel: 12301;
        this.freeTell()
      //   if (res.code == 200) {
      //     this.setData({
      //       contactTel: res.data[0].contactTel
      //     })
      //     this.freeTell()
      // } else {
      //     wx.showToast({
      //         title: res.message,
      //         icon: 'none',
      //         duration: 1500,
      //     })
      // }
      })
    },
    //拨打电话
    freeTell:function (){
      wx.makePhoneCall({
        // phoneNumber: this.data.contactTel+"",
        phoneNumber: 12301+"",
      }).catch((e) => {
        // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
      })    
    },
})