import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home'; // Importe sua página inicial
import AdminPage from './pages/Admin'; // Importe a página de administração
import AdminLogin from './pages/AdminLogin'; // Importe o componente de Login
import PrivateRoute from './components/PrivateRoute'; // Importe o componente PrivateRoute

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute element={<AdminPage />} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
