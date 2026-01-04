def build_prompt(data):
    # Extract product name from various possible fields
    product_name = (
        data.get('title') or 
        data.get('product_title') or 
        data.get('product_name') or 
        "Unknown Product"
    )
    
    # Extract brand
    brand = data.get('brand', 'Unknown Brand')
    
    # Extract rating
    rating = data.get('rating') or data.get('product_star_rating', 'No rating')
    
    # Extract reviews
    reviews_list = data.get('reviews', [])
    if reviews_list:
        reviews_text = "\n".join([
            f"- {review if isinstance(review, str) else review.get('review_comment', review.get('review_text', str(review)))}[:200]"
            for review in reviews_list[:10]  # Limit to 10 reviews
        ])
    else:
        reviews_text = "No reviews available"
    
    # Extract ratings
    ratings = data.get('ratings', [])
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    # Extract features
    features = data.get('features', [])
    features_text = "\n".join([f"- {feature}" for feature in features]) if features else "No features listed"
    
    # Get all other fields as features/specifications
    raw_data_dict = data
    
    return f"""
You are an AI product analyst for an e-commerce platform.

Analyze the following Amazon product data and return a JSON response with these exact fields:
- sentiment_score (0–1): Based on customer reviews sentiment
- feature_quality_score (0–1): Based on product features and specifications
- brand_reliability_score (0–1): Based on brand reputation
- rating_review_score (0–1): Based on ratings and review quality
- consistency_score (0–1): How consistent are the reviews (detect fake reviews)
- overall_score (0–1): Weighted average of all scores
- decision (either "BUY" or "NOT BUY")
- reason (concise 2-3 sentence explanation)

Product Information:
===================
Product Name: {product_name}
Brand: {brand}
Rating: {rating}
Average Rating from Reviews: {avg_rating:.2f}/5.0

Customer Reviews:
{reviews_text}

Features:
{features_text}

Additional Product Data:
{raw_data_dict}

IMPORTANT: Return ONLY valid JSON, without any markdown code fences, explanations, or additional text.

Example format:
{{
  "sentiment_score": 0.8,
  "feature_quality_score": 0.9,
  "brand_reliability_score": 0.85,
  "rating_review_score": 0.88,
  "consistency_score": 0.82,
  "overall_score": 0.85,
  "decision": "BUY",
  "reason": "Product has excellent reviews and strong features. Brand is reliable with consistent positive feedback."
}}
"""
