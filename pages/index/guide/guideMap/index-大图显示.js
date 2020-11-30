// pages/index/guide/guideMap/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInformation: false,
    iconUrl: '',
    mapSrc: '',
    navBarHeight: 0,
    tabHeight: 0,
    screenHeight: 0,
    canvasInfo: {
      width: 0,
      height: 0,
      imageWidth: 0, // 手绘地图图片的原宽度
      imageHeight: 0,
      scale: 1,
    },
    imgUrl: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    pointList: [{
        x: 160,
        y: 70,
        name: '白莲洞风景名胜区1'
      },
      // {
      //   x: 160,
      //   y: 150,
      //   name: '白莲洞风景名胜区2'
      // },
      // {
      //   x: 200,
      //   y: 200,
      //   name: '白莲洞风景名胜区3'
      // },
      // {
      //   x: 230,
      //   y: 60,
      //   name: '白莲洞风景名胜区4'
      // },
      // {
      //   x: 230,
      //   y: 150,
      //   name: '点5'
      // }
    ],
    currentPoint: {},
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    }
  },
  // 景点 map
  toDetails: function () {
    wx.navigateTo({
      url: '../guide/guideMap/index',
    })
  },
  // 返回首页
  onClickLeft() {
    wx.switchTab({
      url: '../index',
    })
  },
  getImageMap() {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: 'http://47.108.86.202:8081/icon/map.jpeg',
        success(res) {
          console.log(res)
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
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: 'http://47.108.86.202:8081/icon/destination-hover.png',
        success(res) {
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
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
    })
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
      console.log(this.checkBoxBoundary(v))
      const newX = imageX + v.x
      const newY = imageY + v.y
      console.log(`图片裁剪的x${imageX}`,`图片裁剪的y${imageY}`,`当前点固定x${newX}`,`当前点固定y${newY}`)
      ctx.drawImage(this.data.iconUrl, newX, newY, 20, 25); //绘制背景图 1所要绘制的图片资源 2、左上角在目标 canvas 上 x 轴的位置 3、左上角在目标 canvas 上 y 轴的位置
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
  // checkBoundary (x, y) {				// 判断边界方法 this 代表当前点击的形状
  //   const canvasW = this.data.canvasInfo.width
  //   const canvasH = 300
  //   return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h) // 原
  // },
  // canvasTap(event) {
  //   const canvasX = event.detail.x
  //   const canvasY = event.detail.y - this.data.navBarHeight - event.target.offsetTop // y是针对整个屏幕的定位 所以需要减去navbar和头部的高度
  //   this.data.pointList.forEach(point=>{
  //     console.log(canvasX,canvasY,point.x,point.y)
  //     console.log(point.name,canvasX > point.x , canvasX < (point.x + 20) , canvasY > point.y , canvasY < (point.y + 25))
  //     // 如果当前点击位置的x坐标大于点的x坐标且小于点的x坐标加上他本身的宽度  且点击位置的y坐标大于点的y坐标且点击位置的y坐标小于点的y坐标加上他本身的高度
  //     console.log(point.name,canvasX > point.x && canvasX < (point.x + 20) && canvasY > point.y && canvasY < (point.y + 25))
  //     // return canvasX > point.x && canvasX < (point.x + canvasW) && canvasY > point.y && canvasY < (point.y + canvasH)
  //   })
  //   console.log(event)
  // },
  checkBoundary(currentX, currentY, point) {
    return currentX > point.x && currentX < (point.x + point.width) && currentY > point.y && currentY < (point.y + point.height)
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
  initImage() {
    const funs = [this.getImageMap(), this.getImageIcon()]
    Promise.all(funs).then(res => {
      const imageWidth = res[0].width // 裁剪目标的原宽
      const imageHeight = res[0].height // 裁剪目标的原高
      const canvasWidth = this.data.canvasInfo.width // 裁剪目标的宽度
      const canvasHeight = this.data.canvasInfo.height // 裁剪目标的高度
      const imageX = imageWidth / 2 - canvasWidth / 2
      const imageY = imageHeight / 2 - canvasHeight / 2
      this.setData({
        'canvasInfo.imageWidth': imageWidth,
        'canvasInfo.imageHeight': imageHeight,
        'canvasInfo.imageX': imageX,
        'canvasInfo.imageY': imageY,
        mapSrc: res[0].path,
        iconUrl: res[1].path
      })
      this.drawMap()
    })
  },
  init() {
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
    this.initImage()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if(!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)){
      return
    }
    // 单手指缩放开始，也不做任何处理 
    if (event.touches.length == 1) {

      console.log('手指触摸动作开始', event)
      this.setData({
        showInformation: false,
        touchStartInfo: {
          x: event.changedTouches[0].x,
          y: event.changedTouches[0].y
        }
      })
      return
    }
    // canvasInfo.imageX
    console.log('双手指触发开始')
    // 注意touchstartCallback 真正代码的开始 
    // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug 
    // 当两根手指放上去的时候，就将distance 初始化。 
    let xMove = event.touches[1].clientX - event.touches[0].x;
    let yMove = event.touches[1].clientY - event.touches[0].y;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'touch.distance': distance,
    })
  },
  touchMoveHandle(event) {
    if(!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)){
      return
    }
    const touch = this.data.touch
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
      if(newImageX > 0){
        if(newImageX > maxImageX) {
          newImageX = maxImageX
        }
      }else {
        newImageX = 0
      }
      if(newImageY > 0){
        if(newImageY > maxImageY) {
          newImageY = maxImageY
        }
      }else {
        newImageY = 0
      }
      console.log(`newImageX${newImageX}`,`newImageY${newImageY}`)
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
      return
    }
    // console.log('双手指运动开始')
    let xMove = event.touches[1].clientX - event.touches[0].x;
    let yMove = event.touches[1].clientY - event.touches[0].y;
    // 新的 ditance 
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff

    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
    if (newScale >= 2) {
      newScale = 2
    }
    if (newScale <= 0.6) {
      newScale = 0.6
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的 
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight,
      'touch.diff': distanceDiff
    })
  },
  touchendHandle(event) {
    if(!(this.data.canvasInfo.imageWidth && this.data.canvasInfo.imageHeight)){
      return
    }
    // this.setData({
    //   showInformation: false,
    //   touchStartInfo: {
    //     x: event.changedTouches[0].x,
    //     y: event.changedTouches[0].y
    //   }
    // })
    console.log('触摸结束', event)
  }
})