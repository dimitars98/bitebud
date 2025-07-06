import React from "react";

export default function CartDrawer({ isOpen, onClose }) {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-100 bg-white shadow-lg transition-transform duration-300 z-50 rounded-tl-2xl rounded-bl-xl ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="mr-2 mt-2 p-3 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xl cursor-pointer transition-all duration-300"
          >
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <p className="text-gray-500">Cart items go here...</p>
      </div>
    </div>
  );
}
