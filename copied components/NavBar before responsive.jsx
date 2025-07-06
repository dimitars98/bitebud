import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ onCartClick }) {
  return (
    <nav
      className="relative h-20 border-b border-gray-200
      flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50"
    >
      <Link to="/" className="ml-[400px] text-2xl font-bold text-yellow-500">
        SkopjeEats
      </Link>
      <div className="relative w-64 focus-within:w-[26rem] transition-all duration-300">
        <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          search
        </span>
        <input
          type="search"
          placeholder="Search restaurants..."
          className="border border-gray-400 focus:border-2 focus:border-yellow-500 outline-none
          py-3 pl-12 pr-6 w-64 focus:w-100 transition-all duration-300 rounded-4xl"
        />
      </div>
      <ul className="flex space-x-6 text-gray-900 mr-[400px]">
        <li className="hover:text-yellow-500 cursor-pointer transition duration-200 ease-in">
          Restaurants
        </li>
        <li
          className="hover:text-yellow-500 cursor-pointer transition duration-200 ease-in"
          onClick={onCartClick}
        >
          <span className="material-symbols-rounded">shopping_cart</span>
        </li>
      </ul>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex space-x-3">
        <button className="text-sm px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition cursor-pointer">
          Log In
        </button>
        <button className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer">
          Sign Up
        </button>
      </div>
    </nav>
  );
}
