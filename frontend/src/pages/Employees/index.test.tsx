import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui';
import { renderWithProviders } from '@/test/test-utils';
import { EmployeesPage } from './index';

describe('EmployeesPage', () => {
  it('renders the seeded employee roster with KPI cards', async () => {
    renderWithProviders(<EmployeesPage />, { route: '/employees', path: '/employees' });

    await waitFor(() => {
      expect(screen.getByText('Total Personnel')).toBeInTheDocument();
    });
    // AppShell's own header title also reads "Employee Management" (from pageTitles), so this
    // page legitimately renders it twice — assert presence, not uniqueness.
    expect(screen.getAllByText('Employee Management').length).toBeGreaterThan(0);
  });

  it('renders a known employee by name from the shared fixture', async () => {
    renderWithProviders(<EmployeesPage />, { route: '/employees', path: '/employees' });

    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });
  });

  it('navigates to the full-page Create Employee flow instead of opening a modal', async () => {
    // "Add Employee" moved from an in-page Modal to its own route (mirroring CreateAsset) --
    // render both routes and assert the click lands on /employees/create.
    render(
      <MemoryRouter initialEntries={['/employees']}>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/create" element={<div>Create Employee Route</div>} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Personnel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add Employee' }));

    await waitFor(() => {
      expect(screen.getByText('Create Employee Route')).toBeInTheDocument();
    });
    expect(screen.queryByText('Add New Employee Profile')).not.toBeInTheDocument();
  });
});
