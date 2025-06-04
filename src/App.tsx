
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { MarketScheduleProvider } from './contexts/MarketScheduleContext'
import ProtectedRoute from './components/ProtectedRoute'
import VendorProtectedRoute from './components/VendorProtectedRoute'

// Pages
import Index from './pages/Index'
import Auth from './pages/Auth'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Favorites from './pages/Favorites'
import Vendors from './pages/Vendors'
import VendorDetail from './pages/VendorDetail'
import VendorDetails from './pages/VendorDetails'
import About from './pages/About'
import UserProfile from './pages/UserProfile'
import CustomerDetails from './pages/CustomerDetails'
import VendorOnboarding from './pages/VendorOnboarding'
import VendorProfile from './pages/VendorProfile'
import VendorDashboard from './pages/VendorDashboard'
import ManageProducts from './pages/ManageProducts'
import AddProducts from './pages/AddProducts'
import AdminDashboard from './pages/AdminDashboard'
import AdminVendorDetails from './pages/AdminVendorDetails'
import MarketScheduleDetail from './pages/MarketScheduleDetail'
import MarketDayDetail from './pages/MarketDayDetail'
import MarketDayProducts from './pages/MarketDayProducts'
import NotFound from './pages/NotFound'

import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <MarketScheduleProvider>
                <div className="min-h-screen bg-white">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/vendor/:id" element={<VendorDetail />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/customer-details" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />

                    {/* Vendor routes */}
                    <Route path="/vendor-onboarding" element={<VendorProtectedRoute><VendorOnboarding /></VendorProtectedRoute>} />
                    <Route path="/vendor/profile" element={<VendorProtectedRoute><VendorProfile /></VendorProtectedRoute>} />
                    <Route path="/vendor/dashboard" element={<VendorProtectedRoute><VendorDashboard /></VendorProtectedRoute>} />
                    <Route path="/vendor/manage-products" element={<VendorProtectedRoute><ManageProducts /></VendorProtectedRoute>} />
                    <Route path="/vendor/add-products" element={<VendorProtectedRoute><AddProducts /></VendorProtectedRoute>} />
                    <Route path="/vendor/market-day/:marketDayId" element={<VendorProtectedRoute><MarketDayDetail /></VendorProtectedRoute>} />
                    <Route path="/vendor/market-day/:marketDayId/products" element={<VendorProtectedRoute><MarketDayProducts /></VendorProtectedRoute>} />
                    <Route path="/vendor-details/:id" element={<VendorDetails />} />

                    {/* Admin routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/vendor/:id" element={<ProtectedRoute><AdminVendorDetails /></ProtectedRoute>} />
                    <Route path="/admin/market-schedule/:id" element={<ProtectedRoute><MarketScheduleDetail /></ProtectedRoute>} />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </MarketScheduleProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
