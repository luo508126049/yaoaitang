package com.yaoaitang.api.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yaoaitang.api.common.ApiResponse;
import com.yaoaitang.api.entity.Material;
import com.yaoaitang.api.mapper.MaterialMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/materials")
public class AdminMaterialController {
    private final MaterialMapper materialMapper;

    @Value("${yaoaitang.upload-dir}")
    private String uploadDir;

    @Value("${yaoaitang.public-base-url}")
    private String publicBaseUrl;

    public AdminMaterialController(MaterialMapper materialMapper) {
        this.materialMapper = materialMapper;
    }

    @GetMapping
    public ApiResponse<List<Material>> list() {
        return ApiResponse.ok(materialMapper.selectList(new LambdaQueryWrapper<Material>().orderByDesc(Material::getUpdatedAt)));
    }

    @PostMapping
    public ApiResponse<Material> create(@RequestBody Material material) {
        material.setId(null);
        materialMapper.insert(material);
        return ApiResponse.ok(material);
    }

    @PostMapping("/upload")
    public ApiResponse<Material> upload(@RequestParam("file") MultipartFile file,
                                        @RequestParam(defaultValue = "image") String type) throws Exception {
        String originalName = file.getOriginalFilename() == null ? "material" : file.getOriginalFilename();
        String extension = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0) {
            extension = originalName.substring(dot);
        }
        Path dir = Path.of(uploadDir, LocalDate.now().toString());
        Files.createDirectories(dir);
        String fileName = UUID.randomUUID() + extension;
        Path target = dir.resolve(fileName);
        file.transferTo(target);

        Material material = new Material();
        material.setName(originalName);
        material.setType(type);
        material.setMimeType(file.getContentType());
        material.setSizeBytes(file.getSize());
        material.setUrl(publicBaseUrl + "/uploads/" + LocalDate.now() + "/" + fileName);
        materialMapper.insert(material);
        return ApiResponse.ok(material);
    }

    @PutMapping("/{id}")
    public ApiResponse<Material> update(@PathVariable Long id, @RequestBody Material material) {
        material.setId(id);
        materialMapper.updateById(material);
        return ApiResponse.ok(materialMapper.selectById(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Long id) {
        return ApiResponse.ok(materialMapper.deleteById(id) > 0);
    }
}
