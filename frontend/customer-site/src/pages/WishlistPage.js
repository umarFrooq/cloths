import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/Products/ProductCard';

const WishlistPage = () => {
  const { t } = useTranslation();
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  return (
    <div>
      <Helmet>
        <title>{t('pageTitles.wishlist', 'Wishlist')}</title>
      </Helmet>
      <Container className="my-5">
        <h1>{t('pageTitles.wishlist', 'Wishlist')}</h1>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : !wishlist || wishlist.products.length === 0 ? (
          <Alert variant="info">{t('wishlist.placeholder', 'Your wishlist is empty.')}</Alert>
        ) : (
          <Row>
            {wishlist.products.map(product => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard product={product} />
                <Button variant="danger" size="sm" className="mt-2" onClick={() => removeFromWishlist(product._id)}>
                  {t('wishlist.remove', 'Remove')}
                </Button>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default WishlistPage;
