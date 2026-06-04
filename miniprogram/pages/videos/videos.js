const { getVideos } = require('../../utils/api')

const videos = [
  {
    title: '古法制艾工艺',
    length: '01:28',
    summary: '展示罗氏制艾的选绒、卷制与陈放流程。',
    poster: '/images/banner-heritage.png'
  },
  {
    title: '门店艾灸体验',
    length: '00:52',
    summary: '到店核销、理疗体验和产品选购流程说明。',
    poster: '/images/banner-experience.png'
  },
  {
    title: '非遗礼盒开箱',
    length: '00:45',
    summary: '节礼场景下的礼盒搭配和使用建议。',
    poster: '/images/banner-gift.png'
  }
]

function normalizeVideo(item) {
  return {
    title: item.title,
    length: item.badge || item.metadata || '',
    summary: item.subtitle,
    poster: item.imageUrl || '/images/banner-heritage.png'
  }
}

Page({
  data: { videos },

  onLoad() {
    this.loadVideos()
  },

  async loadVideos() {
    try {
      const serverVideos = (await getVideos()).map(normalizeVideo)
      if (serverVideos.length) {
        this.setData({ videos: serverVideos })
      }
    } catch (error) {
      this.setData({ videos })
    }
  },

  onBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },

  onVideoTap() {
    wx.showToast({ title: '视频源将在正式版接入', icon: 'none' })
  }
})
