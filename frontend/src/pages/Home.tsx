

import { useLatestProductsQuery } from '../redux/api/productApi';
import canonImage from "../assets/canon2.png"
import { useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
const Home = () => {
  const { data } = useLatestProductsQuery()
  useEffect(() => {
    console.log("data", data)
  }, [])
  return (
    <div >
      <main className='w-full bg-purple-100 h-screen pt-20  overflow-y-hidden'>
      <section className="relative w-full h-[400px]">
        <img
          src={canonImage}
          alt="Hero"
          className="absolute  inset-0 w-full h-full object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black/30 rounded-md flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-4xl font-bold">Welcome to ShopIt</h2>
          <p className="mt-2 text-lg">Experience the best in online shopping.</p>
          <Link to="/shop" className="mt-4 bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
            Start Shopping
          </Link>
        </div>
      </section>
      <section className="relative pb-2 w-full min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#E8EAFE] via-white to-[#D3CCFF] overflow-hidden px-6">
      {/* Background Accent */}
      <motion.div
        className="absolute w-96 h-96 bg-[#7F75E1] rounded-full opacity-20 blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1.5 }}
      />

      {/* Text Content */}
      <motion.div
        className="text-center z-10 max-w-3xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight drop-shadow-sm">
          Discover the <span className="text-[#7F75E1]">latest trends</span>, <br />
          <span className="text-[#7F75E1]">top brands</span>, and unbeatable prices —
        </h1>
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-700 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          only at <span className="text-[#7F75E1] font-bold">ShopIt</span>
        </motion.p>
      </motion.div>
    </section>
      </main>
    </div>

  );
};

export default Home;
