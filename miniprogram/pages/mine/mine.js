const { isLoggedIn, logout, navigateToLogin } = require('../../utils/auth')

Page({
  data: {
    tabs: [
      { key: 'home', label: '首页', iconUrl: '/images/tab-home.png', active: false },
      { key: 'category', label: '分类', iconUrl: '/images/tab-category.png', active: false },
      { key: 'cart', label: '购物车', iconUrl: '/images/tab-cart.png', active: false },
      { key: 'mine', label: '我的', iconUrl: '/images/tab-mine-active.png', active: true }
    ],
    stats: [
      { label: '待付款', value: 0 },
      { label: '待发货', value: 0 },
      { label: '优惠券', value: 2 },
      { label: '积分', value: 120 }
    ],
    cells: [
      { key: 'orders', label: '我的订单', subtitle: '订单、核销券和售后进度' },
      { key: 'distribution', label: '分销中心', subtitle: '佣金、推广码和下线管理' },
      { key: 'service', label: '门店服务', subtitle: '到店体验、灸疗预约和门店导航' },
      { key: 'profile', label: '个人资料', subtitle: '头像昵称授权将在正式版接入' }
    ]
  },

  onShow() {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/mine/mine')
    }
  },

  onCellTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'distribution') {
      wx.navigateTo({ url: '/pages/distribution/distribution' })
      return
    }
    if (key === 'service') {
      wx.navigateTo({ url: '/pages/experience/experience' })
      return
    }
    wx.navigateTo({
      url: `/pages/placeholder/placeholder?title=${encodeURIComponent(event.currentTarget.dataset.label)}&subtitle=${encodeURIComponent('该模块将在后续版本接入真实业务数据')}`
    })
  },

  onLogout() {
    logout()
    wx.showToast({ title: '已退出登录', icon: 'success' })
    setTimeout(() => wx.redirectTo({ url: '/pages/index/index' }), 350)
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'mine') return
    if (key === 'home') {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }
    if (key === 'cart' && !isLoggedIn()) {
      navigateToLogin('/pages/cart/cart')
      return
    }
    wx.redirectTo({ url: `/pages/${key}/${key}` })
  }
})
