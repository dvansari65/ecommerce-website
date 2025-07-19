import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleProductsQuery } from "@/redux/api/productApi";
import { FaStar, FaHeart } from "react-icons/fa";
import Spinner from "@/components/ui/LoaderIcon";
import Reviews from "@/components/features/Reviews";
import {
  useCreateCartMutation,
  useGetCartProductsQuery,
} from "@/redux/api/cartApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { saveOrderItems } from "@/redux/reducer/cartReducer";

function ProductDetail() {
  const { id } = useParams() as { id: string };
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    data,
    isLoading: productLoading,
    isError: productError,
  } = useGetSingleProductsQuery({ id: id as string }, { skip: !id });

  const { data: productsDataFromCart } = useGetCartProductsQuery();
  const [createCart, { isLoading }] = useCreateCartMutation();

  const addToCart = async (id: string) => {
    try {
      const res = await createCart({ id });
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error("product already added to the cart!");
      }
    } catch (error) {
      console.error("failed to add cart");
      toast.error("failed to create cart");
    }
  };



  const handleNavigate = ()=>{
      dispatch(saveOrderItems([data?.product]))
      navigate("/buy-product")
  }

  const product = data?.product;
  if (productLoading) return <Spinner />;

  const isProductExistInCart = productsDataFromCart?.products?.find(
    (i) => i.productId._id.toString() === id.toString()
  );

  return (
    <div className="min-h-screen px-6 py-16 bg-[#0f0c29] text-white  ">
      <div className="max-w-5xl mx-auto bg-[#1b1321] border border-[#3f2e40] hover:border-[#b075f5] hover:shadow-purple-500/20 shadow-lg transition-all rounded-2xl p-6 md:flex gap-10">
        <div className="flex-shrink-0 w-full md:w-1/2 h-72 flex items-center justify-center bg-[#2a1e30] rounded-xl border border-[#3f2e40] p-4 relative">
          {productError ? (
            <Loader />
          ) : (
            <img
              src={product?.photo}
              alt={product?.photo}
              className="max-h-full object-contain rounded"
            />
          )}

          {product?.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 mt-6 md:mt-0">
          <div className="flex items-start justify-between mb-4">
            {productError ? (
              <Loader />
            ) : (
              <h2 className="text-2xl font-semibold text-white">
                {product?.name}
              </h2>
            )}
            <button className="text-white/50 hover:text-pink-400 transition">
              <FaHeart size={18} />
            </button>
          </div>

          {productError ? (
            <span className="text-sm text-gray-400 mb-1">?</span>
          ) : (
            <p className="text-sm text-gray-400 mb-1">
              Category: {product?.category}
            </p>
          )}
          {productError ? (
            <span className="text-sm text-gray-400 mb-1">?</span>
          ) : (
            <p className="text-lg text-purple-300 font-bold mb-4">
              ₹{product?.price.toFixed(2)}
            </p>
          )}

          <div className="flex items-center gap-1 text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < (product?.ratings || 0)
                    ? "text-yellow-400"
                    : "text-gray-600"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">
              ({product?.ratings})
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {product?.description ||
              "No description available for this product."}
          </p>

          <div className="mt-6 flex gap-4">
            {isProductExistInCart && isProductExistInCart !== null ? (
              <button
                onClick={() => {
                  addToCart(product?._id as string);
                }}
                className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition font-semibold"
              >
                {isLoading ? <Loader /> : "Added.."}
              </button>
            ) : (
              <button
                disabled={product?.stock === 0}
                onClick={() => {
                  addToCart(product?._id as string);
                }}
                className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition font-semibold"
              >
                Add to Cart
              </button>
            )}
            <button disabled={product?.stock === 0} onClick={handleNavigate} className="bg-[#2a1e30] text-white px-5 py-2 rounded-full hover:bg-[#3a2a40] transition font-semibold">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Reviews className="mt-3" id={id as string} />
    </div>
  );
}

export default ProductDetail;

// const { id } = useParams<{ id: string }>();
// const { data, isLoading: productLoading, isError: productError } = useGetSingleProductsQuery(
//   { id: id as string },
//   { skip: !id }
// );
// const {data:cartProducts} = useGetCartProductsQuery()
