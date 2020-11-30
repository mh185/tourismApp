// pages/index/guide/guideMap/index.js
import {
  getScenicDetail,
  getScenicFacilities
} from '../../../../utils/api/guide.js'

var app = getApp();
var host = app.globalData.host
var iconUrl = app.globalData.iconUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: host,
    showInformation: false,
    currentTab: 0,
    tabList: [{
        name: '景点',
        value: 'SPOTS',
        icon: iconUrl + '/jingqudingweitubiao.png'
      },
      {
        name: '厕所',
        value: 'TOILET',
        icon: iconUrl + '/zhaocesuotubiao.png'
      },
      {
        name: '出入口',
        value: 'EAE',
        icon: iconUrl + '/churukoutubiao.png'
      },
      {
        name: '服务点',
        value: 'SERVICE_POINT',
        icon: iconUrl + '/fuwudiantubiao.png'
      },
      {
        name: '小卖部',
        value: 'GROCERY_STORE',
        icon: iconUrl + '/xiaomaibudingweitubiao.png'
      },
      {
        name: '售票处',
        value: 'TICKET_OFFICE',
        icon: iconUrl + '/shoupiaochudingweitubiao.png'
      },
      {
        name: '乘车点',
        value: 'BUS_STOP',
        icon: iconUrl + '/chengchediantubiao.png'
      }
    ],
    iconUrl: '',
    mapSrc: '',
    navBarHeight: 0,
    tabHeight: 0,
    screenHeight: 0,
    isShowMap: false,
    options: {},
    scenicDetail: {}
  },
  async tabChange(event) {
    wx.showLoading({
      title: '加载中...',
    })
    const data = await this.getScenicFacilities(event.detail.index)
    this.setData({
      'options.markers': data
    })
  },
  initedMap(){
    setTimeout(()=>{
      wx.hideLoading()
    },100)
  },
  // 获取景区详情
  getScenicDetail() {
    const params = {
      id: this.data.scenicId
    }
    return new Promise((resolve, reject) => {
      getScenicDetail(params).then(res => {
        if (res.code == 200) {
          // res.data.handDrawingUrl
          this.setData({
            scenicDetail: res.data
          })
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    })
  },
  // 获取景区设施
  getScenicFacilities(index = 0) {
    const params = {
      scenicId: this.data.scenicId,
      type: this.data.tabList[index].value
    }
    return new Promise((resolve, reject) => {
      getScenicFacilities(params).then(res => {
        if (res.code == 200) {
          res.data.map(v => {
            v.icon = this.data.tabList[index].icon
            v.width = 50
            v.height = 50
          })
          resolve(res.data)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    })
  },
  // 景点 map
  toDetails: function () {
    wx.navigateTo({
      url: '../guide/guideMap/index',
    })
  },
 
  // 返回首页
  onClickLeft() {
    // wx.switchTab({
    //   url: '../index',
    // })
    wx.navigateBack({
      delta: 1,
    })
  },

  drawCanvas() { //生成图片
    wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
      x: 0,
      y: 0,
      width: this.data.canvasInfo.width,
      height: 300,
      destWidth: this.data.canvasInfo.width * 2, //输出的图片的宽度（写成width的两倍，生成的图片则更清晰）
      destHeight: 600,
      canvasId: 'canvas-map',
      success: res => {
        console.log(res);
      },
    })
  },
  getPageTapInfo() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery().select('#page-tab').boundingClientRect(res => {
        resolve(res)
      }).exec()
    })
  },
  init() {
    wx.showLoading({
      title: '加载中...',
    })
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      systemInfo,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight,
      'canvasInfo.width': systemInfo.screenWidth
    })
    const query = wx.createSelectorQuery()
    query.select('#nav-bar').boundingClientRect(res => {
      this.setData({
        navBarHeight: res.height
      })
    }).exec()
    query.select('.lower').boundingClientRect(res => {
      this.setData({
        lowerHeight: res.height
      })
    }).exec()
    
    const funs = [this.getPageTapInfo(),this.getScenicDetail(), this.getScenicFacilities()]
    Promise.all(funs).then(res => {
      const [pageInfo,scenicDetail,scenicFacilities] = res
      this.setData({
        'options.style.width': systemInfo.screenWidth,
        'options.style.height': this.data.screenHeight - this.data.lowerHeight - pageInfo.height - pageInfo.top,
        'options.image': this.data.host + scenicDetail.handDrawingUrl,
        'options.markers': scenicFacilities
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.data.scenicId = options.id ? options.id : ''
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  touchStartHandle(event) {
    if (!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)) {
      return
    }
    // 单手指缩放开始，也不做任何处理 
    if (event.touches.length == 1) {
      console.log('手指触摸动作开始', event)
      const currentX = event.touches[0].x
      const currentY = event.touches[0].y
      console.log(event)
      const currentPoint = this.data.pointList.find(point => this.checkBoundary(currentX, currentY, Object.assign(point, {
        width: 20,
        height: 25
      })))
      console.log(currentPoint)
      if (typeof currentPoint === 'object') {
        this.setData({
          currentPoint: currentPoint,
          showInformation: true
        })
      } else {
        this.setData({
          showInformation: false
        })
      }
      this.setData({
        touchStartInfo: {
          x: event.changedTouches[0].x,
          y: event.changedTouches[0].y
        }
      })
    }
  },
  touchMoveHandle(event) {
    if (!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)) {
      return
    }
    // 单手指缩放我们不做任何操作 
    if (event.touches.length == 1) {
      const currentX = event.changedTouches[0].x
      const currentY = event.changedTouches[0].y
      const preTouchX = this.data.touchStartInfo.x
      const preTouchY = this.data.touchStartInfo.y
      const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
      const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
      const maxImageX = this.data.canvasInfo.imageWidth - canvasWidth
      const maxImageY = this.data.canvasInfo.imageHeight - canvasHeight
      let newImageX = this.data.canvasInfo.imageX - (currentX - preTouchX)
      let newImageY = this.data.canvasInfo.imageY - (currentY - preTouchY)
      this.data.pointList.map(v => {
        if (newImageX > 0 && newImageX <= maxImageX) { // 
          v.x = v.x + (currentX - preTouchX)
        }
        if (newImageY > 0 && newImageY <= maxImageY) {
          v.y = v.y + (currentY - preTouchY)
        }
      })
      if (newImageX > 0) { // 
        if (newImageX > maxImageX) {
          newImageX = maxImageX
        }
      } else {
        newImageX = 0
      }
      if (newImageY > 0) {
        if (newImageY > maxImageY) {
          newImageY = maxImageY
        }
      } else {
        newImageY = 0
      }
      // console.log(`newImageX${newImageX}`, `newImageY${newImageY}`)
      this.setData({
        'canvasInfo.imageX': newImageX,
        'canvasInfo.imageY': newImageY,
      })
      this.drawMap()
      // ctx.moveTo(10, 10)
      // ctx.draw(true)
      this.setData({
        'touchStartInfo.x': event.changedTouches[0].x,
        'touchStartInfo.y': event.changedTouches[0].y
      })
      // console.log('手指触摸后移动', event)
    }
  },
  touchendHandle(event) {
    if (!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)) {
      return
    }
    console.log('触摸结束', event)
  }
})