const { getGroupActivities, getProducts } = require('../../utils/api')
const { isLoggedIn, navigateToLogin } = require('../../utils/auth')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

Page({
  data: {
    loading: true,
    products: []
  },

  onLoad() {
    this.loadProducts()
  },

  async onPullDownRefresh() {
    await this.loadProducts()
    wx.stopPullDownRefresh()
  },

  async loadProducts() {
    this.setData({ loading: true })
    let products = []
    try {
      products = (await getGroupActivities()).map((item) => ({
        id: item.linkValue,
        name: item.title,
        subtitle: item.subtitle,
        imageUrl: item.imageUrl || '/images/product-gift-photo.png',
        groupPrice: formatPrice(item.price),
        displayPrice: formatPrice(item.marketPrice),
        memberCount: Number(item.metadata) || 2
      }))
    } catch (error) {
      products = (await getProducts()).map((item, index) => ({
        ...item,
        imageUrl: item.imageUrl || (index % 2 === 0 ? '/images/product-gift-photo.png' : '/images/product-single-photo.png'),
        groupPrice: formatPrice((Number(item.price) || 0) * 0.86),
        displayPrice: formatPrice(item.price),
        memberCount: index % 2 === 0 ? 3 : 2
      }))
    }
    this.setData({ loading: false, products })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  },

  onJoin(event) {
    if (!isLoggedIn()) {
      navigateToLogin('/pages/group/group')
      return
    }
    wx.showModal({
      title: '参与拼团',
      content: '正式版将接入拼团开团、参团、倒计时和成团规则。',
      showCancel: false
    })
  }
})
