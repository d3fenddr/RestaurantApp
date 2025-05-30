import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './pages/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DishesList from './pages/DishesList';
import DishPage from './pages/DishPage';
import CartPage from './pages/CartPage';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import OrderListPage from './pages/OrderListPage';
import DeliveryPage from './pages/DeliveryPage';
import ReceiptPage from './pages/ReceiptPage';

import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

export default function App() {
  const { user } = useAuth();
  const { setCartCount } = useCart();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`/api/cart/${user.id}`, { withCredentials: true });
        const total = response.data.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (error) {
        console.error("Failed to load cart count", error);
      }
    };
    fetchCartCount();
  }, [user, setCartCount]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dishes" element={<DishesList />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/delivery/:orderId" element={<DeliveryPage />} />
        <Route path="/receipt/:orderId" element={<ReceiptPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </>
  );
}
