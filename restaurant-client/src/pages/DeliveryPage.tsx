import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './css/DeliveryPage.css';

const DeliveryPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (!orderId) return;

    axios.put(`/api/orders/${orderId}/status`, `"Delivering"`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);

          axios.put(`/api/orders/${orderId}/status`, `"Delivered"`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }).then(() => {
            navigate(`/receipt/${orderId}`);
          });

          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="delivery-container">
      <h1>{t('order-on-the-way')}</h1>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}{t('percent')}</p>
    </div>
  );
};

export default DeliveryPage;
