import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';

const ReturnsPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t('pageTitles.returnsPolicy', 'Returns Policy')}</title>
      </Helmet>
      <Container className="my-5">
        <h1>{t('pageTitles.returnsPolicy', 'Returns Policy')}</h1>
        <p>{t('returnsPolicy.placeholder', 'Details about our returns policy will be listed here.')}</p>
      </Container>
    </div>
  );
};

export default ReturnsPolicyPage;
