import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure you use `react-router-dom`

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      // Clear local storage to log out the user
      localStorage.clear();
      // Navigate to the login or home page
      navigate('/login');
    };
    handleLogout();
  }, [navigate]);

  return null; // Component does not render anything
};

export default Logout;
