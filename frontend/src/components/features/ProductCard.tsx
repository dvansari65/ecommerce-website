import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';

interface ProductCardProps {
  name?: string | "";
  category?: string | "";
  price?: number | 100;
  ratings?: number | 0; // 0 to 5
  photo?: string | "";
  onClick?: () => void;
  onWishlistClick?: () => void;
  className?:string
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
      className=" border-[1px] hover:border-blue-500  border-gray-400 bg-[rgb(135,106,137)] rounded-lg shadow hover:shadow-md transition cursor-pointer p-4 flex flex-col justify-between"
    >
      {/* Wishlist Icon + Price */}
      <div className="flex justify-between items-start mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistClick && onWishlistClick();
          }}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <FaHeart size={16} />
        </button>
        <span className="text-sm font-semibold text-gray-800">Rs.{price?.toFixed(2)}</span>
      </div>

      {/* Image */}
      <div className="w-full h-40 flex justify-center items-center mb-3">
        <img
          src={photo}
          alt={name}
          className="max-h-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-400">{category}</p>
        <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>
      </div>

      {/* Rating */}
      <div className="flex justify-center mt-2 text-yellow-500 text-xs">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={ratings && i < ratings ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
