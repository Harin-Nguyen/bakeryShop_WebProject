import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FoodDetail.css";

const FoodDetail = () => {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoodDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/food/${foodId}`
      );
      setFood(response.data.food);
      setRelatedFoods(response.data.relatedFoods || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (foodId) {
      fetchFoodDetail();
    }
  }, [foodId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!food) {
    return <div className="not-found">Food not found</div>;
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="food-detail-page">
      <div className="food-detail">
        <div className="food-detail-image">
          <img
            src={`https://via.placeholder.com/300x300?text=No+Image`}
            alt={food.name || "Food"}
          />
        </div>
        <div className="food-detail-info">
          <h2 className="food-name">{food.name}</h2>
          <img
            src="/images/star-rating.png"
            alt="Rating"
            className="food-rating"
          />
          <p className="food-description">{food.description}</p>
          <p className="food-price">${food.price}</p>
          <div className="food-counter">
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>

      <div className="related-foods">
        <h3>Related Foods</h3>
        {relatedFoods.length ? (
          <div className="related-foods-list">
            {relatedFoods.map((related) => (
              <div key={related._id} className="related-food-item">
                <img
                  src={`https://via.placeholder.com/150x150?text=No+Image`}
                  alt={related.name}
                />
                <p className="related-food-name">{related.name}</p>
                <p className="related-food-price">${related.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="null-pro">No related products</div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
