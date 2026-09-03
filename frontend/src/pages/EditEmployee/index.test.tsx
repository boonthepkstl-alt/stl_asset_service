import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { employeeService } from '@/services/employee-service';
import { EditEmployeePage } from './index';

// Full-page replacement for the former "Edit Identity & Organization" modal on EmployeeDetail.
// Fixture e1 = Sarah Chen (phone +1 (555) 234-5678), e2 = Marcus Johnson (+1 (555) 345-6789).
const renderPage = (id = 'e1') =>
  renderWithProviders(<EditEmployeePage />, { route: `/employees/${id}/edit`, path: '/employees/:employeeId/edit' });

// The record itself and the employee list backing the phone duplicate check both load
// asynchronously (the mock repository simulates latency), so wait for the pre-filled form.
const waitForForm = async () => {
  await waitFor(() => expect(screen.getByLabelText('Job Title / Position')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText('Phone Number')).toHaveValue('+1 (555) 234-5678'));
};

describe('EditEmployeePage', () => {
  it('pre-fills every field from the existing employee record', async () => {
    renderPage();
    await waitForForm();

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Organization & Location')).toBeInTheDocument();

    expect(screen.getByLabelText('Job Title / Position')).toHaveValue('Senior Software Engineer');
    expect(screen.getByLabelText('Status')).toHaveValue('Active');
    expect(screen.getByLabelText('Department')).toHaveValue('Engineering');
    expect(screen.getByLabelText('Location Campus')).toHaveValue('HQ - Floor 4');
    expect(screen.getByLabelText('Physical Desk / Unit')).toHaveValue('Desk E-412');
    expect(screen.getByLabelText('Reporting Manager')).toHaveValue('David Kim');
  });

  it('shows a not-found state for an unknown employee id', async () => {
    renderPage('does-not-exist');
    await waitFor(() => expect(screen.getByText('Employee not found')).toBeInTheDocument());
  });

  it('does not save when Cancel is used', async () => {
    const { unmount } = renderPage('e3');
    await waitFor(() => expect(screen.getByLabelText('Job Title / Position')).toBeInTheDocument());
    const before = (await employeeService.getEmployee('e3'))?.jobTitle;

    fireEvent.change(screen.getByLabelText('Job Title / Position'), { target: { value: 'Cancelled Title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByLabelText('Job Title / Position')).not.toBeInTheDocument());
    expect((await employeeService.getEmployee('e3'))?.jobTitle).toBe(before);
    unmount();
  });

  it('blocks saving when the phone matches a different employee', async () => {
    renderPage();
    await waitForForm();

    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1 (555) 345-6789' } });
    fireEvent.blur(screen.getByLabelText('Phone Number'));

    expect(screen.getByText('An employee with this phone number already exists')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(screen.getByLabelText('Phone Number')).toBeInTheDocument());
    expect(screen.queryByText(/profile has been updated/)).not.toBeInTheDocument();
    expect((await employeeService.getEmployee('e1'))?.phone).toBe('+1 (555) 234-5678');
  });

  it('allows saving when the phone matches only the employee being edited (exclude-self)', async () => {
    renderPage();
    await waitForForm();

    // Phone left exactly as-is: it *does* match an existing employee record -- this one -- and
    // must not be treated as a duplicate.
    fireEvent.blur(screen.getByLabelText('Phone Number'));
    expect(screen.queryByText('An employee with this phone number already exists')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Job Title / Position'), { target: { value: 'Principal Engineer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(screen.getByText(/Sarah Chen's profile has been updated\./)).toBeInTheDocument());
    expect(screen.queryByLabelText('Job Title / Position')).not.toBeInTheDocument();
    expect((await employeeService.getEmployee('e1'))?.jobTitle).toBe('Principal Engineer');
  });

  it('persists a changed field and navigates back to the employee detail page', async () => {
    renderPage('e2');
    await waitFor(() => expect(screen.getByLabelText('Physical Desk / Unit')).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText('Physical Desk / Unit'), { target: { value: 'Desk S-999' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(screen.getByText(/Marcus Johnson's profile has been updated\./)).toBeInTheDocument());
    // The route only mounts the edit page, so leaving it unmounts the form.
    expect(screen.queryByLabelText('Physical Desk / Unit')).not.toBeInTheDocument();
    expect((await employeeService.getEmployee('e2'))?.deskLocation).toBe('Desk S-999');
  });
});
