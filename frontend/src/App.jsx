import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import RegisterPage from './pages/RegisterPage'
import { Route , Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <Navbar/>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
