import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Image } from 'react-bootstrap';
// import './AboutUsPage.css'; // Optional: if specific styling is needed

const AboutUsPage = () => {
  const { t } = useTranslation();

  // Arabic fallbacks can be provided in t() if keys are missing,
  // but for cleaner code, ensure ar.json is also populated.
  // For this task, we focus on en.json.

  return (
    <Container className="my-5 about-us-page">
      <Helmet>
        <title>{t('pageTitles.aboutUs', t('aboutUs.title', 'About Us'))}</title>
      </Helmet>
      <Row className="align-items-center mb-4">
        <Col md={12} className="text-center">
          <h1 className="page-main-title">{t('aboutUs.title', 'About Us')}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <p className="lead-paragraph">{t('aboutUs.paragraph1', "Welcome to Mafrushat Eurubat Almanar, your ideal destination for renewing your home with the finest types of furnishings that combine luxury and quality.")}</p>
          <p className="lead-paragraph">{t('aboutUs.paragraph2', "Our store specializes in offering a diverse range of products including: carpets and rugs with modern and classic designs to suit all tastes and spaces, distinctive Arab majlis collections inspired by authentic Arab heritage, with details that combine comfort and luxury, and elegant curtains to decorate windows with fabrics and designs that add an elegant touch to every room.")}</p>
          <p className="lead-paragraph">{t('aboutUs.paragraph3', "We are committed to providing the best quality and latest designs to meet our customers' aspirations for creating a comfortable and beautiful home environment. Our team is always ready to provide assistance and advice to help you choose what suits your taste and needs.")}</p>

          <h3 className="mt-4">{t('aboutUs.missionTitle', 'Our Mission')}</h3>
          <p>{t('aboutUs.missionText', "To provide high-quality home furnishings that blend traditional elegance with modern comfort, enhancing the beauty and functionality of every home.")}</p>

          <h3 className="mt-4">{t('aboutUs.visionTitle', 'Our Vision')}</h3>
          <p>{t('aboutUs.visionText', "To be the leading name in home furnishings in the region, known for our exceptional quality, innovative designs, and customer-centric approach.")}</p>
        </Col>
        <Col md={5} className="text-center">
          {/* Replace with an actual relevant image */}
          <Image
            src="https://via.placeholder.com/450x350/007bff/FFFFFF?text=Mafrushat+Showroom"
            alt={t('aboutUs.imageAlt', 'Our Showroom')}
            fluid
            rounded
            className="shadow-sm"
          />
        </Col>
      </Row>
      {/* Optional: Add team members, company history, etc. */}
    </Container>
  );
};

export default AboutUsPage;
