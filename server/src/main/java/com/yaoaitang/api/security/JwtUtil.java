package com.yaoaitang.api.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Value("${yaoaitang.jwt-secret}")
    private String secret;

    public String issue(AdminPrincipal principal) {
        try {
            Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", principal.getId());
            payload.put("username", principal.getUsername());
            payload.put("displayName", principal.getDisplayName());
            payload.put("roleCode", principal.getRoleCode());
            payload.put("exp", Instant.now().plusSeconds(86400).getEpochSecond());
            String encodedHeader = encode(JSON.writeValueAsBytes(header));
            String encodedPayload = encode(JSON.writeValueAsBytes(payload));
            String unsigned = encodedHeader + "." + encodedPayload;
            return unsigned + "." + sign(unsigned);
        } catch (Exception ex) {
            throw new IllegalStateException("签发 token 失败", ex);
        }
    }

    public AdminPrincipal parse(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            String unsigned = parts[0] + "." + parts[1];
            if (!constantEquals(sign(unsigned), parts[2])) {
                return null;
            }
            Map<String, Object> payload = JSON.readValue(Base64.getUrlDecoder().decode(parts[1]), new TypeReference<>() {});
            Number exp = (Number) payload.get("exp");
            if (exp == null || exp.longValue() < Instant.now().getEpochSecond()) {
                return null;
            }
            Number sub = (Number) payload.get("sub");
            return new AdminPrincipal(
                    sub.longValue(),
                    String.valueOf(payload.get("username")),
                    String.valueOf(payload.get("displayName")),
                    String.valueOf(payload.get("roleCode"))
            );
        } catch (Exception ex) {
            return null;
        }
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return encode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private static String encode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static boolean constantEquals(String a, String b) {
        if (a == null || b == null || a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
