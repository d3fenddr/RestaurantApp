import React from 'react';
import RestaurantMap from '../components/RestaurantMap';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>{t('contact-title')}</h1>
      <p>{t('contact-email')}</p>
      <p>{t('contact-phone1')}</p>
      <p>{t('contact-phone2')}</p>
      <p>{t('contact-address')}</p>

      <div style={{ marginTop: '1.5rem' }}>
        <RestaurantMap />
      </div>
    </div>
  );
};

export default Contact;
