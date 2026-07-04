import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './slices/authSlice';
import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import LoadingSpinner from './components/common/LoadingSpinner';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

//import chatbot
import ChatBot from "./components/common/Chatbot";
// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import WishlistPage from './pages/customer/WishlistPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import PaymentSuccessPage from './pages/customer/PaymentSuccessPage';
import PressMediaPage from './pages/customer/PressMedia';
import CareersPage from './pages/customer/CareersPage';
import SustainabilityPage from './pages/customer/SustainabilityPage';
import CraftsmanshipPage from './pages/customer/CraftsmanshipPage';
import GiftCardsPage from './pages/customer/GiftCardsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSettings from './pages/admin/AdminSettings';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminTasks from './pages/admin/AdminTasks';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminInventoryRequests from './pages/admin/AdminInventoryRequests';
import AdminGiftCards from './pages/admin/AdminGiftCards';
import AdminFlashSales from './pages/admin/AdminFlashSales';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeTasks from './pages/employee/EmployeeTasks';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeInventory from './pages/employee/EmployeeInventory';
import EmployeeInventoryStock from './pages/employee/EmployeeInventoryStock';
import EmployeeProducts from './pages/employee/EmployeeProducts';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeCoupons from './pages/employee/EmployeeCoupons';
import EmployeeFlashSales from './pages/employee/EmployeeFlashSales';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  return token ? children : <Navigate to="/login" replace />;
};
const AdminRoute = ({ children }) => {
  const { token, user } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};
const EmployeeRoute = ({ children }) => {
  const { token, user } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'employee') return <Navigate to="/" replace />;
  return children;
};
const CustomerLayout = ({ children }) => {
  const location = useLocation();
  const footerClass = ['/press-media', '/careers', '/gift-cards'].includes(location.pathname) ? 'pt-28' : '';
  return (
  <div className="min-h-screen flex flex-col" style={{ background:'#FDF8F0' }}>
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer className={footerClass} />
  </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const { token, initialized } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [token, dispatch]);

  if (token && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:'#FDF8F0' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
        <Route path="/products/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/press-media" element={<CustomerLayout><PressMediaPage /></CustomerLayout>} />
        <Route path="/careers" element={<CustomerLayout><CareersPage /></CustomerLayout>} />
        <Route path="/sustainability" element={<CustomerLayout><SustainabilityPage /></CustomerLayout>} />
        <Route path="/craftsmanship" element={<CustomerLayout><CraftsmanshipPage /></CustomerLayout>} />
        <Route path="/gift-cards" element={<CustomerLayout><GiftCardsPage /></CustomerLayout>} />
        {/* Protected */}
        <Route path="/cart" element={<ProtectedRoute><CustomerLayout><CartPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><CustomerLayout><WishlistPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CustomerLayout><CheckoutPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><CustomerLayout><OrdersPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><CustomerLayout><OrderDetailPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><CustomerLayout><ProfilePage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><CustomerLayout><PaymentSuccessPage /></CustomerLayout></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/employees" element={<AdminRoute><AdminEmployees /></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><AdminTasks /></AdminRoute>} />
        <Route path="/admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
        <Route path="/admin/inventory-requests" element={<AdminRoute><AdminInventoryRequests /></AdminRoute>} />
        <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCards /></AdminRoute>} />
<Route path="/admin/flash-sales" element={<AdminRoute><AdminFlashSales /></AdminRoute>} />
        {/* Employee */}
        <Route path="/employee" element={<EmployeeRoute><EmployeeDashboard /></EmployeeRoute>} />
        <Route path="/employee/tasks" element={<EmployeeRoute><EmployeeTasks /></EmployeeRoute>} />
        <Route path="/employee/attendance" element={<EmployeeRoute><EmployeeAttendance /></EmployeeRoute>} />
        <Route path="/employee/products" element={<EmployeeRoute><EmployeeProducts /></EmployeeRoute>} />
        <Route path="/employee/inventory" element={<EmployeeRoute><EmployeeInventoryStock /></EmployeeRoute>} />
        <Route path="/employee/stock-requests" element={<EmployeeRoute><EmployeeInventory /></EmployeeRoute>} />
        <Route path="/employee/profile" element={<EmployeeRoute><EmployeeProfile /></EmployeeRoute>} />
        <Route path="/employee/coupons" element={<EmployeeRoute><EmployeeCoupons /></EmployeeRoute>} />
<Route path="/employee/flash-sales" element={<EmployeeRoute><EmployeeFlashSales /></EmployeeRoute>} />
        {/* 404 */}
        <Route path="*" element={<CustomerLayout><div className="flex items-center justify-center min-h-[60vh]"><div className="text-center"><p className="font-display text-6xl font-bold text-primary-100 mb-4">404</p><h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2><p className="font-body text-gray-500 mb-6">The page you're looking for doesn't exist.</p><a href="/" className="btn-primary inline-flex">Go Home</a></div></div></CustomerLayout>} />
      </Routes>
       <ChatBot />

    </Router>
  );
}
