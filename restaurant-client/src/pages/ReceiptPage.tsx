import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/ReceiptPage.css';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderDate: string;
  total: number;
  status: string;
  orderItems: OrderItem[];
}

const ReceiptPage: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    axios.get(`/api/orders/${orderId}`, { withCredentials: true })
      .then(res => setOrder(res.data));
  }, [orderId]);

  return (
    <div className="receipt-container">
      <h1>Order receipt</h1>
      {order ? (
        <div className="receipt-card">
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <h3>Dishes:</h3>
          <ul>
            {order.orderItems.map((item, idx) => (
              <li key={idx}>
                {item.name} — {item.quantity} pcs. × {item.price.toFixed(2)} $ = {(item.price * item.quantity).toFixed(2)} $
              </li>
            ))}
          </ul>
          <h2>Total: {order.total.toFixed(2)} $</h2>
        </div>
      ) : (
        <p>Loading receipt...</p>
      )}
    </div>
  );
};

export default ReceiptPage;