import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Image } from 'react-bootstrap';
// import './AboutUsPage.css'; // Optional: if specific styling is needed

const AboutUsPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Placeholder content, ideally this would come from a CMS or backend in a real app
  const content = {
    en: {
      title: "About Us",
      paragraphs: [
        "Welcome to Mafrushat Eurubat Almanar, your ideal destination for renewing your home with the finest types of furnishings that combine luxury and quality.",
        "Our store specializes in offering a diverse range of products including: carpets and rugs with modern and classic designs to suit all tastes and spaces, distinctive Arab majlis collections inspired by authentic Arab heritage, with details that combine comfort and luxury, and elegant curtains to decorate windows with fabrics and designs that add an elegant touch to every room.",
        "We are committed to providing the best quality and latest designs to meet our customers' aspirations for creating a comfortable and beautiful home environment. Our team is always ready to provide assistance and advice to help you choose what suits your taste and needs."
      ],
      missionTitle: "Our Mission",
      missionText: "To provide high-quality home furnishings that blend traditional elegance with modern comfort, enhancing the beauty and functionality of every home.",
      visionTitle: "Our Vision",
      visionText: "To be the leading name in home furnishings in the region, known for our exceptional quality, innovative designs, and customer-centric approach.",
      imageAlt: "Our Showroom"
    },
    ar: {
      title: "مـــن نـــحـــن؟",
      paragraphs: [
        "مرحبًا بكم في مفروشات عروبة المنار، وجهتك المثالية لتجديد منزلك بأجود أنواع المفروشات التي تجمع بين الفخامة والجودة.",
        "يختص المتجر في تقديم مجموعة متنوعة من المنتجات تشمل: السجاد والموكيت بتصاميم عصرية وكلاسيكية تناسب جميع الأذواق والمساحات، المجالس العربية بتشكيلات مميزة مستوحاة من التراث العربي الأصيل، بتفاصيل تجمع بين الراحة والفخامة، والستائر باختيارات راقية لتزيين النوافذ بأقمشة وتصاميم تضفي لمسة أنيقة على كل غرفة.",
        "نحن ملتزمون بتقديم أفضل الخامات وأحدث التصاميم لنلبي تطلعات عملائنا في خلق بيئة منزلية مريحة وجميلة. فريقنا مستعد دائمًا لتقديم المساعدة والمشورة لمساعدتكم في اختيار ما يناسب أذواقكم واحتياجاتكم."
      ],
      missionTitle: "مهمتنا",
      missionText: "توفير مفروشات منزلية عالية الجودة تمزج بين الأناقة التقليدية والراحة العصرية، مما يعزز جمال ووظائف كل منزل.",
      visionTitle: "رؤيتنا",
      visionText: "أن نكون الاسم الرائد في مجال المفروشات المنزلية في المنطقة، معروفين بجودتنا الاستثنائية وتصاميمنا المبتكرة ونهجنا الذي يركز على العملاء.",
      imageAlt: "صالة العرض لدينا"
    }
  };

  const pageContent = currentLang === 'ar' ? content.ar : content.en;

  return (
    <Container className="my-5 about-us-page">
      <Helmet>
        <title>{t('pageTitles.aboutUs', pageContent.title)}</title>
      </Helmet>
      <Row className="align-items-center mb-4">
        <Col md={12} className="text-center">
          <h1 className="page-main-title">{pageContent.title}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          {pageContent.paragraphs.map((p, index) => (
            <p key={index} className="lead-paragraph">{p}</p>
          ))}

          <h3 className="mt-4">{pageContent.missionTitle}</h3>
          <p>{pageContent.missionText}</p>

          <h3 className="mt-4">{pageContent.visionTitle}</h3>
          <p>{pageContent.visionText}</p>
        </Col>
        <Col md={5} className="text-center">
          {/* Replace with an actual relevant image */}
          <Image
            src="https://via.placeholder.com/450x350/007bff/FFFFFF?text=Mafrushat+Showroom"
            alt={pageContent.imageAlt}
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
