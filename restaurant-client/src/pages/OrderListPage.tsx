import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './css/OrderListPage.css';

interface OrderItem {
  dishId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderDate: string;
  total: number;
  status: string;
  orderItems: OrderItem[];
}

const OrderListPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/orders/user/${user.id}`, { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, [user]);

  const goToReceipt = (id: number) => navigate(`/receipt/${id}`);
  const goToDelivery = (id: number) => navigate(`/delivery/${id}`);

  return (
    <div className="order-list-container">
      <h1>My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total:</strong> {order.total.toFixed(2)} $</p>
          <p><strong>Status:</strong> {order.status}</p>
          <h4>Dishes:</h4>
          <ul>
            {order.orderItems.map((item, idx) => (
              <li key={idx}>
                {item.name} — {item.quantity} × {item.price.toFixed(2)} $ = {(item.price * item.quantity).toFixed(2)} $
              </li>
            ))}
          </ul>
          {order.status === 'Pending' && (
            <button onClick={() => goToDelivery(order.id)}>Delivery</button>
          )}
          {order.status === 'Delivered' && (
            <button onClick={() => goToReceipt(order.id)}>Receipt</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderListPage;
