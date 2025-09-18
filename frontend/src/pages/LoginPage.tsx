import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { LoginData } from '../types/auth';
import { getErrorMessage } from '../utils/helpers';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the redirect location from router state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await login(data);
      
      // Redirect to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default LoginPage;