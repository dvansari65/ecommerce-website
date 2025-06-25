
import { Link } from 'react-router-dom';
import { useLatestProductsQuery } from '../redux/api/productApi';
import ProductCard from '../components/features/ProductCard';
import { LoaderIcon } from 'react-hot-toast';
import { useEffect } from 'react';

const Home = () => {
  // const products = new Array(6).fill(0); // placeholder array for demo
  const { data, isLoading } = useLatestProductsQuery()
  useEffect(()=>{
    console.log("data",data)
  },[])
  return (
    <div className="w-full">
      {/* Hero Featured Product */}
      <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-16 md:py-20 transition-all duration-300 ease-in-out">
  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    {/* Text */}
    <div className="space-y-6 animate-fade-up">
      <h3 className="text-pink-600 text-lg font-semibold tracking-wide animate-pulse">
        ✨ Limited Time Offer
      </h3>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
        Elevate Your Style with <span className="text-blue-600">MEN'S FASHION</span>
      </h1>
      <p className="text-gray-700 text-lg">
        Flat <span className="text-purple-600 font-bold">35% – 70% Off</span> on all trending collections. Hurry!
      </p>
      <div className="space-x-4 mt-6">
        <Link
          to="/shop"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
        >
          🛒 Shop Now
        </Link>
        <Link
          to="/read-more"
          className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full hover:scale-105 transition"
        >
          📘 Read More
        </Link>
      </div>
    </div>

    {/* Image */}
    <div className="w-full flex justify-center animate-fade-in">
      <img
        src="https://via.placeholder.com/400x450.png?text=Model"
        alt="Hero Product"
        className="rounded-2xl shadow-xl max-h-[450px] w-auto object-cover"
      />
    </div>
  </div>
</section>

      {/* Product Grid */}
      {
        isLoading ? <LoaderIcon /> : (
          <section className="max-w-7xl  mx-auto px-4 py-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Latest Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.products.map(product => (
                <ProductCard 
                key={product._id}
                name={product.name} 
                category={product.category} 
                price={product.price} 
                ratings={product.ratings || 0} 
                photo={product.photo} 

                />
              ))}
            </div>
          </section>
        )
      }
    </div>
  );
};

export default Home;
