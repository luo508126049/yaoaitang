Page({
  data: {
    title: '功能建设中',
    subtitle: '该模块将在后续版本接入完整业务能力'
  },

  onLoad(options) {
    this.setData({
      title: decodeURIComponent(options.title || '功能建设中'),
      subtitle: decodeURIComponent(options.subtitle || '该模块将在后续版本接入完整业务能力')
    })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onHome() {
    wx.redirectTo({ url: '/pages/index/index' })
  }
})
