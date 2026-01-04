package com.example.backend.repository;

import com.example.backend.entity.User;
import com.example.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    
    List<WishlistItem> findByUserOrderByAddedAtDesc(User user);
    
    @Query("SELECT w FROM WishlistItem w WHERE w.user = :user AND w.product.productId = :productId")
    Optional<WishlistItem> findByUserAndProductId(User user, String productId);
    
    boolean existsByUserAndProductProductId(User user, String productId);
    
    void deleteByUserAndProductProductId(User user, String productId);
}
