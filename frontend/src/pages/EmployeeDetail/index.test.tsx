import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { EmployeeDetailPage } from './index';

describe('EmployeeDetailPage', () => {
  it('loads and displays a known employee by route param, with their assigned assets', async () => {
    renderWithProviders(<EmployeeDetailPage />, { route: '/employees/e1', path: '/employees/:employeeId' });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Sarah Chen' })).toBeInTheDocument();
    });
    // e1 (Sarah Chen) has AST-0001/AST-0002 assigned in the fixture — confirms
    // employeeService.getEmployeeAssignments actually reached assetService's data.
    await waitFor(() => {
      expect(screen.getByText('2 Devices')).toBeInTheDocument();
    });
  });

  it('shows a not-found state for an unknown employee id', async () => {
    renderWithProviders(<EmployeeDetailPage />, { route: '/employees/does-not-exist', path: '/employees/:employeeId' });

    await waitFor(() => {
      expect(screen.getByText('Employee not found')).toBeInTheDocument();
    });
  });

  // "Edit Identity & Organization" is a full page now (pages/EditEmployee), not a modal — this
  // asserts the button routes there instead of opening a dialog in place.
  it('navigates to the edit page instead of opening an edit modal', async () => {
    renderWithProviders(<EmployeeDetailPage />, {
      route: '/employees/e1',
      path: '/employees/:employeeId',
      extraRoutes: [{ path: '/employees/:employeeId/edit', element: <div>EDIT EMPLOYEE ROUTE</div> }],
    });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Identity' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Edit Identity' }));

    await waitFor(() => expect(screen.getByText('EDIT EMPLOYEE ROUTE')).toBeInTheDocument());
  });
});
