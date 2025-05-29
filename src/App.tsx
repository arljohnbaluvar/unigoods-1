import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminVerification from './pages/AdminVerification';
import UserVerification from './pages/UserVerification';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TradeProposals from './pages/TradeProposals';
import MyItems from './pages/MyItems';
import Profile from './pages/Profile';
import Contacts from './pages/Contacts';
import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import { TradeProvider } from './context/TradeContext';
import { AuthProvider } from './context/AuthContext';
import { ContactProvider } from './context/ContactContext';
import { VerificationProvider } from './context/VerificationContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <VerificationProvider>
            <ContactProvider>
              <CartProvider>
                <TradeProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    
                    {/* Protected routes with Layout */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Dashboard />
                        </Layout>
                      } />
                    } />
                    
                    <Route path="/products" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Products />
                        </Layout>
                      } />
                    } />
                    
                    <Route path="/products/:id" element={
                      <ProtectedRoute element={
                        <Layout>
                          <ProductDetails />
                        </Layout>
                      } />
                    } />
                    
                    <Route path="/cart" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Cart />
                        </Layout>
                      } />
                    } />
                    
                    <Route path="/checkout" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Checkout />
                        </Layout>
                      } />
                    } />

                    <Route path="/trades" element={
                      <ProtectedRoute element={
                        <Layout>
                          <TradeProposals />
                        </Layout>
                      } />
                    } />

                    <Route path="/contacts" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Contacts />
                        </Layout>
                      } />
                    } />

                    <Route path="/profile" element={
                      <ProtectedRoute element={
                        <Layout>
                          <Profile />
                        </Layout>
                      } />
                    } />

                    {/* Admin routes */}
                    <Route
                      path="/admin/verification"
                      element={
                        <ProtectedRoute
                          element={
                            <Layout>
                              <AdminVerification />
                            </Layout>
                          }
                          requireAdmin={true}
                        />
                      }
                    />

                    {/* User Verification route */}
                    <Route
                      path="/verification"
                      element={<ProtectedRoute element={<UserVerification />} />}
                    />

                    {/* Default route */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </TradeProvider>
              </CartProvider>
            </ContactProvider>
          </VerificationProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App; 