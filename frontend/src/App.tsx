import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';
import ErrorBoundary from '@/components/ErrorBoundary';
import Login from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Forbidden from '@/pages/Forbidden';
import { AssetsPage } from '@/pages/Assets';
import { AssetDetailPage } from '@/pages/AssetDetail';
import { CreateAssetPage } from '@/pages/CreateAsset';
import { EmployeesPage } from '@/pages/Employees';
import { EmployeeDetailPage } from '@/pages/EmployeeDetail';
import { MaintenancePage } from '@/pages/Maintenance';
import { TicketDetailPage } from '@/pages/TicketDetail';
import { LicensesPage } from '@/pages/Licenses';
import { LicenseDetailPage } from '@/pages/LicenseDetail';
import { ReconciliationPage } from '@/pages/modules';
import { AlertsPage } from '@/pages/Alerts';
import { AIDecisionCenterPage } from '@/pages/AIDecisionCenter';
import { AdministrationPage } from '@/pages/Administration';
import { UserManagementPage } from '@/pages/UserManagement';
import { RoleManagementPage } from '@/pages/RoleManagement';
import { SettingsPage } from '@/pages/Settings';
import { ROUTES } from '@/config/constants';
import { ROADMAP_FEATURES_ENABLED } from '@/config/featureFlags';
import type { Role } from '@/types/auth';

// allowedRoles gates on top of the base auth check: absent -> any authenticated user; present ->
// user.role must be one of the listed roles, else the user is sent to /forbidden rather than
// silently rendering the page. See docs/template-analysis/AUTH-RBAC.md's extension pattern
// (Role -> Permission -> Route -> UI) — this is the "Route-level enforcement" step; component-
// level (`<Can>`/`useHasPermission`) and menu-filtering steps remain open follow-ups.
export const ProtectedRoute: React.FC<{ allowedRoles?: Role[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-body text-surface-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path={ROUTES.ASSETS} element={<AssetsPage />} />
                <Route path={ROUTES.ASSET_CREATE} element={<CreateAssetPage />} />
                <Route path={ROUTES.ASSET_DETAIL} element={<AssetDetailPage />} />
                <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
                <Route path={ROUTES.EMPLOYEE_DETAIL} element={<EmployeeDetailPage />} />
                <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
                <Route path={ROUTES.TICKET_DETAIL} element={<TicketDetailPage />} />
                {/* RAISE-FR-LICENSE-001 and RAISE-AI-RECOMMEND-001 are Roadmap-only per
                    RAISE-PRD.md, not MVP -- gated behind VITE_ENABLE_ROADMAP_FEATURES so they
                    aren't presented as approved MVP scope by default. See
                    config/featureFlags.ts. */}
                {ROADMAP_FEATURES_ENABLED && (
                  <>
                    <Route path={ROUTES.LICENSES} element={<LicensesPage />} />
                    <Route path={ROUTES.LICENSE_DETAIL} element={<LicenseDetailPage />} />
                    <Route path={ROUTES.AI_DECISION} element={<AIDecisionCenterPage />} />
                  </>
                )}
                <Route path={ROUTES.RECONCILIATION} element={<ReconciliationPage />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<AlertsPage />} />
                <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />

                {/* Administration is restricted to ADMIN — see docs/template-analysis/
                    PROJECT-FOUNDATION-BASELINE.md's NEEDS_PRD_CONFIRMATION log for whether a
                    finer-grained role mapping (e.g. IT_MANAGER read-only) is required by MVP.
                    Settings (AC-WARRANTY-001-06) is admin-only for the same reason — it edits
                    platform-wide config, not per-user preferences. */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path={ROUTES.ADMINISTRATION} element={<AdministrationPage />} />
                  <Route path={ROUTES.ADMIN_USERS} element={<UserManagementPage />} />
                  <Route path={ROUTES.ADMIN_ROLES} element={<RoleManagementPage />} />
                  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
