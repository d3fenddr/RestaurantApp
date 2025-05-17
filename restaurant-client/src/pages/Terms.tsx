import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1>{t('terms-title')}</h1>
      <p>{t('terms-description')}</p>
    </div>
  );
};

export default Terms;
