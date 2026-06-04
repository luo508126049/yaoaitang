package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.dto.UserRequest;
import com.yaoaitang.api.entity.AdminUser;
import com.yaoaitang.api.mapper.AdminUserMapper;
import com.yaoaitang.api.security.AdminContext;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final AdminUserMapper adminUserMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminUserController(AdminUserMapper adminUserMapper, BCryptPasswordEncoder passwordEncoder) {
        this.adminUserMapper = adminUserMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ApiResponse<List<AdminUser>> list() {
        AdminContext.requireSuperAdmin();
        List<AdminUser> users = adminUserMapper.selectList(new LambdaQueryWrapper<AdminUser>().orderByDesc(AdminUser::getUpdatedAt));
        users.forEach(user -> user.setPasswordHash(null));
        return ApiResponse.ok(users);
    }

    @PostMapping
    public ApiResponse<AdminUser> create(@Valid @RequestBody UserRequest request) {
        AdminContext.requireSuperAdmin();
        AdminUser user = new AdminUser();
        user.setUsername(request.getUsername());
        user.setDisplayName(request.getDisplayName());
        user.setRoleCode(request.getRoleCode());
        user.setEnabled(request.getEnabled());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword() == null ? "admin123" : request.getPassword()));
        adminUserMapper.insert(user);
        user.setPasswordHash(null);
        return ApiResponse.ok(user);
    }

    @PutMapping("/{id}")
    public ApiResponse<AdminUser> update(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        AdminContext.requireSuperAdmin();
        AdminUser user = adminUserMapper.selectById(id);
        if (user == null) {
            throw new IllegalArgumentException("账号不存在");
        }
        user.setUsername(request.getUsername());
        user.setDisplayName(request.getDisplayName());
        user.setRoleCode(request.getRoleCode());
        user.setEnabled(request.getEnabled());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        adminUserMapper.updateById(user);
        user.setPasswordHash(null);
        return ApiResponse.ok(user);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        AdminContext.requireSuperAdmin();
        return ApiResponse.ok(adminUserMapper.deleteById(id) > 0);
    }
}
