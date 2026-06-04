const { getProducts } = require('../../utils/api')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

Page({
  data: {
    loading: true,
    keyword: '',
    products: [],
    error: ''
  },

  onLoad(options) {
    this.setData({ keyword: decodeURIComponent(options.keyword || '') })
    this.loadProducts()
  },

  async onPullDownRefresh() {
    await this.loadProducts()
    wx.stopPullDownRefresh()
  },

  async loadProducts() {
    this.setData({ loading: true, error: '' })
    try {
      const products = await getProducts(this.data.keyword)
      this.setData({
        loading: false,
        products: products.map((item) => ({ ...item, displayPrice: formatPrice(item.price) }))
      })
    } catch (error) {
      this.setData({ loading: false, error: '商品加载失败，请稍后重试' })
    }
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  }
})
