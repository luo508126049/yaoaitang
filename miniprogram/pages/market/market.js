const { getMarketProducts } = require('../../utils/api')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

Page({
  data: {
    loading: true,
    products: [],
    filters: ['非遗礼盒', '古法艾条', '养生套盒'],
    activeFilter: '非遗礼盒'
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
    const products = (await getMarketProducts('', this.data.activeFilter)).map((item, index) => ({
      ...item,
      imageUrl: item.imageUrl || (index % 2 === 0 ? '/images/product-gift-photo.png' : '/images/product-single-photo.png'),
      displayPrice: formatPrice(item.price),
      badge: index % 2 === 0 ? '非遗推荐' : '门店同款'
    }))
    this.setData({ loading: false, products })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onFilterTap(event) {
    this.setData({ activeFilter: event.currentTarget.dataset.value })
    this.loadProducts()
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  }
})
