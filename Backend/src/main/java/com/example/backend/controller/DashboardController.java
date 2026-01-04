package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.User;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        // Handle case when authentication is disabled
        if (authentication == null || authentication.getName() == null) {
            // Return empty stats for unauthenticated users
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAnalyses", 0);
            stats.put("buyRecommendations", 0);
            stats.put("notBuyRecommendations", 0);
            stats.put("averageScore", 0);
            return ResponseEntity.ok(stats);
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<AnalysisResult> allAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);
        
        long totalAnalyses = allAnalyses.size();
        long buyRecommendations = allAnalyses.stream()
                .filter(a -> "BUY".equalsIgnoreCase(a.getVerdict()))
                .count();
        long notBuyRecommendations = totalAnalyses - buyRecommendations;
        
        double averageScore = allAnalyses.stream()
                .mapToDouble(AnalysisResult::getOverallScore)
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAnalyses", totalAnalyses);
        stats.put("buyRecommendations", buyRecommendations);
        stats.put("notBuyRecommendations", notBuyRecommendations);
        stats.put("averageScore", Math.round(averageScore));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentAnalyses(Authentication authentication) {
        // Handle case when authentication is disabled
        if (authentication == null || authentication.getName() == null) {
            // Return empty list for unauthenticated users
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<AnalysisResult> recentAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> response = recentAnalyses.stream()
                .map(analysis -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", analysis.getId().toString());
                    item.put("productName", analysis.getProduct().getProductName());
                    item.put("score", analysis.getOverallScore());
                    item.put("verdict", analysis.getVerdict());
                    item.put("date", getRelativeTime(analysis.getCreatedAt()));
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private String getRelativeTime(Date date) {
        if (date == null) return "Unknown";
        
        long diff = System.currentTimeMillis() - date.getTime();
        long seconds = diff / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;

        if (days > 0) return days + (days == 1 ? " day ago" : " days ago");
        if (hours > 0) return hours + (hours == 1 ? " hour ago" : " hours ago");
        if (minutes > 0) return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        return "Just now";
    }
}
