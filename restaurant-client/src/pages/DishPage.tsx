import './css/DishPage.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dishCategoryId: number;
}

const DishPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dish, setDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/dishes/${id}`, { withCredentials: true })
      .then(res => setDish(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await axios.post('/api/cart', {
      userId: user.id,
      dishId: dish?.id,
      quantity
    }, { withCredentials: true });
    setMessage('Added to cart!');
  };

  if (!dish) return <div className="container">Loading...</div>;

  return (
    <div className="dish-page">
      <h1>{dish.name}</h1>
      <img src={dish.imageUrl} alt={dish.name} />
      <p>{dish.description}</p>
      <p>Price: ${dish.price}</p>

      <input
        type="number"
        value={quantity}
        min={1}
        onChange={e => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default DishPage;
