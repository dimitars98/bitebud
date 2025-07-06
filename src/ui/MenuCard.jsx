import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuCard({
  id,
  image,
  name,
  ingredients,
  price,
  cartIsOpen,
}) {
  const [showQuantity, setShowQuantity] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, cartItems, removeFromCart } = useCart();

  useEffect(() => {
    const itemInCart = cartItems.find((item) => item.id === id);

    if (itemInCart) {
      setQuantity(itemInCart.quantity);
      setShowQuantity(true);
    } else {
      setQuantity(1);
      setShowQuantity(false);
    }
  }, [cartItems, id]);

  // Reset quantity controls when cart drawer closes (optional)
  useEffect(() => {
    if (!cartIsOpen) {
      // You can decide to keep or reset when drawer closes, up to you
      setShowQuantity(false);
      setQuantity(1);
    }
  }, [cartIsOpen]);

  const handleAdd = () => {
    addToCart({ id, name, image, price, quantity: 1 });
    setQuantity(1);
    setShowQuantity(true);
  };

  const increaseQty = () => {
    const newQty = Math.min(quantity + 1, 10);
    setQuantity(newQty);
    addToCart({ id, name, image, price, quantity: newQty });
  };

  const decreaseQty = () => {
    if (quantity <= 1) {
      // Actively remove from cart
      removeFromCart(id);

      // Immediately reset local state
      setShowQuantity(false);
      setQuantity(1);
      return;
    }

    const newQty = quantity - 1;
    setQuantity(newQty);
    addToCart({ id, name, image, price, quantity: newQty });
  };

  return (
    <div className="relative bg-[var(--color-grey-900)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer duration-300 ease p-4 max-w-xs">
      <div className="overflow-hidden rounded-xl mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-24 md:h-48 object-cover"
          loading="lazy"
        />
      </div>
      <h4 className="text-white font-semibold text-lg mb-1">{name}</h4>
      <p className="text-gray-400 text-sm mb-4">{ingredients}</p>
      <div className="text-yellow-400 font-bold text-lg mb-6">{price} MKD</div>

      {/* Controls Section */}
      <div className="absolute bottom-6 right-6">
        <AnimatePresence mode="wait">
          {!showQuantity ? (
            <motion.button
              key="add"
              onClick={handleAdd}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-yellow-400 p-2 rounded-full shadow hover:bg-yellow-300 transition-all duration-200 ease-in cursor-pointer"
            >
              <span className="material-symbols-rounded">add_2</span>
            </motion.button>
          ) : (
            <motion.div
              key="qty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full"
            >
              <button
                onClick={decreaseQty}
                className="text-white text-lg px-2 hover:text-yellow-400 cursor-pointer"
              >
                –
              </button>
              <span className="text-white font-medium">{quantity}</span>
              <button
                onClick={increaseQty}
                className="text-white text-lg px-2 hover:text-yellow-400 cursor-pointer"
              >
                +
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
