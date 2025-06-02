
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Index from './pages/Index'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Vendors from './pages/Vendors'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import ManageProducts from './pages/ManageProducts'
import AddProducts from './pages/AddProducts'
import VendorOnboarding from './pages/VendorOnboarding'
import VendorProfile from './pages/VendorProfile'
import VendorDashboard from './pages/VendorDashboard'
import UserProfile from './pages/UserProfile'
import VendorDetail from './pages/VendorDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'

const queryClient = new QueryClient()

const AppContent = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/shop/:id" element={<ProductDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/vendors" element={<Vendors />} />
    <Route path="/vendors/:id" element={<VendorDetail />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/order-confirmation" element={<OrderConfirmation />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
    <Route
      path="/vendor/profile"
      element={
        <ProtectedRoute requiredRole="vendor">
          <VendorProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/vendor/dashboard"
      element={
        <ProtectedRoute requiredRole="vendor">
          <VendorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/vendor/manage-products"
      element={
        <ProtectedRoute requiredRole="vendor">
          <ManageProducts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/vendor/add-products"
      element={
        <ProtectedRoute requiredRole="vendor">
          <AddProducts />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
