package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.entity.Banner;
import com.yaoaitang.api.mapper.BannerMapper;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
public class AdminBannerController {
    private final BannerMapper bannerMapper;

    public AdminBannerController(BannerMapper bannerMapper) {
        this.bannerMapper = bannerMapper;
    }

    @GetMapping
    public ApiResponse<List<Banner>> list() {
        return ApiResponse.ok(bannerMapper.selectList(new LambdaQueryWrapper<Banner>()
                .orderByAsc(Banner::getSortOrder)
                .orderByDesc(Banner::getUpdatedAt)));
    }

    @PostMapping
    public ApiResponse<Banner> create(@RequestBody Banner banner) {
        banner.setId(null);
        bannerMapper.insert(banner);
        return ApiResponse.ok(banner);
    }

    @PutMapping("/{id}")
    public ApiResponse<Banner> update(@PathVariable Long id, @RequestBody Banner banner) {
        banner.setId(id);
        bannerMapper.updateById(banner);
        return ApiResponse.ok(bannerMapper.selectById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        return ApiResponse.ok(bannerMapper.deleteById(id) > 0);
    }
}
