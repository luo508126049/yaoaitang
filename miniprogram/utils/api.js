const app = getApp()

const fallbackProducts = [
  {
    id: 1,
    name: '伊尹艾非遗礼盒',
    subtitle: '古法陈艾 · 节礼推荐',
    imageUrl: '/images/product-gift-photo.png',
    price: 198,
    marketPrice: 268,
    description: '适合节礼、门店体验和家庭养生场景。'
  },
  {
    id: 2,
    name: '古法艾条单品',
    subtitle: '罗氏制艾技艺 · 温和久燃',
    imageUrl: '/images/product-single-photo.png',
    price: 68,
    marketPrice: 98,
    description: '严选陈艾绒，适合日常艾灸调理。'
  }
]

const fallbackHome = {
  brandName: '百年老字号曜艾堂',
  searchPlaceholder: '搜索艾条/艾灸套餐/非遗产品',
  banners: [
    {
      id: 1,
      title: '商丘市非遗 · 罗氏制艾技艺',
      subtitle: '百年老字号曜艾堂，古法制艾传承',
      imageUrl: '/images/home-banner.png',
      linkType: 'certificate'
    },
    {
      id: 2,
      title: '伊尹艾礼盒',
      subtitle: '节气养生礼赠优选',
      imageUrl: '/images/banner-gift.png',
      linkType: 'product'
    }
  ],
  products: fallbackProducts,
  homeConfig: {
    activityLeftTitle: '拼团',
    activityLeftSubtitle: '多人同行更划算',
    activityRightTitle: '非遗大集',
    activityRightSubtitle: '古法艾条与非遗礼盒',
    productSectionTitle: '伊尹艾 / 分销商品'
  }
}

function normalizeUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/images/')) return url
  return `${app.globalData.apiBase}${url}`
}

function normalizeProduct(item) {
  return { ...item, imageUrl: normalizeUrl(item.imageUrl) }
}

function request(path) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBase}${path}`,
      method: 'GET',
      success(res) {
        if (res.data && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(new Error((res.data && res.data.message) || '接口请求失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

async function getHome() {
  try {
    const data = await request('/api/public/home')
    return {
      ...data,
      banners: (data.banners || []).map((item) => ({ ...item, imageUrl: normalizeUrl(item.imageUrl) })),
      products: (data.products || []).map(normalizeProduct)
    }
  } catch (error) {
    return fallbackHome
  }
}

async function getProducts(keyword = '') {
  const clean = String(keyword || '').trim()
  try {
    const query = clean ? `?keyword=${encodeURIComponent(clean)}` : ''
    const data = await request(`/api/public/products${query}`)
    const products = (data || []).map(normalizeProduct)
    if (products.length > 0 || !clean) return products
    return fallbackProducts.filter((item) => `${item.name}${item.subtitle}`.includes(clean))
  } catch (error) {
    if (!clean) return fallbackProducts
    return fallbackProducts.filter((item) => `${item.name}${item.subtitle}`.includes(clean))
  }
}

async function getProduct(id) {
  try {
    const data = await request(`/api/public/products/${id}`)
    return normalizeProduct(data)
  } catch (error) {
    return fallbackProducts.find((item) => String(item.id) === String(id)) || null
  }
}

module.exports = {
  getProduct,
  getProducts,
  getHome,
  normalizeUrl
}
