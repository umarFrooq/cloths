import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher'; // Adjust path if needed
import './App.css'; // Assuming you have a general App.css for admin

// Mock styles for admin panel structure
const adminContainerStyle = {
  display: 'flex',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif',
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#343a40', // Dark sidebar
  color: 'white',
  padding: '20px',
};

const mainContentStyle = {
  flexGrow: 1,
  padding: '20px',
  backgroundColor: '#f4f6f8', // Light content background
};

const headerStyle = {
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid #dee2e6',
};

const navLinkStyle = {
  display: 'block',
  color: '#adb5bd',
  textDecoration: 'none',
  padding: '10px 0',
  margin: '5px 0',
};

const activeNavLinkStyle = {
  ...navLinkStyle,
  color: 'white',
  fontWeight: 'bold',
};


function App() {
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.body.dir = i18n.dir();
    document.documentElement.lang = i18n.language; // Set lang attribute on HTML element
    document.title = t('adminPanelTitle'); // Set document title dynamically
  }, [i18n, i18n.language, t]);

  return (
    <div style={adminContainerStyle} className="admin-app">
      <aside style={sidebarStyle}>
        <h2>{t('adminPanelTitle')}</h2>
        <nav>
          <a href="#dashboard" style={activeNavLinkStyle}>{t('dashboard')}</a>
          <a href="#products" style={navLinkStyle}>{t('products')}</a>
          <a href="#categories" style={navLinkStyle}>{t('categories')}</a>
          <a href="#orders" style={navLinkStyle}>{t('orders')}</a>
          <a href="#users" style={navLinkStyle}>{t('users')}</a>
          <a href="#analytics" style={navLinkStyle}>{t('analytics')}</a>
          <hr style={{borderColor: '#495057'}}/>
          <a href="#settings" style={navLinkStyle}>{t('settings')}</a>
          <a href="#logout" style={navLinkStyle}>{t('logout')}</a>
        </nav>
        <div style={{marginTop: 'auto', paddingTop: '20px'}}>
             <LanguageSwitcher />
        </div>
      </aside>

      <main style={mainContentStyle}>
        <header style={headerStyle}>
          <h1>{t('welcomeAdmin')}</h1>
          <p>{t('productManagement')}</p> {/* Example usage */}
        </header>
        {/* Admin panel content will go here, routed based on selections */}
        <p>Main content area for {t('dashboard')}, {t('products')}, etc.</p>
      </main>
    </div>
  );
}

export default App;
