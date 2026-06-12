import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Favorites from './pages/Favorites.jsx';
import GemstoneCatalog from './pages/GemstoneCatalog.jsx';
import GemstoneDetails from './pages/GemstoneDetails.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import RecommendationForm from './pages/RecommendationForm.jsx';
import RecommendationResult from './pages/RecommendationResult.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Wishlists from './pages/Wishlists.jsx';
import ChatAssistant from './pages/ChatAssistant.jsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/gemstones" element={<GemstoneCatalog />} />
        <Route path="/gemstone/:id" element={<GemstoneDetails />} />
        <Route path="/recommend" element={<ProtectedRoute><RecommendationForm /></ProtectedRoute>} />
        <Route path="/recommendation-result" element={<ProtectedRoute><RecommendationResult /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/wishlists" element={<ProtectedRoute><Wishlists /></ProtectedRoute>} />
        <Route path="/chat-assistant" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AnalyticsDashboard /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
