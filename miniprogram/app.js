App({
  onLaunch() {
    this.globalData.isLoggedIn = Boolean(wx.getStorageSync('yaoaitang_logged_in'))
  },

  globalData: {
    apiBase: 'http://localhost:8080',
    isLoggedIn: false
  }
})
