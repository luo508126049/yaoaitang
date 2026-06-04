package com.yaoaitang.api.dto;

import com.yaoaitang.api.security.AdminPrincipal;

public class LoginResponse {
    private String token;
    private AdminPrincipal user;

    public LoginResponse(String token, AdminPrincipal user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public AdminPrincipal getUser() {
        return user;
    }
}
