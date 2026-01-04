package com.example.backend.controller;

import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.User;
import com.example.backend.repository.AnalysisResultRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final AnalysisResultRepository analysisResultRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAnalysisHistory(Authentication authentication) {
        // Handle case when authentication is disabled
        if (authentication == null || authentication.getName() == null) {
            // Return empty list for unauthenticated users
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<AnalysisResult> allAnalyses = analysisResultRepository.findByUserOrderByCreatedAtDesc(user);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        
        List<Map<String, Object>> response = allAnalyses.stream()
                .map(analysis -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", analysis.getId().toString());
                    item.put("productName", analysis.getProduct().getProductName());
                    item.put("brand", analysis.getProduct().getBrand());
                    item.put("score", analysis.getOverallScore());
                    item.put("verdict", analysis.getVerdict());
                    item.put("date", dateFormat.format(analysis.getCreatedAt()));
                    item.put("imageUrl", analysis.getProduct().getImageUrl());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
