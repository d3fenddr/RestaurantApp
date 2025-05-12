import './css/CartPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

interface CartItem {
  id: number;
  dishId: number;
  quantity: number;
  userId: number;
}

interface Dish {
  id: number;
  name: string;
  price: number;
}

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const { setCartCount } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/cart/${user.id}`, { withCredentials: true }).then(res => setItems(res.data));
    axios.get('/api/dishes', { withCredentials: true }).then(res => setDishes(res.data));
  }, [user]);

  const getDish = (id: number) => dishes.find(d => d.id === id);

  const total = items.reduce((sum, item) => {
    const dish = getDish(item.dishId);
    return sum + (dish ? dish.price * item.quantity : 0);
  }, 0);

  const updateQuantity = async (dishId: number, delta: number) => {
    if (!user) return;

    try {
      const response = await axios.put('/api/cart/update-quantity', {
        userId: user.id,
        dishId,
        delta,
      }, { withCredentials: true });

      setCartCount(response.data.totalQuantity);
      const updatedItems = await axios.get(`/api/cart/${user.id}`, { withCredentials: true });
      setItems(updatedItems.data);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleOrder = async () => {
    if (!user) return;

    const order = {
      userId: user.id,
      total,
      orderItems: items.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        price: getDish(item.dishId)?.price || 0
      }))
    };

    await axios.post('/api/orders', order, { withCredentials: true });
    await axios.delete(`/api/cart/clear/${user.id}`, { withCredentials: true });
    setItems([]);
    setCartCount(0);
    setMessage('Order placed successfully!');
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {message && <p className="success-message">{message}</p>}
      <div className="cart-grid">
        {items.map(item => {
          const dish = getDish(item.dishId);
          if (!dish) return null;
          return (
            <div key={item.id} className="cart-item">
              <h3>{dish.name}</h3>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.dishId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dishId, 1)}>+</button>
              </div>
              <p>Price: {dish.price * item.quantity} ₼</p>
            </div>
          );
        })}
      </div>
      <h3>Total: {total.toFixed(2)} ₼</h3>
      {items.length > 0 && (
        <button className="order-button" onClick={handleOrder}>Place Order</button>
      )}
    </div>
  );
};

export default CartPage;
