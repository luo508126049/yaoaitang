const API_BASE = import.meta.env.VITE_API_BASE || ''
const TOKEN_KEY = 'yaoaitang_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function assetUrl(url) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
  return `${API_BASE}${url}`
}

export async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({ code: response.status, message: '接口返回格式错误' }))
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.message || '请求失败')
  }
  return payload.data
}

export const api = {
  login: (body) => request('/api/admin/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  overview: () => request('/api/public/home'),
  banners: () => request('/api/admin/banners'),
  saveBanner: (banner) =>
    request(banner.id ? `/api/admin/banners/${banner.id}` : '/api/admin/banners', {
      method: banner.id ? 'PUT' : 'POST',
      body: JSON.stringify(banner)
    }),
  deleteBanner: (id) => request(`/api/admin/banners/${id}`, { method: 'DELETE' }),
  materials: () => request('/api/admin/materials'),
  uploadMaterial: (formData) => request('/api/admin/materials/upload', { method: 'POST', body: formData }),
  products: () => request('/api/admin/products'),
  saveProduct: (product) =>
    request(product.id ? `/api/admin/products/${product.id}` : '/api/admin/products', {
      method: product.id ? 'PUT' : 'POST',
      body: JSON.stringify(product)
    }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  orders: (status = '') => request(`/api/admin/orders${status ? `?status=${status}` : ''}`),
  updateOrder: (id, status) => request(`/api/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
  homeConfig: () => request('/api/admin/home-config'),
  saveHomeConfig: (configs) => request('/api/admin/home-config', { method: 'PUT', body: JSON.stringify(configs) }),
  users: () => request('/api/admin/users'),
  saveUser: (user) =>
    request(user.id ? `/api/admin/users/${user.id}` : '/api/admin/users', {
      method: user.id ? 'PUT' : 'POST',
      body: JSON.stringify(user)
    }),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: 'DELETE' })
}
