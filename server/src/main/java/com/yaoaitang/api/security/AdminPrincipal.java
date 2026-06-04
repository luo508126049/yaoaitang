package com.yaoaitang.api.security;

public class AdminPrincipal {
    private final Long id;
    private final String username;
    private final String displayName;
    private final String roleCode;

    public AdminPrincipal(Long id, String username, String displayName, String roleCode) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.roleCode = roleCode;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getRoleCode() {
        return roleCode;
    }
}
