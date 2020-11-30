import CustomCavnasMap from './map'
let CustomMapInital = null

var app = getApp();
var host = app.globalData.host
Component({
  properties: {
    navBarHeight: {
      type: Number,
      value: 64
    },
    options: {
      type: Object,
      value: {
        // image: 'http://47.108.86.202:8081/icon/map.jpg',
        // style: {
        //   width: 375,
        //   height: 300,
        // },
        // // 自定义Marker
        // markers: [{
        //   name: '点1',
        //   icon: 'http://47.108.86.202:8081/icon/mudidi1.png',
        //   x: 100,
        //   y: 200,
        //   width: 50,
        //   height: 50
        // }]
      }
    },
    // canvasId
    customMapId: {
      type: String,
      value: 'customMap'
    }
  },
  data: {
    host: host,
    // initalZoom: null,
    // CustomMapInital: null, // 不要定义到data中 容易引发内存互换
    handlerMarkerList: [],
    checkPointMarker: null
  },
  onUnload() {
    CustomMapInital = null
  },
  observers:{
    options(val){
      if (val instanceof Object && Object.keys(val).length > 0) {
        this.initalCanvasMap()
      }
    }
  },
  methods: {
    //语音播报
    toVoice(){
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src = 'https://lzzhly.wglj.liuzhou.gov.cn/upload/2020-10-18/1603000944172.mp3'
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    },
    // 去全景
    toPanorama(){
      console.log('去全景')
      // this.data.currentPoint.id,
      // wx.navigateTo({
      //   url: 'url',
      // })
    },
    toLocation() {
      wx.openLocation({
        latitude: this.data.checkPointMarker.lat,
        longitude: this.data.checkPointMarker.lon,
        scale: 18,
        complete: res => {
          console.log(res)
        }
      })
    },
    initalCanvasMap() {
      // console
      CustomMapInital = new CustomCavnasMap({
        customMapId: this.data.customMapId,
        _component: this
      }, Object.assign({}, this.data.options, {
        markerCallBack: (list) => {
          console.log(list)
          // this.setData({
          //   handlerMarkerList: list
          // })
        },
        cilckPointChange: (info) => {
          if (info) {
            console.log(info)
            console.log('得到点击成功后的触发')
            this.pointChange(info)
          } else {
            console.log('得到点击空白的回调')
          }
        },
        initedMap:() => {
          this.triggerEvent('initedMap')
        }
      }))
    },
    fetchCustomBoxSize() {
      wx.getImageInfo({
        src: '',
        success: (rect) => {
          console.log(rect.fillPath[0])
        }
      })
    },
    /**
     * @Function
     * @public 公共类方法
     * @return Object
     */
    // 设置缩放比例
    setZoom(zoom, callback) {
      // 最低限制为初始化的缩放比例
      if (zoom > this.data.options.initalZoom) {
        // 逻辑处理
        CustomMapInital.setZoom(this.data.initalZoom, callback)
      } else {
        CustomMapInital.setZoom(zoom, callback)
      }
    },
    // 获取缩放比例
    getZoom(callback) {
      if (callback) {
        callback && callback(CustomMapInital.getZoom())
      } else {
        return CustomMapInital.getZoom()
      }
    },
    /**
     * 
     * @touch 事件向this.CustomMapInital触发
     */
    touchStartToCanvas(e) {
      CustomMapInital.touchStartToCanvas(e)
    },
    touchMoveToCanvas(e) {
      CustomMapInital.touchMoveToCanvas(e)
    },
    touchEndToCanvas(e) {
      CustomMapInital.touchEndToCanvas(e)
    },
    pointChange(info) {
      this.setData({
        checkPointMarker: info
      })
    },
    /**
     * @click 事件向下触发
     */
    clickToCanvas(e) {
      console.log(wx.getSystemInfoSync())
      console.log(e)
      e.target.x = e.detail.x
      e.target.y = e.detail.y
      // e.target.offsetTop = e.target.offsetTop + this.data.navBarHeight // 需要加上导航栏高度
      // e.target.offsetTop = e.target.offsetTop + this.data.navBarHeight // 需要加上导航栏高度

      CustomMapInital.clickToCanvas(e)
      // 点击其他地方进行清空WindowInfo窗体
      this.setData({
        checkPointMarker: null
      })
    }
  },
});