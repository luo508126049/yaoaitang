const tabs = [
  { key: 'home', label: '首页', icon: 'home', route: '/pages/index/index' },
  { key: 'category', label: '分类', icon: 'category', route: '/pages/category/category' },
  { key: 'cart', label: '购物车', icon: 'cart', route: '/pages/cart/cart' },
  { key: 'mine', label: '我', icon: 'mine', route: '/pages/mine/mine' }
]

function createTabs(activeKey) {
  return tabs.map((item) => ({
    ...item,
    active: item.key === activeKey,
    iconUrl: `/images/tab-${item.icon}${item.key === activeKey ? '-active' : ''}.png`
  }))
}

function formatPrice(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

function normalizeDisplayProduct(item, fallback = {}) {
  const product = { ...fallback, ...item }
  return {
    ...product,
    displayName: product.displayName || product.name || fallback.name || '曜艾堂艾制好物',
    displaySubtitle: product.displaySubtitle || product.subtitle || fallback.subtitle || '非遗艾草 日常养生',
    displayPrice: formatPrice(product.price),
    displayMarketPrice: formatPrice(product.marketPrice),
    visualUrl: product.visualUrl || product.imageUrl || fallback.imageUrl || '/images/product-gift-photo.png',
    imageUrl: product.imageUrl || product.visualUrl || fallback.imageUrl || '/images/product-gift-photo.png'
  }
}

module.exports = {
  createTabs,
  formatPrice,
  normalizeDisplayProduct
}
