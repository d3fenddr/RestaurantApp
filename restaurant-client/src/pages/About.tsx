import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1>{t('about-title')}</h1>
      <p>{t('about-description')}</p>
      <h2>{t('about-team-title')}</h2>
      <p>{t('about-team-description')}</p>
    </div>
  );
};

export default About;
