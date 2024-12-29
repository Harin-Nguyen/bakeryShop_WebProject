import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { menu_list } from "../../assets/assets";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 8;

  const filteredFoods = food_list.filter((item) => {
    const isCategoryMatch =
      selectedCategory === "All" || item.category === selectedCategory;
    const isPriceMatch =
      item.price >= priceRange[0] && item.price <= priceRange[1];
    return isCategoryMatch && isPriceMatch;
  });

  const currentFoods =
    selectedCategory === "All"
      ? filteredFoods
      : filteredFoods.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  return (
    <div className="food-display" id="food-display">
      <h1>Top Cakies Near You</h1>

      <div className="filter-section">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All">All Categories</option>
          {menu_list.map(({ menu_name }) => (
            <option key={menu_name} value={menu_name}>
              {menu_name}
            </option>
          ))}
        </select>

        <select onChange={handlePriceChange}>
          <option value="0-100">All Prices</option>
          <option value="0-10">Under $10</option>
          <option value="10-20">$10 - $20</option>
          <option value="20-50">$20 - $50</option>
          <option value="50-100">$50 - $100</option>
        </select>
      </div>

      {currentFoods.length > 0 ? (
        <div className="food-display-list">
          {currentFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="food-display-empty">
          No foods available for the selected filters.
        </p>
      )}

      {/* Chỉ hiển thị pagination khi có phân trang */}
      {selectedCategory !== "All" && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`pagination-button ${
                currentPage === page + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
