import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import './locales/i18n'; // Import i18n configuration

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading Admin Panel...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);

reportWebVitals();
