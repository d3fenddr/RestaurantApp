import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PayPalCheckout = () => {
  const { totalPrice, setCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <PayPalScriptProvider options={{
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID!,
      currency: "USD",
      components: "buttons",
    }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_, actions) => {
          return actions.order!.create({
            intent: "CAPTURE",
            purchase_units: [{
              amount: {
                currency_code: "USD",
                value: totalPrice.toFixed(2),
              },
            }],
          });
        }}
        onApprove={async (_, actions) => {
          const details = await actions.order!.capture();
          const name = details.payer?.name?.given_name || "buyer";

          alert(`Payment was successful, ${name}!`);

          if (user) {
            try {
              const cartRes = await axios.get(`/api/cart/${user.id}`, { withCredentials: true });
              const cartItems = cartRes.data;

              const order = {
                userId: user.id,
                total: totalPrice,
                orderItems: cartItems.map((item: any) => ({
                  dishId: item.dishId,
                  quantity: item.quantity,
                  price: item.price || 0
                }))
              };

              await axios.post('/api/orders', order, { withCredentials: true });
              await axios.delete(`/api/cart/clear/${user.id}`, { withCredentials: true });
              setCartCount(0);
              navigate('/orders');
            } catch (err) {
              console.error("Error creating order:", err);
            }
          }
        }}
        onError={(err) => {
          console.error("Payment error:", err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
