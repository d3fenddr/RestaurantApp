import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DishesList from './pages/DishesList';
import DishPage from './pages/DishPage';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<DishesList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-user" element={<Profile />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
