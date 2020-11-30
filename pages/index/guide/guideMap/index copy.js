// pages/index/guide/guideMap/index.js
import {
  getScenicDetail,
  getScenicFacilities
} from '../../../../utils/api/guide.js'

var app = getApp();
var host = app.globalData.host
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
        value: 'SPOTS'
      },
      {
        name: '厕所',
        value: 'TOILET'
      },
      {
        name: '出入口',
        value: 'EAE'
      },
      {
        name: '服务点',
        value: 'SERVICE_POINT'
      },
      {
        name: '小卖部',
        value: 'GROCERY_STORE'
      },
      {
        name: '售票处',
        value: 'TICKET_OFFICE'
      },
      {
        name: '乘车点',
        value: 'BUS_STOP'
      }
    ],
    iconUrl: '',
    mapSrc: '',
    navBarHeight: 0,
    tabHeight: 0,
    screenHeight: 0,
    canvasInfo: {
      // mapImgUrl,
      width: 0,
      height: 0,
      imageWidth: 0, // 手绘地图图片的原宽度
      imageHeight: 0,
      scale: 1,
    },
    scenicDetail: {},
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    pointList: [{
      x: 160,
      y: 70,
      name: '白莲洞风景名胜区1'
    }],
    currentPoint: {}
  },
  async tabChange(event) {
    await this.getScenicFacilities(event.detail.index)
    this.initImage()
  },
  // 获取景区详情
  getScenicDetail() {
    const params = {
      id: this.data.scenicId
    }
    // return new Promise((resolve, reject) => {
      getScenicDetail(params).then(res => {
        if (res.code == 200) {
          this.setData({
            'canvasInfo.mapImgUrl': res.data.handDrawingUrl,
            scenicDetail: res.data
          })
          // resolve(res.data)
          const funs = [this.getImageMap(), this.getImageIcon(), this.getScenicFacilities()]
          Promise.all(funs).then(res => {
            this.initImage()
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
        }
      })
    // })
  },
  // 获取景区设施
  getScenicFacilities(index = 0) {
    const params = {
      scenicId: this.data.scenicId || 1,
      type: this.data.tabList[index].value
    }
    return new Promise((resolve, reject) => {
      getScenicFacilities(params).then(res => {
        if (res.code == 200) {
          this.setData({
            pointList: res.data
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
      // const data = [{name:'测试景点',x:2480,y:1750}]
      // this.setData({
      //         pointList: data
      //       })
      // resolve(data)
    })

  },
  // 景点 map
  toDetails: function () {
    wx.navigateTo({
      url: '../guide/guideMap/index',
    })
  },
  // // 去全景
  // toPanorama(){
  //   // this.data.currentPoint.id,
  //   wx.navigateTo({
  //     url: 'url',
  //   })
  // },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '../index',
    })
  },
  getImageMap() {
    const that = this
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: host+this.data.canvasInfo.mapImgUrl,
        // src: 'http://47.108.86.202:8081/icon/map.jpg',
        success(res) {
          console.log(res)
          that.setData({
            'canvasInfo.imageWidth': res.width,
            'canvasInfo.imageHeight': res.height,
            mapSrc: res.path
          })
          resolve(res);
        },
        fail: err => {
          reject(err)
          console.log('地图image获取失败')
        }
      })
    })
  },
  getImageIcon() {
    const that = this
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: 'http://47.108.86.202:8081/icon/destination-hover.png',
        success(res) {
          that.setData({
            iconUrl: res.path
          })
          resolve(res);
        },
        fail: err => {
          reject(err)
          console.log('marker图标获取失败')
        }
      })
    })
  },
  toLocation() {
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     console.log(res)
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
        wx.openLocation({
          latitude: this.data.currentPoint.lat,
          longitude: this.data.currentPoint.lon,
          scale: 18,
          complete: res=>{
            console.log(res)
          }
        })
    //   },
    //   complete: res=>{
    //     console.log(res)
    //   }
    // })
  },
  drawMap() { //绘制外层的地图
    // 计算出图片的中心点
    const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
    const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
    const imageX = this.data.canvasInfo.imageX
    const imageY = this.data.canvasInfo.imageY
    // console.log(this.data.mapSrc, imageX, imageY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
    const ctx = wx.createCanvasContext('canvas-map');
    ctx.drawImage(this.data.mapSrc, imageX, imageY, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
    ctx.draw(false);
    this.drawMarker()
  },
  // 绘制标点
  drawMarker() {
    const ctx = wx.createCanvasContext('canvas-map');
    const imageX = this.data.canvasInfo.imageX
    const imageY = this.data.canvasInfo.imageY
    const imageWidth = this.data.canvasInfo.imageWidth // 图片原宽度
    const imageHeight = this.data.canvasInfo.imageHeight // 图片原高度
    const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
    const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
    // 有点在原图上的xy坐标  有当前图片在左上角开始裁剪的xy坐标

    // currentX > point.x && currentX < (point.x + point.width) && currentY > point.y && currentY < (point.y + point.height)
    console.log(imageX, imageY)

    // point.x > imageX && point.x < (imageX + canvasWidth) && point.y > imageY && point.y < (imageY + canvasHeight)
    this.data.pointList.forEach(v => {
      // v.newX = imageX + v.x
      // v.newY = imageY + v.y
      console.log(`图片裁剪的x${imageX}`, `图片裁剪的y${imageY}`, `当前点固定x${v.x}`, `当前点固定y${v.y}`)
      ctx.drawImage(this.data.iconUrl, v.x, v.y, 20, 25); //绘制背景图 1所要绘制的图片资源 2、左上角在目标 canvas 上 x 轴的位置 3、左上角在目标 canvas 上 y 轴的位置
    })
    ctx.draw(true); // true是否接着上一次绘制 draw()的回调函数
    // this.drawCanvas()

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
  scale(e) {
    const ctx = wx.createCanvasContext('canvas-map');
    const type = e.target.dataset.id
    console.log(type, type == 1)
    if (type == 1) {
      // ctx.scale(2,2);
      ctx.transform(1, 0.5, -0.5, 1, 30, 10)
    } else {
      ctx.transform(1, 0.5, -0.5, 1, 30, 10)

      // ctx.scale(0.5,0.5);
    }
    ctx.draw(true)
  },
  checkBoundary(currentX, currentY, point) {
    return currentX > (point.newX || point.x) && currentX < ((point.newX || point.x) + point.width) && currentY > (point.newY || point.y) && currentY < ((point.newY || point.y) + point.height)
  },
  checkBoxBoundary(point) { // 判断当前显示区域内是否包含点
    const imageX = this.data.canvasInfo.imageX
    const imageY = this.data.canvasInfo.imageY
    const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
    const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
    // return currentX > point.x && currentX < (point.x + point.width) && currentY > point.y && currentY < (point.y + point.height)
    return point.x > imageX && point.x < (imageX + canvasWidth) && point.y > imageY && point.y < (imageY + canvasHeight)
    // 
  },
  canvasTap(event) {
    const currentX = event.detail.x
    const currentY = event.detail.y - this.data.navBarHeight - event.target.offsetTop // y是针对整个屏幕的定位 所以需要减去navbar和头部的高度
    console.log(event)
    const currentPoint = this.data.pointList.find(point => this.checkBoundary(currentX, currentY, Object.assign(point, {
      width: 20,
      height: 25
    })))
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
    console.log(currentPoint)
  },
  init() {
    wx.showLoading({
      title: '正在加载中...',
    })
    this.setData({
      screenWidth: wx.getSystemInfoSync().screenWidth,
      screenHeight: wx.getSystemInfoSync().screenHeight,
      'canvasInfo.width': wx.getSystemInfoSync().screenWidth
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
    query.select('#page-tab').boundingClientRect(res => {
      this.setData({
        tabHeight: res.height,
        'canvasInfo.height': this.data.screenHeight - (this.data.lowerHeight + res.height + res.top) // 全屏高度减去(底部容器加顶部容器和顶部容器距顶高度)
      })
    }).exec()
    this.getScenicDetail()
  },
  initImage() {
    const imageWidth = this.data.canvasInfo.imageWidth // 裁剪目标的原宽
    const imageHeight = this.data.canvasInfo.imageHeight // 裁剪目标的原高
    const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
    const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
    const imageX = imageWidth / 2 - canvasWidth / 2
    const imageY = imageHeight / 2 - canvasHeight / 2
    this.setData({
      'canvasInfo.imageX': imageX,
      'canvasInfo.imageY': imageY,
    })
    this.data.pointList.map(v => {
      v.x = 0 - imageX + v.x
      v.y = 0 - imageY + v.y
    })
    this.drawMap()
    this.setData({
      domReady: true
    })
    wx.hideLoading()
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
  onShow: function () {
    if(this.data.domReady){
      this.getScenicDetail()
      this.initImage()
    }
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