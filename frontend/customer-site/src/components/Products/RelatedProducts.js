import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products, title }) => {
  const { t } = useTranslation();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="related-products-section mt-5">
      <h4>{title || t('relatedProducts.title', 'Related Products')}</h4>
      <Row>
        {products.map(product => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedProducts;
