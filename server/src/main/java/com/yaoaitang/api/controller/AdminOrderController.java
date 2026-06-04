package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.dto.OrderStatusRequest;
import com.yaoaitang.api.entity.OrderEntity;
import com.yaoaitang.api.mapper.OrderMapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderMapper orderMapper;

    public AdminOrderController(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @GetMapping
    public ApiResponse<List<OrderEntity>> list(@RequestParam(required = false) String status) {
        LambdaQueryWrapper<OrderEntity> wrapper = new LambdaQueryWrapper<OrderEntity>()
                .orderByDesc(OrderEntity::getCreatedAt);
        if (status != null && !status.isBlank()) {
            wrapper.eq(OrderEntity::getStatus, status);
        }
        return ApiResponse.ok(orderMapper.selectList(wrapper));
    }

    @PutMapping("/{id}")
    public ApiResponse<OrderEntity> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        OrderEntity order = orderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        order.setStatus(request.getStatus());
        orderMapper.updateById(order);
        return ApiResponse.ok(orderMapper.selectById(id));
    }
}
