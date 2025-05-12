import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './css/DishesList.css';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  dishCategoryId: number;
  imageUrl: string;
}

const DishesList: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { setCartCount } = useCart();

  useEffect(() => {
    axios.get('/api/dishes', { withCredentials: true })
      .then(response => {
        setDishes(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dishes:', err);
        setError('Failed to fetch dishes');
        setLoading(false);
      });
  }, []);

  const addToCart = async (dishId: number) => {
    if (!user) return;
  
    try {
      const response = await axios.post('/api/cart', {
        userId: user.id,
        dishId,
        quantity: 1
      }, { withCredentials: true });
  
      setCartCount(response.data.totalQuantity);
  
      toast.success("Dish added to cart!", {
        autoClose: 2000,
        pauseOnHover: true,
        hideProgressBar: false,
        icon: () => <span>🛒</span>
      });
      
    } catch (err) {
      toast.error("Failed to add dish.", {
        autoClose: 2000
      });
    }
  };
  

  return (
    <div>
      <h1 className="page-title">Dishes</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="dish-grid">
        {dishes.map(dish => (
          <div key={dish.id} className="dish-card">
            {dish.imageUrl && (
              <img src={dish.imageUrl} alt={dish.name} className="dish-image" />
            )}
            <h2>{dish.name}</h2>
            <p>{dish.description}</p>
            <p>Price: {dish.price} ₼</p>
            <button onClick={() => addToCart(dish.id)} className="add-button">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default DishesList;
