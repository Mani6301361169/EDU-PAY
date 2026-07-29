import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const getBasename = () => {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/EDU-PAY')) {
    return '/EDU-PAY';
  }
  return '';
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename={getBasename()}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;