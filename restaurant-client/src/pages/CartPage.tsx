import './css/CartPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    setMessage('Order placed successfully!');
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul className="dish-list">
          {items.map(item => {
            const dish = getDish(item.dishId);
            return (
              <li key={item.id} className="dish-card">
                <h3>{dish?.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${dish ? dish.price * item.quantity : 0}</p>
              </li>
            );
          })}
        </ul>
      )}

      <h2>Total: ${total.toFixed(2)}</h2>
      {items.length > 0 && (
        <button onClick={handleOrder}>Place Order</button>
      )}
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default CartPage;
