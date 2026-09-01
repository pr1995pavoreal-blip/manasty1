import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AdminLayout } from './components/AdminLayout';
import { QRScannerModal } from './components/QRScannerModal';

// Auth Pages
import { LoginPage } from './modules/auth/LoginPage';
import { RegisterCustomerPage } from './modules/auth/RegisterCustomerPage';
import { RegisterMerchantPage } from './modules/auth/RegisterMerchantPage';

// Feature Pages
import { DashboardPage } from './pages/DashboardPage';
import { DigitalCardView } from './modules/cards/DigitalCardView';
import { QRVerifyPage } from './modules/cards/QRVerifyPage';
import { NearbyStoresPage } from './modules/locations/NearbyStoresPage';
import { OffersListPage } from './modules/offers/OffersListPage';
import { TransactionHistoryPage } from './modules/transactions/TransactionHistoryPage';
import { CustomerListPage } from './modules/customers/CustomerListPage';
import { MerchantListPage } from './modules/merchants/MerchantListPage';
import { MerchantPortalPage } from './modules/merchants/MerchantPortalPage';
import { ProductsPage } from './modules/merchants/ProductsPage';
import { MembershipTypesPage } from './modules/memberships/MembershipTypesPage';
import { AdminReportsPage } from './modules/reports/AdminReportsPage';
import { AuditLogsPage } from './modules/reports/AuditLogsPage';

// Admin Utility Pages
import { BusinessCategoriesPage } from './modules/admin/BusinessCategoriesPage';
import { UsersAdminPage } from './modules/admin/UsersAdminPage';
import { RolesAdminPage } from './modules/admin/RolesAdminPage';
import { SettingsPage } from './modules/admin/SettingsPage';
import { ActivityLogsPage } from './modules/admin/ActivityLogsPage';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  return (
    <>
      <Routes>
        {/* Unauthenticated Auth Routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register-customer" element={!user ? <RegisterCustomerPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register-merchant" element={!user ? <RegisterMerchantPage /> : <Navigate to="/dashboard" />} />

        {/* Public QR Verification URL */}
        <Route path="/verify/:token" element={<QRVerifyPage />} />

        {/* Protected SaaS Admin Layout Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <AdminLayout onOpenScanner={openScanner}>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage onOpenScanner={openScanner} />} />
                  <Route path="/my-card" element={<DigitalCardView />} />
                  <Route path="/nearby-stores" element={<NearbyStoresPage />} />
                  <Route path="/offers" element={<OffersListPage />} />
                  <Route path="/transactions" element={<TransactionHistoryPage />} />
                  <Route path="/merchant-portal" element={<MerchantPortalPage />} />
                  <Route path="/products-admin" element={<ProductsPage />} />
                  <Route path="/business-categories-admin" element={<BusinessCategoriesPage />} />
                  <Route path="/customers-admin" element={<CustomerListPage />} />
                  <Route path="/merchants-admin" element={<MerchantListPage />} />
                  <Route path="/memberships-admin" element={<MembershipTypesPage />} />
                  <Route path="/reports-admin" element={<AdminReportsPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/users-admin" element={<UsersAdminPage />} />
                  <Route path="/roles-admin" element={<RolesAdminPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/activity-logs" element={<ActivityLogsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <QRScannerModal isOpen={isScannerOpen} onClose={closeScanner} />
    </>
  );
};
