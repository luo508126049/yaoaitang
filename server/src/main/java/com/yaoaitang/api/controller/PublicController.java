package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.entity.Banner;
import com.yaoaitang.api.entity.HomeConfig;
import com.yaoaitang.api.entity.Product;
import com.yaoaitang.api.mapper.BannerMapper;
import com.yaoaitang.api.mapper.HomeConfigMapper;
import com.yaoaitang.api.mapper.ProductMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final BannerMapper bannerMapper;
    private final ProductMapper productMapper;
    private final HomeConfigMapper homeConfigMapper;

    public PublicController(BannerMapper bannerMapper, ProductMapper productMapper, HomeConfigMapper homeConfigMapper) {
        this.bannerMapper = bannerMapper;
        this.productMapper = productMapper;
        this.homeConfigMapper = homeConfigMapper;
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
                "searchPlaceholder", config.getOrDefault("searchPlaceholder", "搜索艾条/艾灸套餐/非遗产品"),
                "banners", banners,
                "products", products,
                "homeConfig", config
        ));
    }

    @GetMapping("/products")
    public ApiResponse<List<Product>> products(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(Product::getEnabled, 1)
                .orderByDesc(Product::getUpdatedAt);
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w.like(Product::getName, keyword.trim()).or().like(Product::getSubtitle, keyword.trim()));
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
}
