import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useSelector } from "react-redux";

export default function Navbar({
  onCartClick,
  onLoginClick,
  onSignUpClick,
  isDarkTheme,
  setIsDarkTheme,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const toggleTheme = function () {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <nav className="h-20 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 px-4 sm:px-6 py-4">
      {/* Top nav row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-500 sm:ml-16 lg:ml-[400px]"
        >
          SkopjeEats
        </Link>

        {/* Center: Search bar (hidden on mobile) */}
        <div className="hidden sm:block transition-all duration-300 w-70 focus-within:w-100 px-4">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              search
            </span>
            <input
              type="search"
              placeholder="Search restaurants..."
              className="border border-gray-400 focus:border-2 placeholder-gray-500 dark:text-white focus:border-yellow-500 outline-none py-3 pl-12 pr-6 w-full rounded-4xl transition-all duration-300 ease-in"
            />
          </div>
        </div>

        {/* Right: Nav actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop nav links */}
          <ul className="hidden sm:flex items-center space-x-4 text-gray-900">
            <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
            <li className="hover:text-yellow-500 cursor-pointer transition-all duration-200 ease-in dark:text-white">
              Restaurants
            </li>
            <li
              onClick={onCartClick}
              className="hover:text-yellow-500 cursor-pointer transition-all duration-200 ease-in"
            >
              <span className="material-symbols-rounded dark:text-white">
                shopping_cart
              </span>
            </li>
          </ul>

          {/* Auth buttons */}
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={onLoginClick}
              className="text-sm px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200 ease-in cursor-pointer dark:text-white"
            >
              Log In
            </button>
            <button
              onClick={onSignUpClick}
              className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200 ease-in cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile icons: Cart + Hamburger */}
          <div className="sm:hidden flex items-center space-x-2">
            <button onClick={onCartClick}>
              <span className="material-symbols-rounded text-gray-800 text-2xl">
                shopping_cart
              </span>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <span className="material-symbols-rounded text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pb-6 space-y-4 bg-white">
          {/* Search bar */}
          <div className="relative w-full">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              search
            </span>
            <input
              type="search"
              placeholder="Search restaurants..."
              className="w-full border border-gray-400 focus:border-2 focus:border-yellow-500 outline-none py-3 pl-12 pr-6 rounded-4xl"
            />
          </div>

          {/* Restaurants link */}
          <div className="text-gray-900">
            <button className="hover:text-yellow-500 transition">
              Restaurants
            </button>
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onLoginClick}
              className="text-sm px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition cursor-pointer"
            >
              Log In
            </button>
            <button className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
