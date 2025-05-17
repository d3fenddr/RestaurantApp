import './css/DishPage.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Dish {
  id: number;
  nameEn: string;
  nameRu: string;
  nameAz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionAz: string;
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
  const { i18n, t } = useTranslation();

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

  const getDishName = () => {
    if (i18n.language === 'ru') return dish.nameRu || dish.nameEn;
    if (i18n.language === 'az') return dish.nameAz || dish.nameEn;
    return dish.nameEn;
  };

  const getDishDescription = () => {
    if (i18n.language === 'ru') return dish.descriptionRu || dish.descriptionEn;
    if (i18n.language === 'az') return dish.descriptionAz || dish.descriptionEn;
    return dish.descriptionEn;
  };

  return (
    <div className="dish-page">
      <h1>{getDishName()}</h1>
      <img src={dish.imageUrl} alt={getDishName()} />
      <p>{getDishDescription()}</p>
      <p>{t('price-label')}: ${dish.price}</p>

      <input
        type="number"
        value={quantity}
        min={1}
        onChange={e => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleAddToCart}>{t('add-to-cart')}</button>
      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default DishPage;
