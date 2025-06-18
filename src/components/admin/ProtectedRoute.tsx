
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute: Auth state changed:', { isAuthenticated, loading, path: location.pathname });
    
    // If we're authenticated and on a login page, redirect to admin menu
    if (isAuthenticated && !loading && location.pathname === '/admin/login') {
      console.log('ProtectedRoute: Redirecting authenticated user to admin menu');
      navigate('/admin/menu', { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irish-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, showing login form');
    return <LoginForm />;
  }

  console.log('ProtectedRoute: User authenticated, showing protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
