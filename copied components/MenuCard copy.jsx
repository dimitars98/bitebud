import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function MenuCard({ id, image, name, ingredients, price }) {
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 10)); // Max 10
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1)); // Min 1

  return (
    <div className="relative bg-[var(--color-grey-900)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer duration-300 ease p-4 max-w-xs">
      <div className="overflow-hidden rounded-xl mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      <h4 className="text-white font-semibold text-lg mb-1">{name}</h4>
      <p className="text-gray-400 text-sm mb-2">{ingredients}</p>
      <div className="text-yellow-400 font-bold text-lg">{price} MKD</div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-full">
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
        </div>
      </div>

      <button
        onClick={() => addToCart({ id, name, image, price, quantity })}
        className="flex items-center absolute bottom-6 right-6 bg-yellow-400 p-2 rounded-full shadow hover:bg-yellow-300 transition-all duration-200 ease-in cursor-pointer"
      >
        <span class="material-symbols-rounded">add_2</span>
      </button>
      {/* <button
        onClick={() => addToCart({ id, name, image, price, quantity })}
        className="flex items-center justify-center w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-300 transition-all"
      >
        <span className="material-symbols-rounded mr-2">add_shopping_cart</span>
        Add to Cart
      </button> */}
    </div>
  );
}
