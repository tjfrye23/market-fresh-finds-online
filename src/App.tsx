
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { MarketScheduleProvider } from '@/contexts/MarketScheduleContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import VendorProtectedRoute from '@/components/VendorProtectedRoute'

// Import pages
import Index from '@/pages/Index'
import About from '@/pages/About'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import VendorDetail from '@/pages/VendorDetail'
import Vendors from '@/pages/Vendors'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Auth from '@/pages/Auth'
import VendorOnboarding from '@/pages/VendorOnboarding'
import VendorDashboard from '@/pages/VendorDashboard'
import VendorProfile from '@/pages/VendorProfile'
import AddProducts from '@/pages/AddProducts'
import ManageProducts from '@/pages/ManageProducts'
import UserProfile from '@/pages/UserProfile'
import Orders from '@/pages/Orders'
import OrderDetail from '@/pages/OrderDetail'
import Favorites from '@/pages/Favorites'
import NotFound from '@/pages/NotFound'
import AdminDashboard from '@/pages/AdminDashboard'
import VendorDetails from '@/pages/VendorDetails'
import CustomerDetails from '@/pages/CustomerDetails'
import AdminVendorDetails from '@/pages/AdminVendorDetails'
import MarketScheduleDetail from '@/pages/MarketScheduleDetail'
import MarketDayDetail from '@/pages/MarketDayDetail'

import '@/App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <MarketScheduleProvider>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/vendor/:id" element={<VendorDetail />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/order/:id" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                
                {/* Vendor Routes */}
                <Route path="/vendor-onboarding" element={
                  <VendorProtectedRoute>
                    <VendorOnboarding />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/dashboard" element={
                  <VendorProtectedRoute>
                    <VendorDashboard />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/profile" element={
                  <VendorProtectedRoute>
                    <VendorProfile />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/add-products" element={
                  <VendorProtectedRoute>
                    <AddProducts />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/manage-products" element={
                  <VendorProtectedRoute>
                    <ManageProducts />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/orders/:orderId" element={
                  <VendorProtectedRoute>
                    <OrderDetail />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/market-schedule/:scheduleId" element={
                  <VendorProtectedRoute>
                    <MarketScheduleDetail />
                  </VendorProtectedRoute>
                } />
                <Route path="/vendor/market-day/:marketDayId" element={
                  <VendorProtectedRoute>
                    <MarketDayDetail />
                  </VendorProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/vendors" element={
                  <ProtectedRoute requiredRole="admin">
                    <VendorDetails />
                  </ProtectedRoute>
                } />
                <Route path="/admin/customers" element={
                  <ProtectedRoute requiredRole="admin">
                    <CustomerDetails />
                  </ProtectedRoute>
                } />
                <Route path="/admin/vendor/:id" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminVendorDetails />
                  </ProtectedRoute>
                } />
                <Route path="/admin/market-schedule/:scheduleId" element={
                  <ProtectedRoute requiredRole="admin">
                    <MarketScheduleDetail />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </MarketScheduleProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
