import './css/CartPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PayPalCheckout from '../components/PayPalCheckout';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: number;
  dishId: number;
  quantity: number;
  userId: number;
}

interface Dish {
  id: number;
  nameEn: string;
  nameRu: string;
  nameAz: string;
  price: number;
  imageUrl?: string;
}

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const { setCartCount, setTotalPrice } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/cart/${user.id}`, { withCredentials: true }).then(res => setItems(res.data));
    axios.get('/api/dishes', { withCredentials: true }).then(res => setDishes(res.data));
  }, [user]);

  const getDish = (id: number) => dishes.find(d => d.id === id);

  const getDishName = (dish: Dish) => {
    if (!dish) return '';
    if (i18n.language === 'ru') return dish.nameRu || dish.nameEn;
    if (i18n.language === 'az') return dish.nameAz || dish.nameEn;
    return dish.nameEn;
  };

  const total = items.reduce((sum, item) => {
    const dish = getDish(item.dishId);
    return sum + (dish ? dish.price * item.quantity : 0);
  }, 0);

  useEffect(() => {
    setTotalPrice(total);
  }, [total]);

  const updateQuantity = async (dishId: number, delta: number) => {
    if (!user) return;
    if (!items.some(i => i.dishId === dishId)) return;

    try {
      const response = await axios.put('/api/cart/update-quantity', {
        userId: user.id,
        dishId,
        delta,
      }, { withCredentials: true });

      setCartCount(response.data.totalQuantity);

      const updatedItems = await axios.get(`/api/cart/${user.id}`, { withCredentials: true });
      setItems(updatedItems.data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleFakePayment = async () => {
    if (!user || items.length === 0) return;

    try {
      const orderItems = items.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        price: getDish(item.dishId)?.price || 0
      }));

      const order = {
        userId: user.id,
        total: total,
        orderItems
      };

      await axios.post('/api/orders', order, { withCredentials: true });
      await axios.delete(`/api/cart/clear/${user.id}`, { withCredentials: true });
      setItems([]);
      setCartCount(0);
      setTotalPrice(0);
      toast.success('Ваш заказ успешно оформлен!');
      navigate('/orders');
    } catch (error) {
      toast.error('Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="cart-container">
      <h1>{t('cart-title')}</h1>
      <div className="cart-grid">
        {items.map(item => {
          const dish = getDish(item.dishId);
          if (!dish) return null;
          return (
            <div key={item.id} className="cart-item">
              <img
                src={dish.imageUrl || '/food-restaurant-icon.svg'}
                alt={getDishName(dish)}
                className="dish-image"
              />
              <h3 className="dish-name">{getDishName(dish)}</h3>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.dishId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dishId, 1)}>+</button>
              </div>
              <p className="item-total">{t('cart-total')}: {dish.price * item.quantity} $</p>
            </div>
          );
        })}
      </div>
      <p className="cart-total">{t('cart-total')}: {total.toFixed(2)} $</p>
      {items.length > 0 && (
        <div className="payment-section">
          <PayPalCheckout />
          <button onClick={handleFakePayment} className="manual-pay-button">{t('pay-now')}</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
