
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
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="space-y-4 animate-fade-down">
            <h3 className="text-blue-600 text-xl font-semibold">Season Sale</h3>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">MEN'S FASHION</h1>
            <p className="text-gray-600 text-lg">Min. 35–70% Off</p>
            <div className="space-x-4">
              <Link
                to="/shop"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
              >
                Shop Now
              </Link>
              <Link
                to="/read-more"
                className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded transition"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="w-full flex justify-center">
            <img
              src="https://via.placeholder.com/400x450.png?text=Model"
              alt="Hero Product"
              className="rounded-lg shadow-lg max-h-[450px] w-auto object-cover animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      {
        isLoading ? <LoaderIcon /> : (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Popular Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.products.map(product => (
                <ProductCard 
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
