
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Farmers from "./pages/Farmers";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ManageProducts from "./pages/ManageProducts";
import VendorOnboarding from "./pages/VendorOnboarding";

const queryClient = new QueryClient();

const AppContent = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/about" element={<About />} />
    <Route path="/farmers" element={<Farmers />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/farmer-onboarding" element={<VendorOnboarding />} />
    <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
    <Route path="/manage-products" element={
      <ProtectedRoute requiredRole="vendor">
        <ManageProducts />
      </ProtectedRoute>
    } />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
