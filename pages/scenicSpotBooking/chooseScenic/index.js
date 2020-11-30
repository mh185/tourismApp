// pages/scenicSpotBooking/chooseScenic/index.js
var app = getApp();
const iconUrl = app.globalData.iconUrl
const host = app.globalData.host
import { getScenicList } from '../../../utils/more/scenicSpotBooking.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: iconUrl,
    host:host,
    page:1,
    size:10,
    searchLoading:false,
    scenicList:[],
    // basicHost:'https://test.nc.gxota.com/basic',
    imgUrl:'',
    keyWord:'',
  },
  //获取景区列表
  getScenicList(){
    var that = this
    const params = {
      city: '柳州市',
      level: null,
      name: this.data.keyWord,
      page: this.data.page,
      size: this.data.size,
    }
    getScenicList(params).then(res => {
      if (res.code == 0) {
        if (res.data.length < that.data.size) {
          that.setData({
            searchLoading: true
          })
        }
        res.data.map((item) => {
          item.level = item.level ? item.level : '暂无'
          item.imgUrl = that.seeImgUrl(item.image);
        })
        that.setData({
          scenicList: that.data.scenicList.concat(res.data),
          // imgUrl:res.data.image,
        })
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //选择
  toSelect(e) {
    console.log('55555555', e)
    const selectScenicId = e.currentTarget.dataset.id
    const chooseScenic = e.currentTarget.dataset.scenic
    if(this.data.scenicList.isOpenAppointment == 1){
      wx.showToast({
        title: '当前景区暂未开放预约',
        icon: 'none',
        duration: 1500,
      })
    }else{
      wx.setStorageSync('selectScenicId', selectScenicId)
      wx.setStorageSync('chooseScenic', chooseScenic)
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //图片显示
  seeImgUrl(img){
    if(img == undefined || img == null || img == ''){
      return `http://47.108.86.202:8081/icon/morenjingqutupian.png`
      // this.setData({
      //   imgUrl:`http://47.108.86.202:8081/morenjingqutupian.png`
      // })
    }else{
      if(img.indexOf('https')==-1) {
      return 'https://file.gxota.net/'+img

        // this.setData({
        //   imgUrl:'https://file.gxota.net/'+img
        // })
        // return 'https://file.gxota.net/'+img
      }else{
        // this.setData({
        //   imgUrl:img
        // })
        return img
      }
    }
  },
  // 景区列表
  // scenicList(){
  //   var that = this
  //   const scenicHost = app.globalData.scenicHost
  //   wx.request({
  //     // url: `${scenicHost}/Appointment/v2/list`, //服务器url+参数中携带的接口具体地址
  //     url: `${scenicHost}/Appointment/v2/list`, //服务器url+参数中携带的接口具体地址
  //     data:{
  //       // AppId:'0000000000',
  //       city:'柳州市',
  //       name:that.data.keyWord,
  //       level:'',
  //       page:that.data.page,
  //       size:that.data.size,
  //     },
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded", 
  //       AppId:'772wgl',
  //     },
  //     method: 'POST', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
  //     success: function (res) {
  //       console.log('res.....', res)
  //       console.log('res111111.....', res.data.data)
  //         if (res.data.code == 0){
  //           if(res.data.data.length < that.data.size){
  //             that.setData({
  //              searchLoading:true
  //            })
  //           }
  //           res.data.data.map((item) => {
  //             item.level =  item.level ? item.level:'暂无'
  //             item.imgUrl = that.seeImgUrl(item.image);
  //           })
  //           console.log(res.data.data,'res.data.data.data000000')
  //           that.setData({
  //             scenicList: that.data.scenicList.concat(res.data.data),
  //             // imgUrl:res.data.data.image,
  //           })
  //          wx.hideLoading()
  //         // console.log('res11111.....', res.data)
  //         // console.log('222222222222222.....', res.data.data)
  //         console.log('3333333333333333.....', that.data.scenicList)
  //       }else{
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon: 'none',
  //           duration: 1500,
  //         })
  //       }
  //     }
  //   })
  // },
  // 搜索事件
  // onSearch(e){
  //   const z = e.detail
  //   this.setData({
  //     // showResuilt: false,
  //     keyWord: z
  //   })
  //   this.getSearchData()
  // },
  onSearch(e) {
    this.setData({
      keyWord: e.detail,
      page:1,
      scenicList:[],
    })
    console.log("this.data.keyWord.......", e.detail, this.data.keyWord)
    // this.scenicList()
    this.getScenicList()
  },
  // 返回上一页
  onClickLeft() {
    // wx.navigateTo({
    //   url: '../../scenicSpotBooking/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //监听页面到底下拉事件
  onReachBottom() {
    console.log("到底了！！");
    wx.showLoading({
      title: '玩命加载中',
    })
    this.onClickMore()
  },
  onClickMore(){
    console.log("点击")
    this.setData({
      page: this.data.page + 1
    })
    // this.scenicList()
    this.getScenicList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.scenicList()
    this.getScenicList()
  },
  // 获取用户授权
  // getAuthorization() {
  //   var that = this
  //   wx.getSetting({
  //     success(res) {
  //       console.log('res',res)
  //       if (!res.authSetting['scope.userLocation']) {
  //         console.log('用户授权')
  //         wx.authorize({
  //           scope: 'scope.userLocation',
  //           success() {
  //             // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
  //             // wx.startRecord()
  //             that.getLocation()
  //           },
  //           fail(res){
  //             console.log('用户授权失败', res)
  //           }
  //         })
  //       } else {
  //         that.getLocation()
  //       }
  //     }
  //   })

  // },
  // // 获取定位
  // getLocation(){
  //   var that = this
  //   wx.getLocation({
  //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  //     success(res) {
  //       const latitude = res.latitude
  //       const longitude = res.longitude
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       })
  //       qqmapsdk.reverseGeocoder({
  //         //腾讯地图api 逆解析方法 首先设计经纬度
  //         location: {
  //           latitude: res.latitude,
  //           longitude: res.longitude
  //         },
  //         //逆解析成功回调函数
  //         complete: function (res) {
  //           console.log(res, 'sssss')
  //           that.setData({
  //             location: res.result.address_component.district,
  //             adcode: res.result.ad_info.adcode,
  //           })
  //         }
  //       })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})