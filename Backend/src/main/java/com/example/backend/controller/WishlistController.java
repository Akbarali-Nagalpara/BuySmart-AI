package com.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class WishlistController {

    // In-memory storage for demo (will be replaced with database entities)
    private final Map<String, List<WishlistItem>> wishlistStore = new HashMap<>();

    @GetMapping
    public ResponseEntity<?> getWishlist(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<WishlistItem> wishlist = wishlistStore.getOrDefault(userEmail, new ArrayList<>());
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistItem item, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<WishlistItem> wishlist = wishlistStore.computeIfAbsent(userEmail, k -> new ArrayList<>());
            
            item.setId(UUID.randomUUID().toString());
            item.setAddedDate(LocalDateTime.now().toString());
            
            wishlist.add(item);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to add to wishlist"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable String id, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<WishlistItem> wishlist = wishlistStore.getOrDefault(userEmail, new ArrayList<>());
            
            wishlist.removeIf(item -> item.getId().equals(id));
            return ResponseEntity.ok(Map.of("message", "Item removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to remove from wishlist"));
        }
    }

    // DTO class
    public static class WishlistItem {
        private String id;
        private String productName;
        private String brand;
        private double currentPrice;
        private double originalPrice;
        private String imageUrl;
        private double rating;
        private Integer score;
        private String addedDate;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }
        
        public double getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }
        
        public double getOriginalPrice() { return originalPrice; }
        public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        
        public String getAddedDate() { return addedDate; }
        public void setAddedDate(String addedDate) { this.addedDate = addedDate; }
    }
}
