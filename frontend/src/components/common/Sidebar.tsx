import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar: React.FC = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  return (
    <aside className="w-64 bg-white p-4 border-r h-screen overflow-y-auto shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <button
          onClick={() => setOpenCategory(!openCategory)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700"
        >
          Category {openCategory ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openCategory && (
          <ul className="mt-2 ml-2 space-y-1 text-sm">
            <li><input type="checkbox" /> <span className="ml-1">Men's Fashion</span></li>
            <li><input type="checkbox" /> <span className="ml-1">Electronics</span></li>
            <li><input type="checkbox" /> <span className="ml-1">Footwear</span></li>
            <li><input type="checkbox" /> <span className="ml-1">Accessories</span></li>
          </ul>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <button
          onClick={() => setOpenPrice(!openPrice)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700"
        >
          Price {openPrice ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openPrice && (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Min: ₹{minPrice}</span>
              <span>Max: ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Ratings Filter */}
      <div className="mb-4">
        <button
          onClick={() => setOpenRating(!openRating)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-700"
        >
          Ratings {openRating ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openRating && (
          <ul className="mt-2 ml-2 space-y-1 text-sm">
            {[4, 3, 2, 1].map((rating) => (
              <li key={rating}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                  />
                  <span className="ml-2">{rating} ⭐ & up</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
