import { useSelector } from "react-redux";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose, onTriggerLogin }) {
  const user = useSelector((state) => state.auth.user);

  const { cartItems, removeFromCart } = useCart();

  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`flex justify-between flex-col fixed right-0 top-0 h-full w-screen md:w-100 bg-white dark:bg-gray-800 dark:text-white shadow-lg transition-transform duration-300 z-50 md:rounded-tl-2xl md:rounded-bl-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 flex items-center justify-center"
            >
              <span className="material-symbols-rounded text-2xl leading-none">
                close
              </span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.price} MKD x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => {
            if (!user) {
              onTriggerLogin(); // Call parent prop to open login modal
            } else {
              onClose();
              navigate("checkout");
            }
          }}
          className="w-full mt-6 bg-yellow-400 text-black font-semibold py-3 rounded-xl hover:bg-yellow-300 transition-all"
        >
          Order Now
        </button>
      </div>
    </>
  );
}
