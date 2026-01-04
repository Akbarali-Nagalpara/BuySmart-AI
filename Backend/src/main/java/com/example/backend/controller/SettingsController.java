package com.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class SettingsController {

    // In-memory storage for demo
    private final Map<String, UserSettings> settingsStore = new HashMap<>();

    @GetMapping
    public ResponseEntity<?> getSettings(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            UserSettings settings = settingsStore.getOrDefault(userEmail, new UserSettings());
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            return ResponseEntity.ok(new UserSettings());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateSettings(@RequestBody UserSettings settings, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            settingsStore.put(userEmail, settings);
            return ResponseEntity.ok(Map.of("message", "Settings updated successfully", "settings", settings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update settings"));
        }
    }

    // DTO class
    public static class UserSettings {
        private boolean emailNotifications = true;
        private boolean priceAlerts = true;
        private boolean weeklyDigest = false;
        private String theme = "light";

        public boolean isEmailNotifications() { return emailNotifications; }
        public void setEmailNotifications(boolean emailNotifications) { this.emailNotifications = emailNotifications; }
        
        public boolean isPriceAlerts() { return priceAlerts; }
        public void setPriceAlerts(boolean priceAlerts) { this.priceAlerts = priceAlerts; }
        
        public boolean isWeeklyDigest() { return weeklyDigest; }
        public void setWeeklyDigest(boolean weeklyDigest) { this.weeklyDigest = weeklyDigest; }
        
        public String getTheme() { return theme; }
        public void setTheme(String theme) { this.theme = theme; }
    }
}
