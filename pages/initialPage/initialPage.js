// pages/welcomePage/welcomePage.js
import WeCropper from '../we-cropper/we-cropper.js'

const app = getApp();
const device = wx.getSystemInfoSync() // get device info
const width = device.windowWidth
const height = width

Page({

  /**
  * Initial data
  */
  data: {
    picChoosed: false,
    bgPic: null,
    cropperOpt: {
      id: 'cropper',
      width, 
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) /2,   // Starting point of the cutting box
        y: (width - 300)/ 2,
        width: 300,            // Size of the cutting box
        height: 300
      }
    }
  },



  /**
   * 生命周期函数--监听页面加载
   * Life Circle - audit page on load
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data
    
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log('wecropper is ready!')
      })
      .on('beforeImageLoad', (ctx) => {
        console.log('before picture loaded')
        console.log('current canvas context: ${ctx}')
        wx.showToast({
          title: 'Uploading',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log('picture loaded')
        console.log('current canvas context: ${ctx}')
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  },





  /**
   * Determinate whether the picture is choosed or not
   */
  assignPicChoosed(){
    if (this.data.bgPic) {
      this.setData({
        picChoosed: true
      })
    } else {
      this.setData({
        picChoosed: false
      })
    }
  },

  /**
   * 
   * Cropper touch handler
   */
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },


  /**
   * 
   * Image uploader
   */
  imageUploader(from) {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: [from.target.dataset.way],
      success: (res) => {
        this.setData({
          bgPic: res.tempFilePaths[0]
        });
        self.wecropper.pushOrign(this.data.bgPic);
        this.assignPicChoosed();
      },
      fail: (res) => {
        this.assignPicChoosed();
      },
      complete: (res) => {
        this.assignPicChoosed();
      },
    })
  },


  /**
   * 
   * Get the cropped image
   */
  getCropperImage() {
    var src = this.data.bgPic;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        console.log("src" + src)
        this.setData({
          bgPic: src
        });
      } else {
        console.log('Unable to get the image path')
      }
    })

  },


  /**
   * 
   * Crop the image
   * Write image data to global
   * 
   */
  nextPage(){
    this.getCropperImage();
    app.globalData.bgPic = this.data.bgPic;
    console.log("before navigate: " + this.data.bgPic);
    wx.navigateTo({
      url: '../wearHatPage/wearHatPage',
    })
    console.log("after navigate: " + this.data.bgPic);
  }
})