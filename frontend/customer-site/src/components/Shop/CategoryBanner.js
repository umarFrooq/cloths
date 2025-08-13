import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import './CategoryBanner.css';

const CategoryBanner = ({ category }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  if (!category) {
    return null;
  }

  const categoryName = currentLang === 'ar' ? category.name_ar : category.name_en;
  const bannerStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${category.imageUrl || 'https://via.placeholder.com/1200x300/6c757d/ffffff?text=Shop'})`,
  };

  return (
    <div className="category-banner text-white text-center py-5 mb-4 rounded" style={bannerStyle}>
      <Container>
        <h1 className="display-4">{categoryName}</h1>
      </Container>
    </div>
  );
};

export default CategoryBanner;
