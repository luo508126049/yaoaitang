const { isLoggedIn, navigateToLogin } = require('../../utils/auth')
const { getExperience } = require('../../utils/api')

Page({
  data: {
    coupons: [
      { title: '先灸后玉体验券', desc: '到店体验艾灸后选购玉石理疗套盒', value: '¥68' },
      { title: '节气养生调理券', desc: '适合初次到店用户，含基础问询与体验', value: '¥39' }
    ],
    steps: ['领取体验券', '预约到店时间', '核销体验', '选择适合套盒']
  },

  onLoad() {
    this.loadExperience()
  },

  async loadExperience() {
    try {
      const data = await getExperience()
      this.setData({
        coupons: (data.coupons || []).map((item) => ({
          title: item.title,
          desc: item.subtitle,
          value: item.price ? `¥${Number(item.price).toFixed(0)}` : item.badge || '可领取'
        })),
        steps: (data.steps || []).map((item) => item.title)
      })
    } catch (error) {
      // Keep local fallback content.
    }
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onClaim(event) {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/experience/experience')
      return
    }
    wx.showModal({
      title: event.currentTarget.dataset.title,
      content: '体验券已加入会员卡包演示区。正式版将接入核销码和门店预约。',
      showCancel: false
    })
  },

  onReserve() {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/experience/experience')
      return
    }
    wx.showModal({
      title: '预约门店',
      content: '正式版将接入门店列表、时间段选择和地图导航。',
      showCancel: false
    })
  }
})
