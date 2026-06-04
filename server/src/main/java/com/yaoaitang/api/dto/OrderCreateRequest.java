package com.yaoaitang.api.dto;

import java.util.List;

public class OrderCreateRequest {
    private String userKey;
    private String customerName;
    private String customerPhone;
    private String remark;
    private List<Long> cartItemIds;

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<Long> getCartItemIds() {
        return cartItemIds;
    }

    public void setCartItemIds(List<Long> cartItemIds) {
        this.cartItemIds = cartItemIds;
    }
}
