package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.entity.HomeConfig;
import com.yaoaitang.api.mapper.HomeConfigMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/home-config")
public class AdminHomeConfigController {
    private final HomeConfigMapper homeConfigMapper;

    public AdminHomeConfigController(HomeConfigMapper homeConfigMapper) {
        this.homeConfigMapper = homeConfigMapper;
    }

    @GetMapping
    public ApiResponse<List<HomeConfig>> get() {
        return ApiResponse.ok(homeConfigMapper.selectList(new LambdaQueryWrapper<HomeConfig>().orderByAsc(HomeConfig::getConfigKey)));
    }

    @PutMapping
    public ApiResponse<List<HomeConfig>> update(@RequestBody List<HomeConfig> configs) {
        for (HomeConfig config : configs) {
            HomeConfig existing = homeConfigMapper.selectOne(new LambdaQueryWrapper<HomeConfig>()
                    .eq(HomeConfig::getConfigKey, config.getConfigKey())
                    .last("limit 1"));
            if (existing == null) {
                config.setId(null);
                homeConfigMapper.insert(config);
            } else {
                existing.setConfigValue(config.getConfigValue());
                homeConfigMapper.updateById(existing);
            }
        }
        return get();
    }
}
