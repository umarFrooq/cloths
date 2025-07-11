import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher'; // Adjust path
import CategoriesDisplay from '../components/Home/CategoriesDisplay';
import ProductCard from '../components/Products/ProductCard'; // Import ProductCard
import { getProducts } from '../services/apiService'; // To fetch products
import { Link } from 'react-router-dom'; // For buttons
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'; // For layout
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faShippingFast, faShieldAlt, faTags } from '@fortawesome/free-solid-svg-icons'; // Icons

// Hero Section Component
const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="text-center py-5 bg-light hero-section" style={{ backgroundImage: "url('https://via.placeholder.com/1920x600/CCCCCC/FFFFFF?text=Beautiful+Furniture+Background')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="hero-content" style={{backgroundColor: 'rgba(255,255,255,0.7)', padding: '2rem', borderRadius: '10px', display: 'inline-block'}}>
        <h1 className="display-4 fw-bold"> {t('home.heroTitle', 'احدث التصاميم')}</h1>
        <p className="lead fs-4 my-3">{t('home.heroSubtitle', 'مفروشات عروبة المنار وجهتك المثالية لشراء السجاد والموكيت والمجالس والستائر. جودة عالية وتصاميم مميزة تناسب كل الأذواق')}</p>
        <Button as={Link} to="/shop" variant="primary" size="lg">{t('home.heroButton', 'تفقد المتجر الان!')}</Button>
      </div>
    </Container>
  );
};

// Value Propositions Section Component
const ValuePropsSection = () => {
    const { t } = useTranslation();
    const valueProps = [
        { icon: faMedal, title: t('home.qualityTitle', 'جودة عالية'), text: t('home.qualityText', 'جودة فائقة تضمن الفخامة والمتانة في كل التفاصيل والخامة') },
        { icon: faShippingFast, title: t('home.deliveryTitle', 'تسليم سريع'), text: t('home.deliveryText', 'توصيل سريع وآمن يضمن وصول طلباتكم في الوقت المحدد') },
        { icon: faShieldAlt, title: t('home.warrantyTitle', 'أفضل ضمان'), text: t('home.warrantyText', 'ضمان شامل يوفر لكم راحة البال وثقة في كل عملية شراء') }
    ];
    return (
        <Container className="text-center py-5 value-props-section">
            <Row>
                {valueProps.map(prop => (
                    <Col md={4} key={prop.title} className="mb-4 mb-md-0">
                        <FontAwesomeIcon icon={prop.icon} size="3x" className="text-primary mb-3" />
                        <h4>{prop.title}</h4>
                        <p className="text-muted">{prop.text}</p>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

// Featured Products Section Component
const FeaturedProductsSection = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest 4-8 products, or products marked as 'featured' if backend supports
        const response = await getProducts({ limit: 8, sort: '-createdAt', lang: i18n.language });
        if (response.data && response.data.success) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message || t('home.featuredProductsErrorDefault'));
        }
      } catch (err) {
        setError(err.message || t('home.featuredProductsErrorNetwork'));
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, [t, i18n.language]);

  return (
    <Container className="py-5 featured-products-section">
      <h2 className="text-center mb-5 section-title">{t('home.featuredProductsTitle', 'المنتجات المميزة')}</h2>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center">{t('home.noFeaturedProducts', 'No featured products available at the moment.')}</p>
      )}
      {!loading && !error && products.length > 0 && (
        <Row>
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Row>
      )}
       <div className="text-center mt-4">
          <Button as={Link} to="/shop" variant="outline-primary" size="lg">
            {t('home.viewAllProductsButton', 'تصفح كل المنتجات')}
          </Button>
        </div>
    </Container>
  );
};

// Special Offer Banner (Example from reference site)
const SpecialOfferBanner = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="py-5 my-4 special-offer-banner" style={{ backgroundColor: '#e9ecef' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={7}>
            <h2 className="display-5 fw-bold">{t('home.offers.majlisTitle', 'عروض علي المجالس العربية')}</h2>
            <p className="lead my-3">{t('home.offers.majlisText', 'خصم خاص يصل الي 70%. اكتشفوا الآن أفضل عروض المجالس العربية لدى “مفروشات عروبة المنار”، حيث نقدم تصاميم تجمع بين الفخامة والأصالة بأسعار تنافسية.')}</p>
            <Button variant="success" size="lg" href={`https://wa.me/${t('contactInfo.whatsappNumber', '966558494648')}`} target="_blank">
              <FontAwesomeIcon icon={faTags} className="me-2" /> {/* Using faTags as placeholder for offer icon */}
              {t('home.offers.whatsappButton', 'تواصل واتساب للعروض')}
            </Button>
          </Col>
          <Col md={5} className="text-center mt-3 mt-md-0">
            {/* Replace with an actual relevant image */}
            <img src="https://mafrushat-eurubat-almanar.com/wp-content/uploads/2024/12/png-clipart-dubai-majlis-couch-table-seat-arabic-angle-furniture-1.png" alt={t('home.offers.majlisImageAlt', 'Arabic Majlis Offer')} className="img-fluid rounded shadow" style={{maxHeight: '300px'}}/>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};


const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>{t('pageTitles.home', 'الرئيسية')}</title>
        {/* Add other meta tags specific to home page if needed */}
      </Helmet>

      <HeroSection />
      <ValuePropsSection /> {/* Added this section */}

      {/* Language switcher removed from here, as it's in the Navbar */}

      <CategoriesDisplay />

      <FeaturedProductsSection />

      {/* Add other homepage sections here as they are built */}
      {/* e.g., Special Offer Banner, Most Popular Now, etc. */}

    </div>
  );
};

export default HomePage;
