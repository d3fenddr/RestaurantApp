import React from 'react';
import fallbackImage from '/food-restaurant-icon.svg';
import '../css/DishesList.css';

interface DishCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAddToCart: () => void;
}

const DishCard: React.FC<DishCardProps> = ({ name, description, price, imageUrl, onAddToCart }) => {
  return (
    <div className="dish-card">
      <img
        src={imageUrl || fallbackImage}
        alt={name}
        className="dish-image"
        style={{ maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Price: {price} $</p>
      <button onClick={onAddToCart} className="add-button">
        Add to Cart
      </button>
    </div>
  );
};

export default DishCard;
