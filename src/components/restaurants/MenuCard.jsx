import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "../../contexts/CurrencyContext";

export default function MenuCard({
  id,
  image,
  name,
  description,
  price,
  cartIsOpen,
  restaurantId,
  partnerId,
  onClick,
}) {
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart();
  const itemInCart = cartItems.find((item) => item.id === id);

  const [showQuantity, setShowQuantity] = useState(!!itemInCart);
  const [quantity, setQuantity] = useState(itemInCart?.quantity || 1);

  const { formatCurrency } = useCurrency();

  const handleAdd = () => {
    addToCart(
      { id, name, image, price, quantity: 1, restaurantId, partnerId },
      restaurantId,
      partnerId,
    );
    setQuantity(1);
    setShowQuantity(true);
  };

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

  useEffect(() => {
    if (!cartIsOpen && !cartItems.find((item) => item.id === id)) {
      setShowQuantity(false);
      setQuantity(1);
    }
  }, [cartIsOpen, cartItems, id]);

  return (
    <div
      onClick={onClick}
      className="relative bg-(--bg-main) dark:bg-(--brand-bg-primary) rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 ease-in-out  cursor-pointer p-4 max-w-xs"
    >
      <div className="overflow-hidden rounded-xl mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      <h4 className="dark:text-white text-(--text-secondary) font-semibold text-lg mb-1">
        {name}
      </h4>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="text-(--brand) font-bold text-lg mb-6">
        {formatCurrency(price)}
      </div>

      {/* Controls Section */}
      <div className="absolute bottom-6 right-6">
        <AnimatePresence mode="wait">
          {!showQuantity ? (
            <motion.button
              key="add"
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-(--brand) p-2 rounded-full shadow hover:bg-(--brand-hover) transition-all duration-200 ease-in cursor-pointer"
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
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseQty(id); // quantity/showQuantity follow the cart (effect below)
                }}
                className="text-white text-lg px-2 hover:text-(--brand) cursor-pointer"
              >
                –
              </button>
              <span className="text-white font-medium">{quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increaseQty(id);
                }}
                className="text-white text-lg px-2 hover:text-(--brand) cursor-pointer"
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
