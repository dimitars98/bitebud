import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Restaurant from "./pages/Restaurant";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer"; // Make sure this is correctly imported

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev); // Toggle the cart state
  };

  return (
    <Router>
      <div className="bg-white min-h-screen relative">
        <Navbar onCartClick={toggleCart} />

        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
          </Routes>
        </main>

        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

        {/* Optional: Backdrop to close the cart */}
        {isCartOpen && <div onClick={closeCart} className="fixed inset-0 " />}

        <Footer />
      </div>
    </Router>
  );
}

export default App;
