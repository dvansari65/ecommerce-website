import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';

interface ProductCardProps {
  name?: string | "";
  category?: string | "";
  price?: number | 100;
  ratings?: number | 0;
  photo?: string | "";
  onClick?: () => void;
  onWishlistClick?: () => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  price,
  ratings,
  photo,
  onClick,
  onWishlistClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#1b1321] hover:border-[#b075f5] border border-[#3f2e40] rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer p-4 flex flex-col justify-between"
    >
      {/* Wishlist & Price */}
      <div className="flex justify-between items-start mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick && onWishlistClick();
          }}
          className="text-white/50 hover:text-pink-400 transition"
        >
          <FaHeart size={16} />
        </button>
        <span className="text-sm font-semibold text-purple-300">
          ₹{price?.toFixed(2)}
        </span>
      </div>

      {/* Image */}
      <div className="w-full h-40 flex justify-center items-center mb-3">
        <img
          src={photo}
          alt={name}
          className="max-h-full object-contain rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-400">{category}</p>
        <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
      </div>

      {/* Ratings */}
      <div className="flex justify-center mt-2 text-yellow-500 text-xs">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={ratings && i < ratings ? 'text-yellow-400' : 'text-gray-600'}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
