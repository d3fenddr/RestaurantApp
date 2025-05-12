import React from 'react';
import RestaurantMap from '../components/RestaurantMap';

const Contact: React.FC = () => {
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>Contact Us</h1>
      <p>Email: support@schnellherd.com</p>
      <p>Phone 1: +994 (051) 441-4944</p>
      <p>Phone 2: +994 (051) 394-4224</p>
      <p>Address: 70 Koroğlu Rəhimov, Bakı 1009</p>

      <div style={{ marginTop: '1.5rem' }}>
        <RestaurantMap />
      </div>
    </div>
  );
};

export default Contact;
