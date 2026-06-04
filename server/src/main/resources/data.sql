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
