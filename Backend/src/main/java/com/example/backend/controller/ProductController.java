package com.example.backend.controller;




import com.example.backend.DTO.cache.RawCacheDTO;
import com.example.backend.DTO.request.ProductRequestDTO;
import com.example.backend.DTO.response.ProductResponseDTO;
import com.example.backend.entity.AnalysisResult;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.service.AnalysisService;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final AnalysisService analysisService;
    private final ObjectMapper objectMapper;
    private final com.example.backend.repository.UserRepository userRepository;

    // ------------------------------------------------------------
    // Health Check Endpoint
    // ------------------------------------------------------------
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "ProductController is working",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // ------------------------------------------------------------
    // 1a. Search Products by Query (GET endpoint for frontend)
    // ------------------------------------------------------------
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchProducts(@RequestParam String query) {
        try {
            if (query == null || query.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            // Get ASINs from search query
            List<String> asins = productService.searchAsins(query);
            
            if (asins.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Limit to first 5 results
            List<Map<String, Object>> results = asins.stream()
                    .limit(10)
                    .map(asin -> {
                        try {
                            // Check if we have this product in cache/DB
                            Map<String, Object> result = new HashMap<>();
                            result.put("id", asin);
                            
                            // Try to get from existing product
                            productService.findByProductId(asin).ifPresentOrElse(
                                product -> {
                                    result.put("name", product.getProductName());
                                    result.put("brand", product.getBrand());
                                    result.put("price", product.getLastPrice());
                                    result.put("imageUrl", product.getImageUrl());
                                    result.put("rating", 4.5); // Default or fetch from raw data
                                    result.put("reviewCount", 1000); // Default or fetch from raw data
                                },
                                () -> {
                                    // Product not in DB yet, fetch basic info
                                    try {
                                        Map<String, Object> details = productService.fetchProductDetails(asin);
                                        log.info("Fetched details for ASIN {}: keys={}, title={}", 
                                            asin, details.keySet(), details.get("title"));
                                        
                                        // Cache the raw data for future analyze operations
                                        try {
                                            RawCacheDTO cacheDto = new RawCacheDTO();
                                            cacheDto.setProductId(asin);
                                            cacheDto.setRawJson(objectMapper.writeValueAsString(details));
                                            productService.saveRawCache(cacheDto);
                                            log.info("Cached raw data for ASIN {} during search", asin);
                                        } catch (Exception cacheError) {
                                            log.warn("Failed to cache raw data for ASIN {}: {}", asin, cacheError.getMessage());
                                        }
                                        
                                        String productName = (String) details.getOrDefault("title", "Unknown Product");
                                        log.info("Setting product name for ASIN {}: '{}'", asin, productName);
                                        
                                        result.put("name", productName);
                                        result.put("brand", details.getOrDefault("brand", "Unknown Brand"));
                                        result.put("price", details.getOrDefault("price", 0.0));
                                        result.put("imageUrl", details.getOrDefault("imageUrl", ""));
                                        result.put("rating", details.getOrDefault("rating", 0.0));
                                        result.put("reviewCount", details.getOrDefault("reviewCount", 0));
                                    } catch (Exception e) {
                                        log.error("Error fetching product details for ASIN {}", asin, e);
                                        result.put("name", "Product " + asin);
                                        result.put("brand", "Unknown");
                                        result.put("price", 0.0);
                                        result.put("imageUrl", "");
                                        result.put("rating", 0.0);
                                        result.put("reviewCount", 0);
                                    }
                                }
                            );
                            
                            return result;
                        } catch (Exception e) {
                            log.error("Error processing ASIN {}", asin, e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            log.error("Search failed for query: {}", query, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ------------------------------------------------------------
    // 1b. Search Product → Fetch Raw → AI → Structured Save → Return DTO
    // ------------------------------------------------------------
    @PostMapping("/search-and-process")
    public ResponseEntity<ProductResponseDTO> searchProduct(@RequestBody ProductRequestDTO req) throws Exception {

        String query = req.getQuery();
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // ---------------------------------------------------------
        // 1️⃣ Get ASIN for search query
        // ---------------------------------------------------------
        List<String> asins = productService.searchAsins(query);
        if (asins.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String asin = asins.get(0);  // best match
        log.info("Selected ASIN '{}' for query '{}'", asin, query);

        // ---------------------------------------------------------
        // 2️⃣ Check RAW CACHE
        // ---------------------------------------------------------
        String cachedRaw = productService.getRawCache(asin);

        if (cachedRaw != null) {
            log.info("CACHE HIT for ASIN {}", asin);

            // Convert JSON string → Map
            Map<String, Object> rawMap = objectMapper.readValue(cachedRaw, Map.class);

            // Process product using cached RAW data
            Product product = productService.processAndSaveProduct(asin, rawMap);

            return ResponseEntity.ok(convertToDto(product));
        }

        // ---------------------------------------------------------
        // 3️⃣ CACHE MISS → Fetch fresh details from RapidAPI
        // ---------------------------------------------------------
        log.info("CACHE MISS → Fetching from RapidAPI for ASIN {}", asin);

        Map<String, Object> freshDetails = productService.fetchProductDetails(asin);

        // Save RAW JSON to cache
        RawCacheDTO dto = new RawCacheDTO();
        dto.setProductId(asin);
        dto.setRawJson(objectMapper.writeValueAsString(freshDetails));
        productService.saveRawCache(dto);

        // ---------------------------------------------------------
        // 4️⃣ Process & Save Product using fresh API data
        // ---------------------------------------------------------
        Product savedProduct = productService.processAndSaveProduct(asin, freshDetails);

        return ResponseEntity.ok(convertToDto(savedProduct));
    }




    // ------------------------------------------------------------
    // 2. Get Product Details
    // ------------------------------------------------------------
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable String productId) {

        return productService.findByProductId(productId)
                .map(product -> ResponseEntity.ok(convertToDto(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------
    // 3. Check Product Existence
    // ------------------------------------------------------------
    @GetMapping("/exists/{productId}")
    public ResponseEntity<Boolean> checkProductExists(@PathVariable String productId) {
        return ResponseEntity.ok(productService.existsByProductId(productId));
    }




    private ProductResponseDTO convertToDto(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setProductLink(product.getProductLink());
        dto.setLastPrice(product.getLastPrice());
        dto.setSpecifications(product.getSpecification());  // full raw specs from RapidAPI

        return dto;
    }


    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeProductByDetails(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String productId = request.get("productId");
            String productName = request.get("productName");
            
            if (productId == null || productId.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "productId is required"));
            }

            log.info("Analyzing product: {} ({})", productName, productId);

            // Get current user (if authenticated)
            User user = null;
            if (authentication != null && authentication.isAuthenticated()) {
                String email = authentication.getName();
                user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    log.warn("Authenticated user {} not found in database", email);
                }
            } else {
                log.info("Anonymous user analyzing product");
            }

            // 1️⃣ Get raw JSON from cache OR fetch if not available
            String rawJson = productService.getRawCache(productId);
            
            if (rawJson == null) {
                log.info("No cached data for {}. Fetching from API...", productId);
                
                // Fetch product details from RapidAPI
                Map<String, Object> freshDetails = productService.fetchProductDetails(productId);
                
                if (freshDetails.containsKey("error")) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Failed to fetch product details: " + freshDetails.get("error")));
                }
                
                // Save to cache for future use
                RawCacheDTO dto = new RawCacheDTO();
                dto.setProductId(productId);
                dto.setRawJson(objectMapper.writeValueAsString(freshDetails));
                productService.saveRawCache(dto);
                
                // Convert back to JSON string for AI processing
                rawJson = objectMapper.writeValueAsString(freshDetails);
            } else {
                log.info("Using cached data for {}", productId);
            }

            // 2️⃣ Send raw → AI Engine (or local processing if AI disabled)
            Map<String, Object> structured =
                    productService.sendRawToAiAndGetStructured(rawJson);
            
            if (structured == null || structured.isEmpty()) {
                log.error("AI service returned null or empty structured data");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to process product data"));
            }
            
            // Check if the structured data contains an error before proceeding
            if (structured.containsKey("error") && structured.get("error").equals("PROCESSING_FAILED")) {
                log.error("Processing failed: {}", structured.get("message"));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                            "error", "Processing failed",
                            "message", structured.getOrDefault("message", "Unable to process product data")
                        ));
            }
            
            log.info("Structured data received: {}", structured.keySet());
            
            // Validate that the analyzed product matches the requested ASIN
            Object rawObj = structured.get("raw");
            if (rawObj instanceof Map) {
                Map<String, Object> rawData = (Map<String, Object>) rawObj;
                String actualAsin = (String) rawData.get("asin");
                if (actualAsin != null && !actualAsin.equals(productId)) {
                    log.warn("ASIN mismatch: requested={}, got={}", productId, actualAsin);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of(
                                "error", "Product mismatch detected",
                                "message", "The analyzed product (" + actualAsin + ") does not match the requested product (" + productId + ")"
                            ));
                }
            }

            // 3️⃣ Save the structured product to database
            log.info("Saving product with structured data. Title: {}, Brand: {}, Price: {}, ImageURL: {}", 
                structured.get("title"), structured.get("brand"), structured.get("price"), structured.get("imageUrl"));
            
            Product savedProduct = productService.processAndSaveProduct(productId, structured);
            
            if (savedProduct == null) {
                log.error("Failed to save product");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to save product"));
            }
            
            log.info("Product saved successfully. Name: {}, Brand: {}, Price: {}, ImageURL: {}", 
                savedProduct.getProductName(), savedProduct.getBrand(), 
                savedProduct.getLastPrice(), savedProduct.getImageUrl());

            // 4️⃣ Create and save analysis result
            int totalScore = 75; // Default score
            String verdict = "BUY";
            String summary = "Product analysis completed";
            String pros = "[]";
            String cons = "[]";
            
            // Extract scores from AI response if available
            if (structured.containsKey("overall_score")) {
                Object scoreObj = structured.get("overall_score");
                if (scoreObj instanceof Number) {
                    double score = ((Number) scoreObj).doubleValue();
                    totalScore = (int) (score * 100); // Convert 0-1 to 0-100
                }
            }
            
            if (structured.containsKey("decision")) {
                String decision = structured.get("decision").toString();
                verdict = decision.equals("BUY") ? "BUY" : "NOT_BUY";
            }
            
            if (structured.containsKey("reason")) {
                summary = structured.get("reason").toString();
            }
            
            // Extract pros and cons if available
            try {
                if (structured.containsKey("pros")) {
                    pros = objectMapper.writeValueAsString(structured.get("pros"));
                }
                if (structured.containsKey("cons")) {
                    cons = objectMapper.writeValueAsString(structured.get("cons"));
                }
            } catch (Exception e) {
                log.warn("Failed to serialize pros/cons", e);
            }
            
            // Save analysis result with all details
            AnalysisResult analysisResult = new AnalysisResult();
            analysisResult.setProduct(savedProduct);
            analysisResult.setUser(user); // Can be null for anonymous users
            analysisResult.setTotalScore(totalScore);
            analysisResult.setOverallScore(totalScore);
            analysisResult.setVerdict(verdict);
            analysisResult.setSummary(summary);
            analysisResult.setPros(pros);
            analysisResult.setCons(cons);
            
            // Save analysis for both authenticated and anonymous users
            if (user != null) {
                log.info("Saving analysis result for product: {} (user: {})", savedProduct.getId(), user.getEmail());
            } else {
                log.info("Saving analysis result for product: {} (anonymous user)", savedProduct.getId());
            }
            
            analysisResult = analysisService.saveAnalysisResult(analysisResult);
            log.info("Analysis result saved with ID: {}", analysisResult.getId());

            // 5️⃣ Return analysis result with analysis ID
            Map<String, Object> response = new HashMap<>();
            response.put("id", analysisResult.getId().toString());
            response.put("productId", savedProduct.getProductId());
            response.put("message", "Analysis completed successfully");
            response.put("overallScore", totalScore);
            response.put("verdict", verdict);
            response.put("data", structured);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                        "error", "Invalid request",
                        "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Error analyzing product: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "Analysis failed",
                        "message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred",
                        "type", e.getClass().getSimpleName()
                    ));
        }
    }

    @PostMapping("/analyze/{productId}")
    public ResponseEntity<Map<String, Object>> analyzeProduct(@PathVariable String productId) {

        try {
            // 1️⃣ Get raw JSON from cache
            String rawJson = productService.getRawCache(productId);
            if (rawJson == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No raw data found for productId: " + productId));
            }

            // 2️⃣ Send raw → AI Engine
            Map<String, Object> structured =
                    productService.sendRawToAiAndGetStructured(rawJson);

            // 3️⃣ Return analyzed (AI output), but NOT save it
            return ResponseEntity.ok(structured);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }




}

