import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const reviews = [
    { name: 'Anna K.', dish: 'Truffle Pasta', rating: 5, comment: 'Amazing flavor and perfectly cooked!' },
    { name: 'Leo M.', dish: 'Grilled Salmon', rating: 4, comment: 'Very fresh, could use more lemon.' },
    { name: 'Sophia B.', dish: 'Chocolate Lava Cake', rating: 5, comment: "Best dessert I've ever had!" }
  ];

  return (
    <>
      <div className="container">
        <h1>{t('welcome')}</h1>
        <p>{t('home-description')}</p>

        <div style={{ margin: '2rem 0' }}>
          <img
            src="/schnellherd.png"
            alt="Restaurant Logo"
            style={{ maxWidth: '180px' }}
          />
        </div>

        <button onClick={() => navigate('/dishes')}>{t('viewMenu')}</button>

        <h2 style={{ marginTop: '3rem' }}>{t('reviews')}</h2>
        <ul className="dish-list">
          {reviews.map((r, idx) => (
            <li key={idx} className="dish-card" style={{ width: '300px' }}>
              <h3>{r.name}</h3>
              <p><strong>Ordered:</strong> {r.dish}</p>
              <p><strong>Rating:</strong> {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              <p><em>"{r.comment}"</em></p>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Home;
