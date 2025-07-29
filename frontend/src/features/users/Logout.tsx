import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * Компонент для виходу користувача.
 * При монтуванні викликає logout і редіректить на сторінку логіну.
 */
const Logout: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      auth.logout();
    }
    // На випадок, якщо logout не редіректить
    navigate('/login', { replace: true });
  }, [auth, navigate]);

  return <p className="text-center mt-10">Logging out...</p>;
};

export default Logout;
