package com.yaoaitang.api.security;

public final class AdminContext {
    private static final ThreadLocal<AdminPrincipal> CURRENT = new ThreadLocal<>();

    private AdminContext() {
    }

    public static void set(AdminPrincipal principal) {
        CURRENT.set(principal);
    }

    public static AdminPrincipal get() {
        return CURRENT.get();
    }

    public static void clear() {
        CURRENT.remove();
    }

    public static void requireSuperAdmin() {
        AdminPrincipal principal = get();
        if (principal == null || !"SUPER_ADMIN".equals(principal.getRoleCode())) {
            throw new SecurityException("需要超级管理员权限");
        }
    }
}
