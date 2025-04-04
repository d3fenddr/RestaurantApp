// src/pages/DishesList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the type for a dish
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
    // Replace with your API endpoint if not using a proxy
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
    return <div>Loading dishes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Dishes</h1>
      <ul>
        {dishes.map(dish => (
          <li key={dish.id}>
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
