import type { ReactElement } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';

// AppShell (used by every migrated page) reads useAuth()/useToast(), so component tests need
// both providers even when auth/toast behavior isn't what's under test.
//
// `path` lets a test render a page that reads route params (useParams) by mounting it under a
// real <Route>, e.g. renderWithProviders(<AssetDetailPage/>, { path: '/assets/:assetId', route: '/assets/a1' }).
//
// `extraRoutes` mounts additional destinations alongside `ui`, for asserting that a page
// navigates somewhere — give the destination a stub element and check it rendered. Without it a
// navigation test has to rebuild this whole provider tree by hand and then drifts from it.
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    path = '/',
    extraRoutes = [],
  }: { route?: string; path?: string; extraRoutes?: { path: string; element: ReactElement }[] } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path={path} element={ui} />
            {extraRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
