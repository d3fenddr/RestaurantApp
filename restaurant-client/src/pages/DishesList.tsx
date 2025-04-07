// src/pages/DishesList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    axios.get('/api/dishes')
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

  if (loading) {
    return <div className="container"><p>Loading dishes...</p></div>;
  }

  if (error) {
    return <div className="container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="container">
      <h1>Dishes</h1>
      <ul className="dish-list">
        {dishes.map(dish => (
          <li key={dish.id} className="dish-card">
            <h3>{dish.name}</h3>
            <img src={dish.imageUrl} alt={dish.name} width={150} />
            <p>{dish.description}</p>
            <p>Price: ${dish.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishesList;
