INSERT IGNORE INTO admin_role (id, code, name) VALUES
  (1, 'SUPER_ADMIN', '超级管理员'),
  (2, 'OPERATOR', '运营员');

INSERT IGNORE INTO admin_user (id, username, password_hash, display_name, role_code, enabled) VALUES
  (1, 'admin', 'admin123', '曜艾堂管理员', 'SUPER_ADMIN', 1),
  (2, 'operator', 'admin123', '运营员', 'OPERATOR', 1);

INSERT INTO material (id, name, type, url, size_bytes, mime_type) VALUES
  (1, '非遗证书 Banner', 'image', '/assets/banner-heritage.png', 0, 'image/png'),
  (2, '伊尹艾礼盒商品图', 'image', '/assets/product-gift.png', 0, 'image/png'),
  (3, '古法艾条商品图', 'image', '/assets/product-moxa.png', 0, 'image/png'),
  (4, '伊尹艾礼盒 Banner', 'image', '/assets/banner-gift.png', 0, 'image/png'),
  (5, '先灸后玉 Banner', 'image', '/assets/banner-experience.png', 0, 'image/png')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  type = VALUES(type),
  url = VALUES(url),
  size_bytes = VALUES(size_bytes),
  mime_type = VALUES(mime_type);

INSERT INTO banner (id, title, subtitle, image_url, link_type, link_value, sort_order, enabled) VALUES
  (1, '商丘市非遗 · 罗氏制艾技艺', '百年老字号曜艾堂，古法制艾传承', '/assets/banner-heritage.png', 'certificate', 'heritage-certificate', 1, 1),
  (2, '伊尹艾礼盒', '节气养生礼赠优选', '/assets/banner-gift.png', 'product', '1', 2, 1),
  (3, '到店体验 · 先灸后玉', '体验古法艾灸后再选购', '/assets/banner-experience.png', 'activity', 'xianjiuhouyu', 3, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  image_url = VALUES(image_url),
  link_type = VALUES(link_type),
  link_value = VALUES(link_value),
  sort_order = VALUES(sort_order),
  enabled = VALUES(enabled);

INSERT INTO product (id, name, subtitle, category, image_url, price, market_price, stock, enabled, featured, description) VALUES
  (1, '伊尹艾非遗礼盒', '古法陈艾 · 节礼推荐', '非遗礼盒', '/assets/product-gift.png', 198.00, 268.00, 120, 1, 1, '适合节礼、门店体验和家庭养生场景。'),
  (2, '古法艾条单品', '罗氏制艾技艺 · 温和久燃', '艾制品', '/assets/product-moxa.png', 68.00, 98.00, 360, 1, 1, '严选陈艾绒，适合日常艾灸调理。'),
  (3, '艾灸理疗套餐', '到店核销 · 专业调理', '理疗套餐', '/assets/card-market.png', 128.00, 168.00, 80, 1, 0, '线下门店体验套餐，适合肩颈和日常养护。')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  subtitle = VALUES(subtitle),
  category = VALUES(category),
  image_url = VALUES(image_url),
  price = VALUES(price),
  market_price = VALUES(market_price),
  stock = VALUES(stock),
  enabled = VALUES(enabled),
  featured = VALUES(featured),
  description = VALUES(description);

INSERT IGNORE INTO `order` (id, order_no, customer_name, customer_phone, total_amount, status, remark) VALUES
  (1, 'YAT202606040001', '陈女士', '13800000001', 198.00, 'PAID', '伊尹艾礼盒 1 份'),
  (2, 'YAT202606040002', '李先生', '13800000002', 68.00, 'PENDING', '待付款订单'),
  (3, 'YAT202606040003', '王女士', '13800000003', 128.00, 'SHIPPED', '门店体验套餐');

INSERT IGNORE INTO order_item (id, order_id, product_id, product_name, quantity, unit_price) VALUES
  (1, 1, 1, '伊尹艾非遗礼盒', 1, 198.00),
  (2, 2, 2, '古法艾条单品', 1, 68.00),
  (3, 3, 3, '艾灸理疗套餐', 1, 128.00);

INSERT INTO home_config (id, config_key, config_value) VALUES
  (1, 'activityLeftTitle', '拼团'),
  (2, 'activityLeftSubtitle', '多人同行更划算'),
  (3, 'activityRightTitle', '非遗大集'),
  (4, 'activityRightSubtitle', '古法艾条与非遗礼盒'),
  (5, 'productSectionTitle', '伊尹艾 / 分销商品'),
  (6, 'brandName', '百年老字号曜艾堂'),
  (7, 'searchPlaceholder', '搜索艾条/艾灸套餐/非遗产品')
ON DUPLICATE KEY UPDATE
  config_value = VALUES(config_value);

INSERT INTO module_item (id, module, title, subtitle, category, image_url, link_type, link_value, badge, price, market_price, sort_order, enabled, metadata) VALUES
  (1, 'category', '全部', '曜艾堂全品类商品', 'all', NULL, 'product_list', 'all', NULL, 0, 0, 1, 1, NULL),
  (2, 'category', '艾制品', '古法艾条、陈艾绒与日常养护产品', 'moxa', '/assets/product-moxa.png', 'product_list', 'moxa', NULL, 0, 0, 2, 1, NULL),
  (3, 'category', '理疗套盒', '门店体验、居家养护和节气调理套盒', 'set', '/assets/banner-experience.png', 'product_list', 'set', NULL, 0, 0, 3, 1, NULL),
  (4, 'category', '非遗礼盒', '节礼赠送和非遗伴手礼', 'gift', '/assets/product-gift.png', 'product_list', 'gift', NULL, 0, 0, 4, 1, NULL),
  (5, 'category', '器具工具', '艾灸器具、辅助工具和耗材', 'tool', '/assets/card-market.png', 'product_list', 'tool', NULL, 0, 0, 5, 1, NULL),
  (11, 'case', '肩颈寒湿调理记录', '围绕肩颈僵硬、睡眠浅等反馈，组合艾灸、热敷与到店指导。', '肩颈调理', '/assets/banner-experience.png', 'modal', 'case-neck', '7天跟踪', 0, 0, 1, 1, NULL),
  (12, 'case', '节气养生艾灸方案', '结合节气变化配置温和艾条，适合家庭日常养护。', '古法制艾', '/assets/banner-heritage.png', 'modal', 'case-season', '3次体验', 0, 0, 2, 1, NULL),
  (13, 'case', '女性暖宫调理案例', '通过门店评估、穴位建议和套盒搭配建立连续养护方案。', '妇科调理', '/assets/banner-gift.png', 'modal', 'case-women', '14天记录', 0, 0, 3, 1, NULL),
  (21, 'video', '古法制艾工艺', '展示罗氏制艾的选绒、卷制与陈放流程。', '非遗工艺', '/assets/banner-heritage.png', 'video', 'video-craft', '01:28', 0, 0, 1, 1, NULL),
  (22, 'video', '门店艾灸体验', '到店核销、理疗体验和产品选购流程说明。', '门店体验', '/assets/banner-experience.png', 'video', 'video-store', '00:52', 0, 0, 2, 1, NULL),
  (23, 'video', '非遗礼盒开箱', '节礼场景下的礼盒搭配和使用建议。', '产品讲解', '/assets/banner-gift.png', 'video', 'video-gift', '00:45', 0, 0, 3, 1, NULL),
  (31, 'experience_coupon', '先灸后玉体验券', '到店体验艾灸后选购玉石理疗套盒', '体验券', '/assets/banner-experience.png', 'claim_coupon', 'coupon-xjhy', '可领取', 68, 128, 1, 1, NULL),
  (32, 'experience_coupon', '节气养生调理券', '适合初次到店用户，含基础问询与体验', '体验券', '/assets/banner-experience.png', 'claim_coupon', 'coupon-season', '可领取', 39, 89, 2, 1, NULL),
  (33, 'experience_step', '领取体验券', '在小程序领取门店核销券', '流程', NULL, NULL, NULL, NULL, 0, 0, 1, 1, NULL),
  (34, 'experience_step', '预约到店时间', '选择门店和可预约时间段', '流程', NULL, NULL, NULL, NULL, 0, 0, 2, 1, NULL),
  (35, 'experience_step', '核销体验', '到店核销后体验艾灸服务', '流程', NULL, NULL, NULL, NULL, 0, 0, 3, 1, NULL),
  (36, 'experience_step', '选择适合套盒', '根据体验反馈选购对应套盒', '流程', NULL, NULL, NULL, NULL, 0, 0, 4, 1, NULL),
  (41, 'distribution_metric', '可提现佣金', '当前可提现金额', 'metric', NULL, NULL, NULL, NULL, 0, 0, 1, 1, '¥0.00'),
  (42, 'distribution_metric', '累计推广', '已触达潜在客户', 'metric', NULL, NULL, NULL, NULL, 0, 0, 2, 1, '12人'),
  (43, 'distribution_metric', '本月订单', '本月分销订单数', 'metric', NULL, NULL, NULL, NULL, 0, 0, 3, 1, '0单'),
  (44, 'distribution_task', '分享非遗礼盒给好友', '推荐节礼场景商品', 'task', NULL, NULL, NULL, NULL, 0, 0, 1, 1, NULL),
  (45, 'distribution_task', '邀请新用户领取体验券', '引导新用户到店体验', 'task', NULL, NULL, NULL, NULL, 0, 0, 2, 1, NULL),
  (46, 'distribution_task', '引导到店体验先灸后玉', '转化门店服务订单', 'task', NULL, NULL, NULL, NULL, 0, 0, 3, 1, NULL),
  (47, 'distribution_lead', '养生体验用户', '预计佣金 ¥18.00', 'lead', NULL, NULL, NULL, '待成交', 18, 0, 1, 1, NULL),
  (48, 'distribution_lead', '门店老客复购', '预计佣金 ¥32.00', 'lead', NULL, NULL, NULL, '跟进中', 32, 0, 2, 1, NULL),
  (51, 'mine_stat', '待付款', '会员订单统计', 'stat', NULL, NULL, NULL, NULL, 0, 0, 1, 1, '0'),
  (52, 'mine_stat', '待发货', '会员订单统计', 'stat', NULL, NULL, NULL, NULL, 0, 0, 2, 1, '0'),
  (53, 'mine_stat', '优惠券', '会员卡包统计', 'stat', NULL, NULL, NULL, NULL, 0, 0, 3, 1, '2'),
  (54, 'mine_stat', '积分', '会员积分统计', 'stat', NULL, NULL, NULL, NULL, 0, 0, 4, 1, '120'),
  (55, 'mine_service', '我的订单', '订单、核销券和售后进度', 'service', NULL, 'placeholder', 'orders', NULL, 0, 0, 1, 1, NULL),
  (56, 'mine_service', '分销中心', '佣金、推广码和下线管理', 'service', NULL, 'page', '/pages/distribution/distribution', NULL, 0, 0, 2, 1, NULL),
  (57, 'mine_service', '门店服务', '到店体验、灸疗预约和门店导航', 'service', NULL, 'page', '/pages/experience/experience', NULL, 0, 0, 3, 1, NULL),
  (58, 'mine_service', '个人资料', '头像昵称授权将在正式版接入', 'service', NULL, 'placeholder', 'profile', NULL, 0, 0, 4, 1, NULL),
  (61, 'group_activity', '伊尹艾非遗礼盒拼团', '3人成团，适合节礼赠送', 'group', '/assets/product-gift.png', 'product', '1', '3人团', 168, 198, 1, 1, '3'),
  (62, 'group_activity', '古法艾条日常养护团', '2人成团，门店同款艾条', 'group', '/assets/product-moxa.png', 'product', '2', '2人团', 58, 68, 2, 1, '2')
ON DUPLICATE KEY UPDATE
  module = VALUES(module),
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  category = VALUES(category),
  image_url = VALUES(image_url),
  link_type = VALUES(link_type),
  link_value = VALUES(link_value),
  badge = VALUES(badge),
  price = VALUES(price),
  market_price = VALUES(market_price),
  sort_order = VALUES(sort_order),
  enabled = VALUES(enabled),
  metadata = VALUES(metadata);
