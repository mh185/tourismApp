// pages/index/tour/index.js
import {scenicQueryAll} from '../../../utils/more/tourGuide'
var app = getApp();
const host = app.globalData.host;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'TREBZ-UO4RW-LMZRQ-O524A-KSIL5-HUFBO'
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false, //等待状态
    host: host,
    latitude: '',
    longitude: '',
    currentPoint: {},
    showButtom: false,
    distance: '',
    markers: [],
    scenicList: [],
    mapStart: 0,
    mapEnd: 20,
  },
  //出发
  toWC() {
    wx.openLocation({
      longitude: Number(this.data.currentPoint.longitude),
      latitude: Number(this.data.currentPoint.latitude),
      scale: 18,
      complete: res => {
        console.log(res)
      }
    })
  },
  // 获取用户授权
  getAuthorization() {
    var that = this
    wx.getSetting({
      success(res) {
        console.log('res', res)
        if (!res.authSetting['scope.userLocation']) {
          console.log('用户授权')
          // 发起授权
          wx.authorize({
            scope: 'scope.userLocation',
            // 同意授权
            success() {
              that.getLocation()
            },
            // 不同意授权
            fail(res) {
              console.log('用户授权失败', res)
            }
          })
        } else {
          that.getLocation()
        }
      }
    })
  },
  onCallouttap(e) {
    // console.log('dainjidaiotubiao..........', e)
    var that = this
    var markerId = e.detail.markerId
    this.data.markers.map((item) => {
      // console.log('markees。。。',item, item.id, markerId)
      if (item.id == markerId) {
        var to = `${item.latitude},${item.longitude}`
        // console.log(to, 'eee')
        qqmapsdk.calculateDistance({
          //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
          //from参数不填默认当前地址
          //获取表单提交的经纬度并设置from和to参数（示例为string格式）
          from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
          to: to, //终点坐标
          success: function (res) { //成功后的回调
            // var res = res.result;
            console.log(res, res.result.elements[0].distance);
            item.distance = res.result.elements[0].distance; //将返回数据存入dis数组，
            that.setData({
              distance: res.result.elements[0].distance
            })
          },
          complete: function (res) {
            // console.log(res);

          }
        })
        this.setData({
          showButtom: true,
          currentPoint: item
        })
        console.log(item, 'currentPoint')
      }
    })
  },
  // 获取当前经纬度
  getLocation() {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res, 'res33333......')
        // const latitude = res.latitude
        // const longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        // that.data.markers.push({ // 获取返回结果，放到mks数组中
        //   title: '当前位置',
        //   id: 1,
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   iconPath: "http://47.108.86.202:8081/icon/location.png", //图标路径
        //   width: 20,
        //   height: 20
        // })
        // that.setData({ //设置markers属性，将搜索结果显示在地图中
        //   markers: that.data.markers
        // })
        that.gitScenicList()

      }
    })
  },
  // 搜索景区接口
  gitScenicList() {
    const that = this
    scenicQueryAll().then((res) => {
      if (res.code == 200) {
        const c = res.data
        // const c = res.data
        // c.map((item,i) => {
        //   item.title = l[item.type]
        //   // return c
        // })
        // console.log('c.......', c)
        this.setData({
          scenicList: c
        })
        that.getScenic(that.data.mapStart, that.data.mapEnd)
        // console.log('c2222222222.......', this.data.wcList)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  //地图API
  getScenic(e, d) {
    const that = this
    // 调用接口
    if (d > that.data.scenicList.length) {
      d = that.data.scenicList.length
    }
    qqmapsdk.search({
      keyword: '厕所', //搜索关键词
      ocation: {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      success: function (res) { //搜索成功后的回调
        // console.log('res44444444....', res)
        var mks = []
        const wc = that.data.scenicList
        console.log('res44444444....', wc)
        for (var i = e; i < d; i++) {
          that.data.markers.push({ // 获取返回结果，放到mks数组中
            title: wc[i].name,
            id: Number(wc[i].id),
            latitude: wc[i].lat,
            longitude: wc[i].lon,
            iconPath: that.data.host + "/icon/zhaocesuotubiao.png", //图标路径
            width: 20,
            height: 20
          })
        }
        console.log(that.data.markers, "that.data.markers")
        that.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: that.data.markers,
          loadingHidden: true
        })
        if (e < wc.length) {
          that.setData({
            mapStart: that.data.mapStart + that.data.mapEnd,
            mapEnd: that.data.mapEnd + 50,
          })
          setTimeout(function () {
            that.getScenic(that.data.mapStart, that.data.mapEnd)
          }, 5000);

        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  /**

    * 百度地图BD09坐标---->中国正常GCJ02坐标

    * 腾讯地图用的也是GCJ02坐标

    * @param double $lat 纬度

    * @param double $lng 经度

    * @return array();

    */
  // Convert_BD09_To_GCJ02(lat,lng){  
  //     let x_pi = 3.14159265358979324 * 3000.0 / 180.0;  
  //     let x = lng - 0.0065;  
  //     let y = lat - 0.006;  
  //     let z = sqrt(x * x + y * y) - 0.00002 * sin(y * x_pi);  
  //     let theta = atan2(y, x) - 0.000003 * cos(x * x_pi);  
  //     lng = z * cos(theta);  
  //     lat = z * sin(theta);  
  //     const list={
  //       lat:lat,
  //       lng:lng
  //     }
  //     return list;  

  // } ,
  // 返回上一页
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
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
    this.getAuthorization()
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
