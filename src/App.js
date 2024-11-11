import React, { useEffect, useState } from 'react';
import AppHeader from './views/AppHeader';
import AppFooter from './views/AppFooter';
import AppBody from './views/AppBody';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Check if token exists and update state
  }, []); // Run once on initial load

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login status to false
    localStorage.removeItem('token'); // Remove the token from localStorage
  };

  return (
    <>
      <AppHeader />
      {isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <AppBody />}
      <AppFooter />
    </>
  );
}

export default App;
