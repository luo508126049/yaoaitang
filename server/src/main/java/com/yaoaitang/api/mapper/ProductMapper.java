package com.yaoaitang.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yaoaitang.api.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
