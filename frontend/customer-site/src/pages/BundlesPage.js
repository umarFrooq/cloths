import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { getBundles as apiGetBundles } from '../services/apiService';
import { useCart } from '../contexts/CartContext';

const BundlesPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { addBundleToCart, loading: cartLoading } = useCart(); // Assuming addBundleToCart exists
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBundles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGetBundles();
        if (response.data && response.data.success) {
          setBundles(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load bundles.');
        }
      } catch (err) {
        setError(err.error || err.message || 'An error occurred while fetching bundles.');
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const handleAddBundleToCart = async (bundle) => {
    await addBundleToCart(bundle);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(price);
  };

  if (loading) {
    return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  }

  if (error) {
    return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="my-5">
      <Helmet>
        <title>{t('pageTitles.bundleDeals', 'Bundle Deals')}</title>
      </Helmet>
      <h1 className="mb-4">{t('bundlesPage.title', 'Bundle Deals')}</h1>
      {bundles.length === 0 ? (
        <Alert variant="info">{t('bundlesPage.noBundles', 'No bundle deals available at the moment.')}</Alert>
      ) : (
        <Row>
          {bundles.map(bundle => (
            <Col key={bundle._id} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Img variant="top" src={bundle.image || 'https://via.placeholder.com/400x250'} alt={currentLang === 'ar' ? bundle.name_ar : bundle.name_en} />
                <Card.Body>
                  <Card.Title>{currentLang === 'ar' ? bundle.name_ar : bundle.name_en}</Card.Title>
                  <Card.Text>{currentLang === 'ar' ? bundle.description_ar : bundle.description_en}</Card.Text>
                  <h5>{t('bundlesPage.productsIncluded', 'Products Included:')}</h5>
                  <ul>
                    {bundle.products.map(p => <li key={p._id}>{currentLang === 'ar' ? p.name_ar : p.name_en}</li>)}
                  </ul>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{formatPrice(bundle.bundlePrice)}</h5>
                    <Button variant="primary" onClick={() => handleAddBundleToCart(bundle)} disabled={cartLoading}>
                      {t('bundlesPage.addToCart', 'Add Bundle to Cart')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BundlesPage;
