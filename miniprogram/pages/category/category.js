const { getProducts } = require('../../utils/api')
const { isLoggedIn, navigateToLogin } = require('../../utils/auth')

const categories = [
  { key: 'all', label: '全部' },
  { key: 'moxa', label: '艾制品', words: ['艾', '古法'] },
  { key: 'set', label: '理疗套盒', words: ['套', '礼盒'] },
  { key: 'gift', label: '非遗礼盒', words: ['礼', '非遗'] },
  { key: 'tool', label: '器具工具', words: ['器', '工具'] }
]

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

function decorateProducts(products) {
  return products.map((item, index) => ({
    ...item,
    imageUrl: item.imageUrl || (index % 2 === 0 ? '/images/product-gift-photo.png' : '/images/product-single-photo.png'),
    displayPrice: formatPrice(item.price),
    categoryKey: index % 2 === 0 ? 'gift' : 'moxa'
  }))
}

Page({
  data: {
    loading: true,
    activeKey: 'all',
    categories,
    allProducts: [],
    products: [],
    tabs: [
      { key: 'home', label: '首页', iconUrl: '/images/tab-home.png', active: false },
      { key: 'category', label: '分类', iconUrl: '/images/tab-category-active.png', active: true },
      { key: 'cart', label: '购物车', iconUrl: '/images/tab-cart.png', active: false },
      { key: 'mine', label: '我的', iconUrl: '/images/tab-mine.png', active: false }
    ]
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
    const products = decorateProducts(await getProducts())
    this.setData({ loading: false, allProducts: products })
    this.applyFilter()
  },

  applyFilter() {
    const category = categories.find((item) => item.key === this.data.activeKey)
    if (!category || category.key === 'all') {
      this.setData({ products: this.data.allProducts })
      return
    }
    const filtered = this.data.allProducts.filter((product) => {
      const text = `${product.name || ''}${product.subtitle || ''}${product.description || ''}`
      return product.categoryKey === category.key || (category.words || []).some((word) => text.includes(word))
    })
    this.setData({ products: filtered.length ? filtered : this.data.allProducts })
  },

  onCategoryTap(event) {
    this.setData({ activeKey: event.currentTarget.dataset.key })
    this.applyFilter()
  },

  onProductTap(event) {
    wx.navigateTo({ url: `/pages/products/detail?id=${event.currentTarget.dataset.id}` })
  },

  onSearchTap() {
    wx.navigateTo({ url: '/pages/products/list' })
  },

  onTabTap(event) {
    const key = event.currentTarget.dataset.key
    if (key === 'home') {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }
    if (key === 'category') return
    if ((key === 'cart' || key === 'mine') && !isLoggedIn()) {
      navigateToLogin(`/pages/${key}/${key}`)
      return
    }
    wx.redirectTo({ url: `/pages/${key}/${key}` })
  }
})
