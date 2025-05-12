import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const reviews = [
    { name: 'Anna K.', dish: 'Truffle Pasta', rating: 5, comment: 'Amazing flavor and perfectly cooked!' },
    { name: 'Leo M.', dish: 'Grilled Salmon', rating: 4, comment: 'Very fresh, could use more lemon.' },
    { name: 'Sophia B.', dish: 'Chocolate Lava Cake', rating: 5, comment: 'Best dessert I’ve ever had!' },
  ];

  return (
    <>
      <div className="container">
        <h1>Welcome to Our Restaurant</h1>
        <p>
          Experience the taste of tradition and innovation. We serve premium dishes made from fresh,
          local ingredients with love and care.
        </p>

        <div style={{ margin: '2rem 0' }}>
          <img
            src="/schnellherd.png"
            alt="Restaurant Logo"
            style={{ maxWidth: '180px' }}
          />
        </div>

        <button onClick={() => navigate('/dishes')}>View Menu</button>

        <h2 style={{ marginTop: '3rem' }}>Customer Reviews</h2>
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
