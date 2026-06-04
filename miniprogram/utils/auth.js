const app = getApp()

function isLoggedIn() {
  return Boolean(app.globalData.isLoggedIn || wx.getStorageSync('yaoaitang_logged_in'))
}

function markLoggedIn() {
  app.globalData.isLoggedIn = true
  wx.setStorageSync('yaoaitang_logged_in', '1')
}

function logout() {
  app.globalData.isLoggedIn = false
  wx.removeStorageSync('yaoaitang_logged_in')
}

function navigateToLogin(redirect) {
  wx.navigateTo({
    url: `/pages/login/login?redirect=${encodeURIComponent(redirect || '/pages/index/index')}`
  })
}

module.exports = {
  isLoggedIn,
  markLoggedIn,
  logout,
  navigateToLogin
}
