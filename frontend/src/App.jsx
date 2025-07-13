import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'
import { Route , Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoute from './components/admin/AdminRoute';

function App() {
  // const { loading } = useAuth();

  // if (loading) {
  //   return <div>Loading...</div>
  // }
  return ( 
    <Routes>
      <Route path='/*' element={<PublicRoutes />} />

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminDashboardRoutes />} />
      </Route>
    </Routes>
  );
}

// A component to groupe all public routes
const PublicRoutes = () => (
  <>
    <Navbar />
    <main className='container mx-auto p-4'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Protected Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </main>
  </>
);

// A component to group all admin routes
const AdminDashboardRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path='dashboard' element={<AdminDashboardPage />} />
    </Routes>
  </AdminLayout>
);

export default App;