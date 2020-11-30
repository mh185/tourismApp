// pages/more/travelNotesIntroduction/index.js
import {gettravelsType,TravelsList,travelsBan,travelsShare,TravelsListKeyword} from '../../../utils/api/travels'
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host =app.globalData.host;
Page({
  // 页面的初始数据
  data:{
    current:1,
    page: 1,
    size: 10,
    travelsTypeId: '',
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    host:host,
    iconUrl: iconUrl,
    activeNum:'first',//导航头选择状态
    active:0,//导航头选择状态颜色
    navType:[],//导航头列表
    listData:[],//攻略列表
    travelsBaner:[],//banner
    travelsId:'',//被选游记 id
    key: '',//关键字
  },
  // 关键字搜索          关键字搜索  调取接口的时候  之前被查询出来的列表  没有被清空
  onSearch(e) {
    this.setData({
      key: e.detail,
      scenicSpotName: e.detail,
      listData: [],
      page: 1,
    })
    // if(this.data.key == '') {
    //   this.travelsList()
    // }else{
      this.TravelsListKeyword()
    // }
  },
  // 关键字搜索列表
  TravelsListKeyword() {
    const params = {
      page: this.data.page,
      size: this.data.size,
      key: this.data.key,
    }
    TravelsListKeyword(params).then((res) => {
      if (res.code==200) {
        if(res.data.rows.length < this.data.size){
          this.setData({
            searchLoading:true
          })
        }
        this.setData({
          listData:this.data.listData.concat(res.data.rows)
        })
        wx.hideLoading()
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //获取攻略列表 无关键字
  // travelsList(){
  //   const params = {
  //     page: this.data.page,
  //     size: this.data.size,
  //     travelsTypeId: this.data.travelsTypeId,
  //   }
  //   TravelsList(params).then((res) => {
  //     if (res.code==200) {
  //       if(res.data.rows.length < this.data.size){
  //         this.setData({
  //           searchLoading:true
  //         })
  //       }
  //       this.setData({
  //         listaDte:this.data.listaDte.concat(res.data.rows)
  //       })
  //       wx.hideLoading()
  //     }else{
  //       wx.showToast({
  //         title: res.message,
  //         icon: 'none',
  //         duration: 1500,
  //       })
  //     }
  //   })
  // },
  // 轮播
  swiperBindchange(event){
    console.log("000000000", event.detail);
    var current = event.detail.current
    this.setData({
      current:current + 1
    })
  },
  //获取banner
  travelsBan:function(){
    travelsBan().then(res=>{
      if(res.code==200){
        // console.log(res,"攻略111")
        this.setData({
          travelsBaner:res.data
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      // url: '../../more/index',
      url: '/pages/index/index',
    })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    //获取banner
    this.travelsBan()
    //获取攻略列表
    // if(this.data.key == '') {
    //   this.travelsList()
    // }else{
    this.setData({
      page: 1,
      listData: []
    })
      this.TravelsListKeyword()
    // }
    //获取游记攻略类型
    this.gettravelsType();
  },
  // 获取游记攻略类型
  gettravelsType:function(){
    gettravelsType().then(res=>{
      if(res.code==200){
        console.log(res,"攻略")
        this.setData({
          navType:res.data
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //页面上拉触底事件的处理函数   分页
  onReachBottom(){
    console.log("到底了！！");
    wx.showLoading({
     title: '玩命加载中',
   })
   this.onClickMore()
  },
  onClickMore:function(){
    console.log("点击")
    this.setData({
      page:this.data.page+1
    })
    //获取攻略列表
    // if(this.data.key == '') {
    //   this.travelsList()
    // }else{
      this.TravelsListKeyword()
    // }
    // this.travelsBan()
  },
  //切换攻略类型
  // click_option(e) {
  //   this.setData({
  //     page: 1,
  //     travelsTypeId: '',
  //     searchLoading: false,
  //     listData: [],
  //   })
  //   const t = e.currentTarget.dataset.id
  //   const a = e.currentTarget.dataset.index
  //   console.log('et.........', e, t);
  //   this.setData({
  //     activeNum: a
  //   })
  //   console.log('t3333333.........', this.data.activeNum)
  //   if(t != 'first') {
  //     this.setData({
  //       travelsTypeId: t
  //     })
  //   }
  //   this.travelsList()
  // },
  // 游记攻略详情
  toDetails: function (e) {
    console.log(e.currentTarget.dataset.index, '2222222222222222')
    this.setData({
      travelsId: e.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '../travelNotesIntroduction/travelStrategyDetails/index?id='+this.data.travelsId,
    })
  },
  // 分享
  travelsShare() {
    const params = {
      travelsId: this.data.travelsId
    }
    travelsShare(params).then((res) => {
      if(res.code == 200) {
      this.TravelsListKeyword()
      // this.click_option()
      } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  //用户点击右上角分享
  onShareAppMessage: function( options ){
    // console.log("options风向....", options)
    this.setData({
      travelsId: options.target.dataset.index
    })
    const that = this
    // 来自页面内的按钮的转发
    if(options.from == 'button'){
      // console.log("button分享....")
      that.travelsShare()
    }
  },
})