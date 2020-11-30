module.exports = class CustomCavnasMap {
  canvasEleInfo = null
  backgroundContext = null
  pointContext = null
  // 定义背景装载图
  canvasImage = null
  // 初始化Lock锁超出最大值停止初始化
  initLock = 0
  maxLockValue = 1000
  // 记录手指按下时的坐标 以及位置
  startingCoordinate = null
  // 旋转时中心点或者缩放时中心点 默认为画布起点
  rotateCenter = {
    x: 0,
    y: 0
  }

  standardConfig = {
    standardX: 1, // canvas画布宽度/图片的宽度
    standardY: 1 // canvas画布高度/图片的高度
  }
  // 背景图的偏移量
  offsetConfig = {
    mapX: 0,
    mapY: 0
  }
  // 捏合缩放倍数或者滚轮缩放倍数
  mapScale = 1
  // 捏合缩放状态
  mapZoom = false
  // 两指距离
  mapDistance = 0
  // 地图层级限制 最大值 默认两倍
  mapMaxZoom = 2
  // 地图层级限制 最小值 默认一倍
  mapMinZoom = 1
  // 惯性的运动距离 带方向的距离单位
  inertialMotion = {
    x: 0,
    y: 0
  }
  // 新增拖拽惯性支持 摩擦系数μs 范围应该在0-1之间
  us = 0.9
  // 惯性定时器
  inertialMotionTimer = null
  // 图片预加载对象
  pictureExtractionObject = {}
  // 点击Canvas后的点位
  clickPoint = {
    x: 0,
    y: 0
  }
  // 点击触发后的状态 0未点击 1点击了 2点击了但是点击错了
  clickStatus = 0
  /**
   * @methods
   * @param {Object<customMapId,_component>} canvasOtions 画布对象
   * @param {Object<style,center,initalZoom>} options 参数管控
   */
  constructor(canvasOtions, options) {
    // super(this)
    console.log('进入构造函数-->')
    // Object.keys(options)
    // 获取设备属性
    this.asyncFetchSystemInfo()
    // 属性继承
    Object.assign(this, canvasOtions, options)
    // 获取Canvas节点元素
    this.wxCreateSelectorQuery().select(`#${canvasOtions.customMapId}`).fields({
      node: true,
      rect: true
    }, res => {
      console.log(res)
      this.canvasEleInfo = res
      this.customCanvas = res.node
      this.dpr = this.systemInfo.pixelRatio
      // 设置大小
      this.customCanvas.orginWidth = parseInt(options.style.width)
      this.customCanvas.orginHeight = parseInt(options.style.height)
      this.customCanvas.width = this.customCanvas.orginWidth*this.dpr
      this.customCanvas.height = this.customCanvas.orginHeight*this.dpr
      // // 获取画布context上下文 2d
      this.ctxCanvas = this.customCanvas.getContext('2d')
    }).exec()
    // 开始初始化自定义地图
    this.initalCanvasChange()
  }
  // 初始化Canvas画布对象
  initalCanvasChange() {
    if (this.customCanvas) {
      this.computedConversionData()
    } else {
      setTimeout(() => {
        console.log('设置延迟100ms进行渲染Canvas画布')
        this.initLock++
        this.initLock < this.maxLockValue && this.initalCanvasChange()
      }, 100)
    }
  }
  // 提供选择节点的公共方法
  wxCreateSelectorQuery() {
    if (this._component) {
      return wx.createSelectorQuery().in(this._component)
    } else {
      return wx.createSelectorQuery()
    }
  }
  // 顺序构建map图库
  createMapBGImage() {
    // 清空页面绘制 2d
    this.ctxCanvas.clearRect(0, 0, this.customCanvas.width*this.dpr, this.customCanvas.height*this.dpr) // 清除左上角横坐标，纵坐标，矩形路径的宽度(当前宽度是乘以屏幕分辩率的)，矩形路径的高度(同宽)
    // 设置旋转中心点
    this.ctxCanvas.translate(this.rotateCenter.x, this.rotateCenter.y)
    // this.posCenter
    // 当绘制结束后 还原旋转中心点
    this.ctxCanvas.translate(-this.rotateCenter.x, -this.rotateCenter.y)
    this.ctxCanvas.save()
    // // 处理图片 缩放 平移控制 设置图片透明度
    // this.ctxCanvas.globalAlpha = this.canvasImage.opacity
    // this.offsetConfig.mapX 画布中的地图偏移量 初始为0
    this.ctxCanvas.drawImage(
      this.canvasImage,
      0, 0,
      this.canvasImage.width, this.canvasImage.height, //被剪切图像的高度
      this.offsetConfig.mapX * this.mapScale * this.dpr, this.offsetConfig.mapY * this.mapScale * this.dpr, //在画布上放置图像的 x 、y坐标位置。
      this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr, this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) //要使用的图像的宽度、高度
      console.log('数据',this)
    // 恢复之前保存的绘图上下文
    this.ctxCanvas.restore()
    // 清除旋转角度
    this.mapRotate = 0
    // 保存绘图上下文
    this.ctxCanvas.save()
    // 计算点
    this.drawMarker(this.markers)
  }
  // 绘制Marker景点 传入参数MarkerList对象
  drawMarker(infoList = []) {
    if (infoList instanceof Array && infoList.length > 0) {
      console.log(infoList)
      // 计算之前 先得到图标
      if (Object.keys(this.pictureExtractionObject).length > 0) {
        // 开始绘制
        // 使用定位解决方案 避免canvas数据量过大造成卡顿 [定位方案更卡。。。]
        this.handlerMarkerList = infoList
        // 创建ICON图标
        this.handlerMarkerList.map(item => {
          this.ctxCanvas.beginPath()
          // this.ctxCanvas.arc( // 创建一条弧线
          // 原

          //   (item.x + this.offsetConfig.mapX) * this.mapScale * this.dpr, (item.y + this.offsetConfig.mapY) * this.mapScale * this.dpr, 
          //   item.width/2, 0, 2 * Math.PI)
          
          this.ctxCanvas.arc( // 创建一条弧线
            (item.x*this.standardConfig.standardX + this.offsetConfig.mapX) * this.mapScale * this.dpr, (item.y*this.standardConfig.standardY + this.offsetConfig.mapY) * this.mapScale * this.dpr, 
            item.width/2 * this.mapScale, 0, 2 * Math.PI)
          // this.ctxCanvas.globalAlpha = 1
          this.ctxCanvas.strokeStyle = 'rgba(255,255,255, 0)'
          
          this.ctxCanvas.fillStyle = 'rgba(255,255,255, 0)'
          // this.ctxCanvas.fillStyle = 'pink'
          this.ctxCanvas.fill()
          this.ctxCanvas.stroke()
          this.ctxCanvas.restore()
          const w = parseInt(item.width)
          const h = parseInt(item.height)
          // item.currentX = (item.x*this.standardConfig.standardX * this.dpr - w / 2 + this.offsetConfig.mapX * this.dpr) * this.mapScale
          // item.currentY = (item.x*this.standardConfig.standardX * this.dpr - w / 2 + this.offsetConfig.mapX * this.dpr) * this.mapScale
          this.ctxCanvas.drawImage(
            this.pictureExtractionObject[item.icon],
            (item.x*this.standardConfig.standardX * this.dpr - w / 2 + this.offsetConfig.mapX * this.dpr) * this.mapScale, // imageResource的左上角在目标 canvas 上 x 轴的位置
            (item.y*this.standardConfig.standardY * this.dpr - h / 3 * 2 + this.offsetConfig.mapY * this.dpr) * this.mapScale,
            w * this.mapScale, h * this.mapScale)
          this.ctxCanvas.restore() // 恢复之前的绘图
          // 原
          // this.ctxCanvas.rect(item.canvasX - w / 2, item.canvasY - h / 3 * 2, w * this.mapScale, h)
          // this.ctxCanvas.rect(item.x*this.standardConfig.standardX + this.offsetConfig.mapX * this.dpr - w / 2, item.y*this.standardConfig.standardX + this.offsetConfig.mapY * this.dpr - h / 3 * 2, w * this.mapScale, h * this.mapScale)
          const clickPointX = this.clickPoint.x * this.mapScale * this.dpr + this.offsetConfig.mapX * this.dpr
          const clickPointY = this.clickPoint.y * this.mapScale * this.dpr + this.offsetConfig.mapY * this.dpr
          console.log(clickPointX,clickPointY,this.clickPoint.x,this.clickPoint.y)
          if (this.clickStatus !== 0) {
            if (this.ctxCanvas.isPointInPath(clickPointX, clickPointY)) {
              this.cilckPointChange(item)
              this.clickStatus = 1
              console.log('成功触发画布点击回调')
            } else {
              // console.log('点位错误')
            }
          }
        })
        if (this.clickStatus === 2) {
          // 触发未点中的回调
          this.cilckPointChange()
        }
        // console.log(this.handlerMarkerList)
        this.markerCallBack(this.handlerMarkerList)
      } else {
        setTimeout(() => {
          this.drawMarker(infoList)
        }, 100)
      }
    }
    this.initedMap()
  }
  // 取中心点方法
  Vector(vector1, vector2) {
    this.x = vector2.x - vector1.x
    this.y = vector2.y - vector1.y
  }
  // 计算点乘 => 公式：a↑ * b↑ = |a↑||b↑|cosθ
  // 其中：a↑ * b↑ = x1*x2 + y1*y2
  // 模计算：|a↑| = Math.sqrt(x1 ** 2 + y1 ** 2)
  calculateVM(vector1, vector2) {
    return (vector1.x * vector2.x + vector1.y * vector2.y) / (Math.sqrt(vector1.x ** 2 + vector1.y ** 2) * Math.sqrt(vector2.x ** 2 + vector2.y ** 2))
  }
  // 计算叉乘
  calculateVC(vector1, vector2) {
    return (vector1.x * vector2.y - vector2.x * vector1.y) > 0 ? 1 : -1
  }
  // 获取系统信息
  asyncFetchSystemInfo() {
    this.systemInfo = wx.getSystemInfoSync()
  }
  // rpx转px
  rpxToPx(v) {
    return v / 750 * this.systemInfo.windowWidth
  }
  // 初始化需要计算的所有数据
  computedConversionData() {
    // 图片加载处理
    if (this.image) {
      const mapImage = this.customCanvas.createImage()
      mapImage.src = this.image
      mapImage.onload = (e) => {
        console.log('已成功加载手绘图片---->')
        // 设置附件值
        // console.log(img)
        this.canvasImage = mapImage
       
        if (this.style instanceof Object) {
          const viewWidth = this.style.width
          // 按原图的比例 宽度不变，高度等比缩放
          const viewHeight = this.canvasImage.height * viewWidth / this.canvasImage.width
          // 画布限制配置
          this.canvasLimitConfig = {
            viewWidth,
            viewHeight
          }
          this.standardConfig = {
            standardX: viewWidth/mapImage.width,
            standardY: viewHeight/mapImage.height
          }
        }
        this.createMapBGImage()
        // console.log('设置图片完成')
        mapImage.onerror = (e) => {
          console.log(e)
          mapImage.src = this.image
        }
        
      }
    }

    // ICON预加载
    this.pictureExtraction(this.markers, 'icon').map(item => {
      const image = this.customCanvas.createImage()
      console.log(this.markers,item)
      image.src = item
      image.onload = (e) => {
        this.pictureExtractionObject[item] = image
      }
      image.onerror = (e) => {
        image.src = item
      }
    })
  }
  /**
   * 其他辅助类函数
   * @method deepClone 深度克隆 
   * @param {Any} Any 任意类型
   * 
   * 对一个object进行深度拷贝
   *
   * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
   * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
   *
   * @param  {Object} ObjectSource 需要进行拷贝的对象
   */
  deepClone(ObjectSource) {
    if (Array.isArray(ObjectSource)) {
      return Object.assign([], ObjectSource)
    }
    return Object.assign({}, ObjectSource)
  }
  /**
   * 
   * @param {Array<Object>} imageArray 传入数组遍历对象
   * @param {String} name 需要指定去重的数据名称
   * @return {Array} 返回的是去重后的Image数组
   */
  pictureExtraction(imageArray, name) {
    let cloneImageObject = {}
    imageArray.map(item => {
      cloneImageObject[item[name]] = item[name]
    })
    return Object.keys(cloneImageObject)
  }
  /**
   * @touch 事件处理
   * @param {Event} e Event对象
   */
  touchStartToCanvas(e) {
    // 操作开始时 清空处理
    this.inertialMotionTimer && clearInterval(this.inertialMotionTimer)
    // 多指处理
    if (e.touches.length > 1) {
      // 属于多指操作类型
      console.log('当前属于多指操作')
      // console.log(e)
      // 计算并存储数据
      const xMove = e.touches[1].x - e.touches[0].x
      const yMove = e.touches[1].y - e.touches[0].y
      // 计算两指距离
      this.mapDistance = Math.sqrt(xMove ** 2 + yMove ** 2)
      this.thisCoordinate = e.touches
      this.startingCoordinate = e.touches
      this.mapZoom = true
    } else {
      this.startingCoordinate = e.touches[0]
      // 初始化惯性速度
      this.inertialMotion = {
        x: 0,
        y: 0
      }
    }
  }
  touchMoveToCanvas(e) {
    if (e.touches.length > 1) {
      // 属于多指操作类型
      console.log('当前属于多指操作')
      this.mapZoom = true
      // 计算旋转
      const preCoordinate = this.deepClone(this.startingCoordinate)
      this.startingCoordinate = e.touches
      const vector1 = new this.Vector(preCoordinate[0], preCoordinate[1])
      const vector2 = new this.Vector(this.startingCoordinate[0], this.startingCoordinate[1])
      const resultCosVal = this.calculateVM(vector1, vector2)
      // 弧度换算成角度
      const angle = Math.acos(resultCosVal) * 180 / Math.PI

      const direction = this.calculateVC(vector1, vector2)
      // 得到最后的旋转度数
      const _allDeg = direction * angle

      // 双指缩放
      const xMove = e.touches[1].x - e.touches[0].x
      const yMove = e.touches[1].y - e.touches[0].y

      // 取中心点
      const posCenter = this.rotateCenter = {
        x: (e.touches[0].x + e.touches[1].x) / 2,
        y: (e.touches[0].y + e.touches[1].y) / 2
      }
      console.log('中心点',this.posCenter)
      const distance = Math.sqrt(xMove ** 2 + yMove ** 2)
      const distanceDiff = distance - this.mapDistance
      const scalingIndex = 0.005 * distanceDiff
      const newScale = this.mapScale + scalingIndex

      let mapX = this.offsetConfig.mapX
      let mapY = this.offsetConfig.mapY

      const scaleSizeX = scalingIndex * this.canvasLimitConfig.viewWidth * this.mapScale
      const scaleSizeY = scalingIndex * this.canvasLimitConfig.viewHeight * this.mapScale

      mapX -= scaleSizeX / 2
      mapY -= scaleSizeY / 2
      console.log('多指',scaleSizeX,scaleSizeY)
      if (Math.abs(_allDeg) > 1) {
        this.mapRotate = this.mapRotate + _allDeg
        // 重绘
        this.createMapBGImage()
      }
      // 限制范围 不存在mapX mapY时出现计算错误时退出当前缩放
      if (newScale < this.mapMinZoom || newScale > this.mapMaxZoom || isNaN(mapX) || isNaN(mapY)) {
        return
      }
      this.mapDistance = distance
      this.mapScale = newScale
      this.offsetConfig.mapX = mapX
      this.offsetConfig.mapY = mapY
      // 重绘
      this.createMapBGImage()
    } else {
      // slidingDistanceX
      // const offsetX = 
      // 不处理在双指或者多指情况下的剩余操作
      if (this.mapZoom) {
        return
      }
      // 判断是否为数组
      if (this.startingCoordinate instanceof Array) {
        this.startingCoordinate = this.startingCoordinate[0]
      }
      const thisCoordinate = e.touches[0]
      const slidingDistanceX = thisCoordinate.x - this.startingCoordinate.x
      const slidingDistanceY = thisCoordinate.y - this.startingCoordinate.y

      this.offsetConfig.mapX += slidingDistanceX
      this.offsetConfig.mapY += slidingDistanceY
      // 处理速度
      this.inertialMotion = {
        x: slidingDistanceX || 0,
        y: slidingDistanceY || 0
      }
      // console.log(this.inertialMotion)
      console.log('单指')
      // console.log(this.inertialMotion.x, this.inertialMotion.y)
      // 处理边界
      this.touchMoveLimitBounds()

      // 重新设置初始点
      this.startingCoordinate = thisCoordinate
      // 重绘
      this.createMapBGImage()
    }
    console.log(this)
  }
  touchEndToCanvas(e) {
    // console.log(e)
    if (e.touches.length === 0) {
      // 处理惯性
      !this.mapZoom && this.inertialMotionToCanvas(this.inertialMotion.x, this.inertialMotion.y)
      this.mapZoom = false
      // 如果初始大小 则复位
      if (this.mapScale === 1) {}
    } else {
      // console.log(e)
      this.mapZoom = false
    }
  }
  touchMoveLimitBounds() {
    // 处理边界问题
    // X 轴
    if ((this.offsetConfig.mapX + this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr) > this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr) {
      this.offsetConfig.mapX = this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr - this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr
    } else if ((this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr + this.offsetConfig.mapX * this.dpr) < this.customCanvas.width) {
      this.offsetConfig.mapX = (this.customCanvas.width - this.canvasLimitConfig.viewWidth * this.mapScale * this.dpr) /
				this.dpr
    }
    // Y 轴
    if (this.customCanvas.height > this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) {
      if ((this.customCanvas.height - this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) < this.offsetConfig.mapY * this.dpr) {
        this.offsetConfig.mapY = (this.customCanvas.height - this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) / this.dpr
      } else if (this.offsetConfig.mapY * this.dpr < 0) {
        this.offsetConfig.mapY = 0
      }
    } else {
      if ((this.customCanvas.height - this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) > this.offsetConfig.mapY * this.dpr) {
        this.offsetConfig.mapY = (this.customCanvas.height - this.canvasLimitConfig.viewHeight * this.mapScale * this.dpr) / this.dpr
      } else if (this.offsetConfig.mapY * this.dpr > 0) {
        this.offsetConfig.mapY = 0
      }
    }
    console.log('x', this.offsetConfig.mapX,'y', this.offsetConfig.mapY)
  }
  /**
   * 处理拖动惯性运动
   * @param {Number} speedX X轴的速度
   * @param {Number} speedY Y轴的速度
   * @handler Canvas 处理函数
   */
  inertialMotionToCanvas(speedX, speedY) {
    console.log('处理拖动惯性运动')
    if (isNaN(speedX) || isNaN(speedY)) return
    this.inertialMotionTimer && clearInterval(this.inertialMotionTimer)
    this.inertialMotionTimer = setInterval(() => {
      speedX *= this.us
      speedY *= this.us
      this.offsetConfig.mapX += speedX
      this.offsetConfig.mapY += speedY
      // 处理边界
      this.touchMoveLimitBounds()
      if (Math.abs(speedX) < 1) speedX = 0
      if (Math.abs(speedY) < 1) speedY = 0
      if (speedX == 0 && speedY == 0) {
        this.inertialMotion = {
          x: 0,
          y: 0
        }
        clearInterval(this.inertialMotionTimer)
      }
      // 重绘
      this.createMapBGImage()
    }, 30)
  }

  /**
   * @click 事件处理
   * @param {Event} e Event对象
   */
  clickToCanvas(e) {
    // 假设没点中
    this.clickStatus = 2
    // this.clickPoint = {
    //   x: e.target.x - e.target.offsetLeft,
    //   y: e.target.y - e.target.offsetTop
    // }
    this.clickPoint = {
      x: e.target.x - this.canvasEleInfo.left - this.offsetConfig.mapX,
      y: e.target.y - this.canvasEleInfo.top - this.offsetConfig.mapY
    }
    
    // }
    this.createMapBGImage()
  }
}