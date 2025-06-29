import { useGetSingleProductsQuery } from '@/redux/api/productApi';
import type { RootState } from "../redux/reducer/store";
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import Reviews from '@/components/features/Reviews'; // adjust import path if different

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleProductsQuery(
    { id: id as string },
    { skip: !id }
  );
  useEffect(()=>{
    console.log("id:",id)
  },[])

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError || !data?.product) return <div className="text-center mt-10">Error loading product.</div>;

  const product = data.product;

  return (
    <div className="min-h-screen w-full bg-gray-100 py-8 px-4 flex flex-col items-center overflow-y-auto">
      {/* Product Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl flex flex-col md:flex-row overflow-hidden mb-8">
        {/* Image Section */}
        <div className="md:w-1/2 p-6 flex justify-center items-center bg-gray-50">
          <img
            src={product.photo}
            alt={product.name}
            className="object-contain h-80 w-full max-w-sm"
          />
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-6 space-y-4">
          <h2 className="text-sm text-gray-500">Category: {product.category}</h2>
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <p className="text-xl font-bold text-blue-600">₹{product.discountedPrice}</p>
            {Number(product.discount) > 0 && (
              <>
                <p className="line-through text-gray-400">₹{product.price}</p>
                <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">Discount</span>
              </>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={18} />
            <p className="text-sm text-gray-700">
              {product.ratings} ({product.numberOfRatings} Reviews)
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600">{product.description}</p>

          {/* Color Select */}
          <div>
            <p className="text-sm text-gray-700 mb-1">Color</p>
            <div className="flex gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 border-2 border-black" />
              <span className="w-6 h-6 rounded-full bg-orange-400" />
              <span className="w-6 h-6 rounded-full bg-red-400" />
              <span className="w-6 h-6 rounded-full bg-gray-700" />
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">Quantity:</p>
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={product.stock}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Add to Cart
            </button>
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition">
              Add to Wishlist
            </button>
          </div>

          {/* Tabs (Static for now) */}
          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 flex gap-6">
            <button className="font-bold pb-1">Detail {":"}
            </button>
            <div>
            {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="w-full max-w-6xl">
        <Reviews id={id!} />
      </div>
    </div>
  );
}

export default ProductDetail;
