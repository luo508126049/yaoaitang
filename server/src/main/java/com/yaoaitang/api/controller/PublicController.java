package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.dto.CartItemRequest;
import com.yaoaitang.api.dto.OrderCreateRequest;
import com.yaoaitang.api.entity.Banner;
import com.yaoaitang.api.entity.CartItem;
import com.yaoaitang.api.entity.HomeConfig;
import com.yaoaitang.api.entity.ModuleItem;
import com.yaoaitang.api.entity.OrderEntity;
import com.yaoaitang.api.entity.OrderItem;
import com.yaoaitang.api.entity.Product;
import com.yaoaitang.api.mapper.BannerMapper;
import com.yaoaitang.api.mapper.CartItemMapper;
import com.yaoaitang.api.mapper.HomeConfigMapper;
import com.yaoaitang.api.mapper.ModuleItemMapper;
import com.yaoaitang.api.mapper.OrderItemMapper;
import com.yaoaitang.api.mapper.OrderMapper;
import com.yaoaitang.api.mapper.ProductMapper;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final BannerMapper bannerMapper;
    private final ProductMapper productMapper;
    private final HomeConfigMapper homeConfigMapper;
    private final ModuleItemMapper moduleItemMapper;
    private final CartItemMapper cartItemMapper;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;

    public PublicController(
            BannerMapper bannerMapper,
            ProductMapper productMapper,
            HomeConfigMapper homeConfigMapper,
            ModuleItemMapper moduleItemMapper,
            CartItemMapper cartItemMapper,
            OrderMapper orderMapper,
            OrderItemMapper orderItemMapper) {
        this.bannerMapper = bannerMapper;
        this.productMapper = productMapper;
        this.homeConfigMapper = homeConfigMapper;
        this.moduleItemMapper = moduleItemMapper;
        this.cartItemMapper = cartItemMapper;
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
    }

    @GetMapping("/home")
    public ApiResponse<Map<String, Object>> home() {
        List<Banner> banners = bannerMapper.selectList(new LambdaQueryWrapper<Banner>()
                .eq(Banner::getEnabled, 1)
                .orderByAsc(Banner::getSortOrder)
                .orderByDesc(Banner::getUpdatedAt));
        List<Product> products = productMapper.selectList(new LambdaQueryWrapper<Product>()
                .eq(Product::getEnabled, 1)
                .eq(Product::getFeatured, 1)
                .orderByDesc(Product::getUpdatedAt)
                .last("limit 6"));
        Map<String, String> config = homeConfigMapper.selectList(null).stream()
                .collect(Collectors.toMap(HomeConfig::getConfigKey, HomeConfig::getConfigValue, (a, b) -> b));

        return ApiResponse.ok(Map.of(
                "brandName", config.getOrDefault("brandName", "百年老字号曜艾堂"),
                "searchPlaceholder", config.getOrDefault("searchPlaceholder", "搜索艾条/艾灸套装/非遗产品"),
                "banners", banners,
                "products", products,
                "homeConfig", config
        ));
    }

    @GetMapping("/products")
    public ApiResponse<List<Product>> products(@RequestParam(required = false) String keyword,
                                               @RequestParam(required = false) String category) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(Product::getEnabled, 1)
                .orderByDesc(Product::getUpdatedAt);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String cleanKeyword = keyword.trim();
            wrapper.and(w -> w.like(Product::getName, cleanKeyword)
                    .or()
                    .like(Product::getSubtitle, cleanKeyword)
                    .or()
                    .like(Product::getDescription, cleanKeyword));
        }
        if (category != null && !category.trim().isEmpty() && !"all".equals(category.trim())) {
            wrapper.like(Product::getCategory, category.trim());
        }
        return ApiResponse.ok(productMapper.selectList(wrapper));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<Product> product(@PathVariable Long id) {
        Product product = productMapper.selectById(id);
        if (product == null || product.getEnabled() == null || product.getEnabled() != 1) {
            throw new IllegalArgumentException("商品不存在或已下架");
        }
        return ApiResponse.ok(product);
    }

    @GetMapping("/categories")
    public ApiResponse<List<ModuleItem>> categories() {
        return ApiResponse.ok(moduleItems("category"));
    }

    @GetMapping("/cases")
    public ApiResponse<List<ModuleItem>> cases(@RequestParam(required = false) String category) {
        LambdaQueryWrapper<ModuleItem> wrapper = moduleWrapper("case");
        if (category != null && !category.isBlank() && !"全部".equals(category.trim())) {
            wrapper.eq(ModuleItem::getCategory, category.trim());
        }
        return ApiResponse.ok(moduleItemMapper.selectList(wrapper));
    }

    @GetMapping("/videos")
    public ApiResponse<List<ModuleItem>> videos() {
        return ApiResponse.ok(moduleItems("video"));
    }

    @GetMapping("/experience")
    public ApiResponse<Map<String, Object>> experience() {
        return ApiResponse.ok(Map.of(
                "coupons", moduleItems("experience_coupon"),
                "steps", moduleItems("experience_step")
        ));
    }

    @GetMapping("/distribution")
    public ApiResponse<Map<String, Object>> distribution() {
        return ApiResponse.ok(Map.of(
                "metrics", moduleItems("distribution_metric"),
                "tasks", moduleItems("distribution_task"),
                "leads", moduleItems("distribution_lead")
        ));
    }

    @GetMapping("/mine")
    public ApiResponse<Map<String, Object>> mine() {
        return ApiResponse.ok(Map.of(
                "stats", moduleItems("mine_stat"),
                "services", moduleItems("mine_service")
        ));
    }

    @GetMapping("/group-activities")
    public ApiResponse<List<ModuleItem>> groupActivities() {
        return ApiResponse.ok(moduleItems("group_activity"));
    }

    @GetMapping("/market")
    public ApiResponse<List<Product>> market(@RequestParam(required = false) String keyword,
                                             @RequestParam(required = false) String category) {
        return products(keyword, category);
    }

    @GetMapping("/cart")
    public ApiResponse<List<Map<String, Object>>> cart(@RequestParam String userKey) {
        return ApiResponse.ok(cartItems(userKey).stream().map(this::cartItemView).collect(Collectors.toList()));
    }

    @PostMapping("/cart/items")
    public ApiResponse<Map<String, Object>> addCartItem(@RequestBody CartItemRequest request) {
        String userKey = cleanUserKey(request.getUserKey());
        Product product = productMapper.selectById(request.getProductId());
        if (product == null || product.getEnabled() == null || product.getEnabled() != 1) {
            throw new IllegalArgumentException("商品不存在或已下架");
        }
        int quantity = Math.max(1, request.getQuantity() == null ? 1 : request.getQuantity());
        CartItem item = cartItemMapper.selectOne(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserKey, userKey)
                .eq(CartItem::getProductId, product.getId())
                .last("limit 1"));
        if (item == null) {
            item = new CartItem();
            item.setUserKey(userKey);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setSubtitle(product.getSubtitle());
            item.setImageUrl(product.getImageUrl());
            item.setPrice(product.getPrice());
            item.setQuantity(quantity);
            item.setSelected(1);
            cartItemMapper.insert(item);
        } else {
            item.setProductName(product.getName());
            item.setSubtitle(product.getSubtitle());
            item.setImageUrl(product.getImageUrl());
            item.setPrice(product.getPrice());
            item.setQuantity(Math.max(1, item.getQuantity()) + quantity);
            item.setSelected(1);
            cartItemMapper.updateById(item);
        }
        return ApiResponse.ok(cartItemView(item));
    }

    @PutMapping("/cart/items/{id}")
    public ApiResponse<Map<String, Object>> updateCartItem(@PathVariable Long id, @RequestBody CartItemRequest request) {
        CartItem item = cartItemMapper.selectById(id);
        if (item == null) {
            throw new IllegalArgumentException("购物车商品不存在");
        }
        if (request.getQuantity() != null) {
            item.setQuantity(Math.max(1, request.getQuantity()));
        }
        if (request.getSelected() != null) {
            item.setSelected(request.getSelected() ? 1 : 0);
        }
        cartItemMapper.updateById(item);
        return ApiResponse.ok(cartItemView(cartItemMapper.selectById(id)));
    }

    @DeleteMapping("/cart/items/{id}")
    public ApiResponse<Boolean> deleteCartItem(@PathVariable Long id) {
        return ApiResponse.ok(cartItemMapper.deleteById(id) > 0);
    }

    @PostMapping("/orders")
    public ApiResponse<OrderEntity> createOrder(@RequestBody OrderCreateRequest request) {
        String userKey = cleanUserKey(request.getUserKey());
        List<CartItem> items = cartItems(userKey).stream()
                .filter(item -> item.getSelected() != null && item.getSelected() == 1)
                .filter(item -> request.getCartItemIds() == null
                        || request.getCartItemIds().isEmpty()
                        || request.getCartItemIds().contains(item.getId()))
                .toList();
        if (items.isEmpty()) {
            throw new IllegalArgumentException("请先选择要结算的商品");
        }
        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(Math.max(1, item.getQuantity()))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        OrderEntity order = new OrderEntity();
        order.setOrderNo("YAT" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")));
        order.setCustomerName(blankToDefault(request.getCustomerName(), "小程序会员"));
        order.setCustomerPhone(blankToDefault(request.getCustomerPhone(), ""));
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        order.setRemark(blankToDefault(request.getRemark(), "小程序购物车下单"));
        orderMapper.insert(order);

        for (CartItem cartItem : items) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getPrice());
            orderItemMapper.insert(orderItem);
            cartItemMapper.deleteById(cartItem.getId());
        }
        return ApiResponse.ok(orderMapper.selectById(order.getId()));
    }

    private List<ModuleItem> moduleItems(String module) {
        return moduleItemMapper.selectList(moduleWrapper(module));
    }

    private LambdaQueryWrapper<ModuleItem> moduleWrapper(String module) {
        return new LambdaQueryWrapper<ModuleItem>()
                .eq(ModuleItem::getModule, module)
                .eq(ModuleItem::getEnabled, 1)
                .orderByAsc(ModuleItem::getSortOrder)
                .orderByDesc(ModuleItem::getUpdatedAt);
    }

    private String cleanUserKey(String userKey) {
        if (userKey == null || userKey.isBlank()) {
            throw new IllegalArgumentException("缺少用户标识");
        }
        return userKey.trim();
    }

    private List<CartItem> cartItems(String userKey) {
        return cartItemMapper.selectList(new LambdaQueryWrapper<CartItem>()
                .eq(CartItem::getUserKey, cleanUserKey(userKey))
                .orderByDesc(CartItem::getUpdatedAt));
    }

    private Map<String, Object> cartItemView(CartItem item) {
        Map<String, Object> view = new LinkedHashMap<>();
        view.put("id", item.getId());
        view.put("productId", item.getProductId());
        view.put("name", item.getProductName());
        view.put("subtitle", item.getSubtitle());
        view.put("imageUrl", item.getImageUrl());
        view.put("price", item.getPrice());
        view.put("count", item.getQuantity());
        view.put("selected", item.getSelected() != null && item.getSelected() == 1);
        return view;
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
