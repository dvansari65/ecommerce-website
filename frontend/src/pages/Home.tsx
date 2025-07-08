import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="relative h-screen bg-[#0f0c29] overflow-hidden text-white flex items-center justify-center">
      {/* Glowing Blue Light Top-Left */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Central Glow (Bottom-Center) */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-[#b075f5]/30 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Content */}
      <div className="z-10 text-center px-4">
        <h1 className="text-4xl font-bold">Shop Smarter. Live Better.</h1>
        <p className="text-gray-300 mt-4 max-w-xl mx-auto">
          Discover unbeatable deals, premium products, and lightning-fast delivery — all in one seamless shopping experience.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link to="shop" className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition">
            Start Shopping
          </Link>
          <button className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition">
            Explore Categories
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
