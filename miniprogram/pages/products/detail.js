const { getProduct } = require('../../utils/api')
const { navigateToLogin, isLoggedIn } = require('../../utils/auth')
const { addToCart } = require('../../utils/cart')

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

Page({
  data: {
    loading: true,
    product: null,
    error: ''
  },

  onLoad(options) {
    this.loadProduct(options.id)
  },

  async loadProduct(id) {
    this.setData({ loading: true, error: '' })
    const product = await getProduct(id)
    if (!product) {
      this.setData({ loading: false, error: '商品不存在或已下架' })
      return
    }
    this.setData({
      loading: false,
      product: { ...product, displayPrice: formatPrice(product.price), displayMarketPrice: formatPrice(product.marketPrice) }
    })
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onBuy() {
    if (!isLoggedIn()) {
      navigateToLogin(`/pages/products/detail?id=${this.data.product.id}`)
      return
    }
    wx.navigateTo({ url: '/pages/placeholder/placeholder?title=确认订单&subtitle=订单结算功能将在后续版本接入' })
  },

  onCart() {
    if (!isLoggedIn()) {
      navigateToLogin(`/pages/products/detail?id=${this.data.product.id}`)
      return
    }
    addToCart(this.data.product, 1)
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})
