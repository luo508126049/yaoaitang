package com.yaoaitang.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yaoaitang.api.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderItemMapper extends BaseMapper<OrderItem> {
}
