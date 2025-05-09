import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

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
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/dishes', { withCredentials: true })
      .then(response => {
        setDishes(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dishes:', err);
        setError('Error fetching dishes');
        setLoading(false);
      });
  }, []);

  const addToCart = async (dishId: number) => {
    if (!user) return navigate('/login');
    await axios.post('/api/cart', {
      userId: user.id,
      dishId,
      quantity: 1
    }, { withCredentials: true });
  };

  if (loading) {
    return <div className="container"><p>Loading dishes...</p></div>;
  }

  if (error) {
    return <div className="container"><p className="error">{error}</p></div>;
  }

  return (
    <>
      <div className="container">
        <h1>Dishes</h1>
        <ul className="dish-list">
          {dishes.map(dish => (
            <li key={dish.id} className="dish-card">
              <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/dish/${dish.id}`)}>
                {dish.name}
              </h3>
              <img
                src={dish.imageUrl}
                alt={dish.name}
                width={150}
                onClick={() => navigate(`/dish/${dish.id}`)}
                style={{ cursor: 'pointer' }}
              />
              <p>{dish.description}</p>
              <p>Price: ${dish.price}</p>
              <button onClick={() => addToCart(dish.id)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default DishesList;
