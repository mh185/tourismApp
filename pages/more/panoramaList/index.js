// pages/more/attractions/index.js
var app = getApp();
var page=1;
var size=5;
const iconUrl = app.globalData.iconUrl
var host=app.globalData.host
import {panoramaList} from '../../../utils/api/attraction'
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host:host,
    iconUrl: iconUrl,
    activeNum:'first',
    areaCode:'',
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    navList:[],//区县顶部列表
    active:0,
    listData:[],//列表
    cityList: [],//城市列表
    searchLoading:false,
    params:{}
  },
 
  // 获取景区列表

 
  getList() {
  
    panoramaList({page, size }).then(res => {
      console.log({ page, size });
      if (res.code == 200) {
        // 改变 data 中的数据
        this.setData({
          listData: res.data.rows
        })
        console.log(this.data.listData)
      }
    })
  },
  // to景点详情
  toDetails: function (ev) {
    var mapUrl = ev.currentTarget.dataset.id.mapUrl
 
    wx.navigateTo({
      url: `/pages/index/panorama/index?mapUrl=${mapUrl}`,
    })
  },
  // 返回首页
  onClickLeft() {
    // console.log("返回首页。。。。。。。。。")
    wx.switchTab({
      url: '/pages/index/index',
      // url: '../index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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

    //获取城市列表
    // this.pageCity()
    // //获取列表数据
    // this.onChange();
  },
  //获取城市列表
  // navType:function(){
  //   navType().then(res=>{
  //     // console.log(res)
  //     if(res.code==200){
  //         this.setData({
  //           navList:res.data
  //         })       
  //       // this.click_option()
  //     }else{
  //       wx.showToast({
  //         title: res.message,
  //         icon: 'none',
  //         duration: 1500,
  //     })
  //     }
  //   })
  // },
  
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
  
  onReachBottom: async function () {
    let {listData} = this.data;
    ++page;
    let res = await panoramaList({page,size})
    if(res.data.rows.length>0){
      listData =listData.concat(res.data.rows)
      this.setData({listData})
    }else{
      --page;
      console.log('ssss',page,res);
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1500,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})