import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProblemsPage from './pages/ProblemsPage';
import ArticlesPage from './pages/ArticlesPage';

// Protected Route component for authenticated pages
const ProtectedRoute = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return firebaseUser ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/problems"
              element={<ProtectedRoute><ProblemsPage /></ProtectedRoute>}
            />
            <Route
              path="/articles"
              element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>}
            />
            <Route path="/*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
