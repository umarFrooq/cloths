import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'; // Adjust path if needed
import './App.css'; // Assuming you have a general App.css

// A simple mock for Bootstrap styling (in a real app, import Bootstrap CSS in index.js or App.js)
const mockContainerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center' // Center align for demo
};

const mockHeaderStyle = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px'
};

const mockNavStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px'
};

const mockLinkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontWeight: 'bold'
};


function App() {
  const { t, i18n } = useTranslation();

  // Dynamically set document direction based on language
  React.useEffect(() => {
    document.body.dir = i18n.dir();
    document.documentElement.lang = i18n.language; // Set lang attribute on HTML element
  }, [i18n, i18n.language]);

  return (
    <div style={mockContainerStyle} className="App">
      <Helmet>
        <title>{t('welcomeMessage')}</title> {/* Example: Use a translated title */}
        <meta name="description" content={t('siteDescription')} />
        {/* Add more meta tags here as needed, e.g., canonical, Open Graph tags */}
        {/* <link rel="canonical" href="https://mafrushat-eurubat-almanar.com/" /> */}
      </Helmet>
      <LanguageSwitcher />

      <header style={mockHeaderStyle} className="App-header">
        <h1>{t('welcomeMessage')}</h1>
      </header>

      <nav style={mockNavStyle}>
        <a href="#home" style={mockLinkStyle}>{t('home')}</a>
        <a href="#products" style={mockLinkStyle}>{t('products')}</a>
        <a href="#about" style={mockLinkStyle}>{t('aboutUs')}</a>
        <a href="#contact" style={mockLinkStyle}>{t('contactUs')}</a>
      </nav>

      <div>
        <input type="text" placeholder={t('searchPlaceholder')} style={{padding: '10px', width: '50%', borderRadius: '4px', border: '1px solid #ccc'}} />
      </div>

      {/* Other app content will go here */}
    </div>
  );
}

export default App;
