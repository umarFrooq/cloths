import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';

const ShippingPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t('pageTitles.shippingPolicy', 'Shipping Policy')}</title>
      </Helmet>
      <Container className="my-5">
        <h1>{t('pageTitles.shippingPolicy', 'Shipping Policy')}</h1>
        <p>{t('shippingPolicy.placeholder', 'Details about our shipping policy will be listed here.')}</p>
      </Container>
    </div>
  );
};

export default ShippingPolicyPage;
