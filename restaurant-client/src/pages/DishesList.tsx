import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './css/DishesList.css';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

interface Dish {
  id: number;
  nameEn: string;
  nameRu: string;
  nameAz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionAz: string;
  price: number;
  dishCategoryId: number;
  imageUrl: string;
}

function getDishName(dish: Dish, lang: string) {
  if (lang === "ru" && dish.nameRu) return dish.nameRu;
  if (lang === "az" && dish.nameAz) return dish.nameAz;
  return dish.nameEn || "";
}

function getDishDescription(dish: Dish, lang: string) {
  if (lang === "ru" && dish.descriptionRu) return dish.descriptionRu;
  if (lang === "az" && dish.descriptionAz) return dish.descriptionAz;
  return dish.descriptionEn || "";
}

const DishesList: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();
  const { setCartCount } = useCart();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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
    if (!user) {
      toast.info('Please log in to add items to cart.');
      navigate('/login');
      return;
    }

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
            <Link to={`/dish/${dish.id}`} className="dish-card-link dish-content">
              <img src={dish.imageUrl} alt={getDishName(dish, i18n.language)} className="dish-image" />
              <h2>{getDishName(dish, i18n.language)}</h2>
              <p>{getDishDescription(dish, i18n.language)}</p>
              <p>Price: {dish.price} ₼</p>
            </Link>
            <button onClick={() => addToCart(dish.id)} className="add-button">Add to Cart</button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default DishesList;
