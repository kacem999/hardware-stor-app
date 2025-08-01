import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import { Route , Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import PublicLayout from './components/PublicLayout';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage';



function App() {
  const { i18n } = useTranslation();
  
  // Handle RTL/LTR direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* PROTECTED USER ROUTES */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<ManageProductsPage />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="categories" element={<ManageCategoriesPage />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;