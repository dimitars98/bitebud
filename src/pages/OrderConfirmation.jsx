import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        navigate(`/order-tracking/${orderId}`);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="mb-6">Your order has been placed successfully.</p>
      <p>Redirecting to your order status...</p>
    </div>
  );
}
