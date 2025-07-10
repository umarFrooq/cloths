import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import './locales/i18n'; // Import i18n configuration

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider> {/* Wrap App with HelmetProvider */}
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
