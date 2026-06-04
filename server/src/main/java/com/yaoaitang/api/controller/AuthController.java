package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.dto.LoginRequest;
import com.yaoaitang.api.dto.LoginResponse;
import com.yaoaitang.api.entity.AdminUser;
import com.yaoaitang.api.mapper.AdminUserMapper;
import com.yaoaitang.api.security.AdminPrincipal;
import com.yaoaitang.api.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {
    private final AdminUserMapper adminUserMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AdminUserMapper adminUserMapper, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminUserMapper = adminUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AdminUser user = adminUserMapper.selectOne(new LambdaQueryWrapper<AdminUser>()
                .eq(AdminUser::getUsername, request.getUsername())
                .last("limit 1"));
        if (user == null || user.getEnabled() == null || user.getEnabled() != 1) {
            throw new IllegalArgumentException("账号不存在或已停用");
        }

        boolean matched = user.getPasswordHash() != null && user.getPasswordHash().startsWith("$2")
                ? passwordEncoder.matches(request.getPassword(), user.getPasswordHash())
                : request.getPassword().equals(user.getPasswordHash());
        if (!matched) {
            throw new IllegalArgumentException("账号或密码错误");
        }

        if (user.getPasswordHash() == null || !user.getPasswordHash().startsWith("$2")) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            adminUserMapper.updateById(user);
        }

        AdminPrincipal principal = new AdminPrincipal(user.getId(), user.getUsername(), user.getDisplayName(), user.getRoleCode());
        return ApiResponse.ok(new LoginResponse(jwtUtil.issue(principal), principal));
    }
}
