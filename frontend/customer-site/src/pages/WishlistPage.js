import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';

const WishlistPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t('pageTitles.wishlist', 'Wishlist')}</title>
      </Helmet>
      <Container className="my-5">
        <h1>{t('pageTitles.wishlist', 'Wishlist')}</h1>
        <p>{t('wishlist.placeholder', 'Your wishlist is empty.')}</p>
      </Container>
    </div>
  );
};

export default WishlistPage;
