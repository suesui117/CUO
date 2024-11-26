import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css'; // Optional CSS file
import App from './App'; // Main app component
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />  {/* Renders the App component */}
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional for performance measuring
// reportWebVitals();
