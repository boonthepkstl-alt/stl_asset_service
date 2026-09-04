import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';
import ErrorBoundary from '@/components/ErrorBoundary';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Forbidden from '@/pages/Forbidden';
import { ROUTES } from '@/config/constants';
import { ROADMAP_FEATURES_ENABLED } from '@/config/featureFlags';
import type { Role } from '@/types/auth';

// Route-level code splitting (Open Finding F-18). Before this, the production build emitted a
// single ~694 KB JS chunk containing every one of the 27 routes, so a user landing on /login
// downloaded the Asset Registry, the AI Decision Center and the admin screens before seeing a
// password field. Each page below is now its own chunk, fetched on first navigation to it.
//
// Deliberately NOT lazy, and each for a reason:
//   Login     - the entry point for every unauthenticated visit. Lazy-loading it would add a
//               second round-trip to the most common first paint, which is the opposite of
//               the point.
//   NotFound  - rendered by the catch-all route, so a lazy chunk would show a loading
//     /Forbidden  fallback before an error page; both are small enough that a separate chunk
//               buys nothing.
//
// The pages use named exports, so each import is remapped to the default shape React.lazy
// requires. Vite splits on the dynamic import, so no manualChunks config is needed.
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard').then((m) => ({ default: m.DashboardPage }))
);
const AssetsPage = lazy(() => import('@/pages/Assets').then((m) => ({ default: m.AssetsPage })));
const AssetDetailPage = lazy(() =>
  import('@/pages/AssetDetail').then((m) => ({ default: m.AssetDetailPage }))
);
const CreateAssetPage = lazy(() =>
  import('@/pages/CreateAsset').then((m) => ({ default: m.CreateAssetPage }))
);
const EmployeesPage = lazy(() =>
  import('@/pages/Employees').then((m) => ({ default: m.EmployeesPage }))
);
const CreateEmployeePage = lazy(() =>
  import('@/pages/CreateEmployee').then((m) => ({ default: m.CreateEmployeePage }))
);
const EmployeeDetailPage = lazy(() =>
  import('@/pages/EmployeeDetail').then((m) => ({ default: m.EmployeeDetailPage }))
);
const EditEmployeePage = lazy(() =>
  import('@/pages/EditEmployee').then((m) => ({ default: m.EditEmployeePage }))
);
const MaintenancePage = lazy(() =>
  import('@/pages/Maintenance').then((m) => ({ default: m.MaintenancePage }))
);
const TicketDetailPage = lazy(() =>
  import('@/pages/TicketDetail').then((m) => ({ default: m.TicketDetailPage }))
);
const HandoversPage = lazy(() =>
  import('@/pages/Handovers').then((m) => ({ default: m.HandoversPage }))
);
const HandoverDetailPage = lazy(() =>
  import('@/pages/HandoverDetail').then((m) => ({ default: m.HandoverDetailPage }))
);
const LicensesPage = lazy(() =>
  import('@/pages/Licenses').then((m) => ({ default: m.LicensesPage }))
);
const LicenseDetailPage = lazy(() =>
  import('@/pages/LicenseDetail').then((m) => ({ default: m.LicenseDetailPage }))
);
const ReconciliationPage = lazy(() =>
  import('@/pages/modules').then((m) => ({ default: m.ReconciliationPage }))
);
const AlertsPage = lazy(() => import('@/pages/Alerts').then((m) => ({ default: m.AlertsPage })));
const AIDecisionCenterPage = lazy(() =>
  import('@/pages/AIDecisionCenter').then((m) => ({ default: m.AIDecisionCenterPage }))
);
const AdministrationPage = lazy(() =>
  import('@/pages/Administration').then((m) => ({ default: m.AdministrationPage }))
);
const UserManagementPage = lazy(() =>
  import('@/pages/UserManagement').then((m) => ({ default: m.UserManagementPage }))
);
const RoleManagementPage = lazy(() =>
  import('@/pages/RoleManagement').then((m) => ({ default: m.RoleManagementPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/Settings').then((m) => ({ default: m.SettingsPage }))
);

// Shown while a route chunk is in flight. Deliberately identical to ProtectedRoute's own
// auth-loading state, so a cold navigation and an auth check look like the same wait to the
// user rather than two different ones.
const RouteFallback: React.FC = () => (
  <div className="flex h-screen items-center justify-center text-body text-surface-500">
    Loading...
  </div>
);

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
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.ASSETS} element={<AssetsPage />} />
                  <Route path={ROUTES.ASSET_CREATE} element={<CreateAssetPage />} />
                  <Route path={ROUTES.ASSET_DETAIL} element={<AssetDetailPage />} />
                  <Route path={ROUTES.EMPLOYEES} element={<EmployeesPage />} />
                  <Route path={ROUTES.EMPLOYEE_CREATE} element={<CreateEmployeePage />} />
                  <Route path={ROUTES.EMPLOYEE_EDIT} element={<EditEmployeePage />} />
                  <Route path={ROUTES.EMPLOYEE_DETAIL} element={<EmployeeDetailPage />} />
                  <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
                  <Route path={ROUTES.TICKET_DETAIL} element={<TicketDetailPage />} />
                  {/* IT Hardware Assignment Approval Workflow (RAISE-FR-OPS-002 exception,
                    PRs #72/#74). Consolidated into a single "Handovers" page (mirroring
                    Maintenance's own multi-stage/multi-actor pattern) with no route-level role
                    restriction -- any authenticated user lands here; role-based tab visibility
                    (My Pending / IT Processing / Supervisor Approval) is a page-level concern
                    now, not a route-level one (no backend enforcement yet, per spec). */}
                  <Route path={ROUTES.HANDOVERS} element={<HandoversPage />} />
                  <Route path={ROUTES.HANDOVER_DETAIL} element={<HandoverDetailPage />} />
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
            </Suspense>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
