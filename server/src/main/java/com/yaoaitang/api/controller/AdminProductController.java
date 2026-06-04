package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.entity.Product;
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

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
    private final ProductMapper productMapper;

    public AdminProductController(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    @GetMapping
    public ApiResponse<List<Product>> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>().orderByDesc(Product::getUpdatedAt);
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.like(Product::getName, keyword.trim());
        }
        return ApiResponse.ok(productMapper.selectList(wrapper));
    }

    @PostMapping
    public ApiResponse<Product> create(@RequestBody Product product) {
        product.setId(null);
        productMapper.insert(product);
        return ApiResponse.ok(product);
    }

    @PutMapping("/{id}")
    public ApiResponse<Product> update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        productMapper.updateById(product);
        return ApiResponse.ok(productMapper.selectById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        return ApiResponse.ok(productMapper.deleteById(id) > 0);
    }
}
