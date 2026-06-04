package com.yaoaitang.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yaoaitang.api.entity.OrderEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<OrderEntity> {
}
