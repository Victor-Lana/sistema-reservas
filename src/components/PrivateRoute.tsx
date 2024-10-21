import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element; // A página que deve ser acessada
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');

  // Verifica se o token existe e retorna a página de admin ou redireciona para o login
  return token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
