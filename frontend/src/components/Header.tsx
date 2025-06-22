import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUserCircle, FaSignInAlt, FaBoxOpen, FaUserShield } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import './Header.css';

const isLoggedIn = false; // Replace with real auth logic
const isAdmin = false; // Replace with real admin check
const cartCount = 0; // Replace with real cart count
const wishlistCount = 0; // Replace with real wishlist count

const Header: React.FC = () => {
  return (
    <nav className="header saas-navbar">
      <div className="header-container saas-navbar-container">
        {/* Logo */}
        <div className="header-left saas-navbar-left">
          <Link to="/" className="header-logo saas-logo">
            Shopit
          </Link>
          {/* Categories (placeholder) */}
          <div className="header-categories saas-categories">
            <Link to="/products">All Products</Link>
            <Link to="/category/electronics">Electronics</Link>
            <Link to="/category/clothing">Clothing</Link>
            <Link to="/category/books">Books</Link>
          </div>
        </div>
        {/* Search Bar */}
        <div className="header-center saas-navbar-center">
          <form className="header-search saas-search">
            <input
              type="text"
              placeholder="Search products..."
              className="header-search-input saas-search-input"
            />
            <button type="submit" className="header-search-button saas-search-button">
              <FiSearch />
            </button>
          </form>
        </div>
        {/* Right Side: Cart, Wishlist, User */}
        <div className="header-right saas-navbar-right">
          <Link to="/cart" className="header-link saas-link">
            <FaShoppingCart />
            {cartCount > 0 && <span className="icon-navbar-badge">{cartCount}</span>}
          </Link>
          <Link to="/wishlist" className="header-link saas-link">
            <FaHeart />
            {wishlistCount > 0 && <span className="icon-navbar-badge">{wishlistCount}</span>}
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" className="header-link saas-link">
                <FaBoxOpen />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="header-link saas-link">
                  <FaUserShield />
                </Link>
              )}
              <Link to="/profile" className="header-link saas-link">
                <FaUserCircle />
              </Link>
            </>
          ) : (
            <Link to="/login" className="header-link saas-link">
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header; 