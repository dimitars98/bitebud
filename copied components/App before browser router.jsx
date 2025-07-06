import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Restaurant from "./pages/Restaurant";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <Router>
      <div className="bg-white min-h-screen relative flex flex-col">
        <Navbar onCartClick={toggleCart} />

        <main className="pt-4 px-4 sm:px-6 md:px-8 lg:px-[400px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
          </Routes>
        </main>

        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

        {isCartOpen && (
          <div
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black bg-opacity-25"
          />
        )}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
