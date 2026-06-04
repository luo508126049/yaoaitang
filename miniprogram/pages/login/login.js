const { markLoggedIn } = require('../../utils/auth')

Page({
  data: {
    redirect: '/pages/index/index'
  },

  onLoad(options) {
    this.setData({ redirect: decodeURIComponent(options.redirect || '/pages/index/index') })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onLogin() {
    markLoggedIn()
    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      wx.redirectTo({
        url: this.data.redirect,
        fail: () => wx.redirectTo({ url: '/pages/index/index' })
      })
    }, 450)
  }
})
