import { screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { employeeService } from '@/services/employee-service';
import type { Employee } from '@/types/employee';
import { EditEmployeePage } from './index';

// Full-page replacement for the former "Edit Identity & Organization" modal on EmployeeDetail.
// Fixture e1 = Sarah Chen (phone +1 (555) 234-5678), e2 = Marcus Johnson (+1 (555) 345-6789).
const renderPage = (id = 'e1') =>
  renderWithProviders(<EditEmployeePage />, { route: `/employees/${id}/edit`, path: '/employees/:employeeId/edit' });

// MockEmployeeRepository holds its records on a single module-level instance shared by every
// test in this file, so a test that saves leaks its change into the next test's expectations
// (the pre-fill test below asserts e1's *seeded* job title). Snapshot the records these tests
// write to and put them back, so the suite doesn't depend on declaration order.
const TOUCHED_IDS = ['e1', 'e2', 'e3'];
let seeded: Employee[] = [];

beforeEach(async () => {
  seeded = (await Promise.all(TOUCHED_IDS.map((id) => employeeService.getEmployee(id)))).filter(
    (e): e is Employee => e !== null
  );
});

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    seeded.map((e) =>
      employeeService.updateEmployee(e.id, {
        jobTitle: e.jobTitle,
        department: e.department,
        location: e.location,
        deskLocation: e.deskLocation,
        phone: e.phone,
        manager: e.manager,
        status: e.status,
      })
    )
  );
});

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
    const before = (await employeeService.getEmployee('e3'))?.jobTitle;
    // Wait for the pre-filled *value*, not just the field: the pre-fill effect runs a tick after
    // the input first renders, and typing before it flushes gets silently overwritten.
    await waitFor(() => expect(screen.getByLabelText('Job Title / Position')).toHaveValue(before));

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
    // The toast and the route change commit independently, so the form's removal needs its own
    // wait rather than being asserted synchronously off the back of the toast.
    await waitFor(() => expect(screen.queryByLabelText('Job Title / Position')).not.toBeInTheDocument());
    expect((await employeeService.getEmployee('e1'))?.jobTitle).toBe('Principal Engineer');
  });

  it('reports a phone number it could not verify instead of saving it unchecked', async () => {
    // Regression guard: useEmployees returns [] both when there are no other employees and when
    // the list request failed. Treating that as "no duplicate found" would silently disable the
    // check whenever the list endpoint is down, letting a real duplicate through unflagged.
    vi.spyOn(employeeService, 'listEmployees').mockRejectedValueOnce(new Error('list unavailable'));

    renderPage();
    await waitForForm();

    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1 (555) 999-0000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(screen.getByText(/could not be checked|Cannot check this phone number/i)).toBeInTheDocument());
    expect(screen.queryByText(/profile has been updated/)).not.toBeInTheDocument();
    expect((await employeeService.getEmployee('e1'))?.phone).not.toBe('+1 (555) 999-0000');
  });

  it('persists a changed field and navigates back to the employee detail page', async () => {
    renderPage('e2');
    // Same reason as the Cancel test: wait for the pre-filled value, or the pre-fill effect can
    // land after the change below and quietly discard it.
    await waitFor(() => expect(screen.getByLabelText('Physical Desk / Unit')).toHaveValue('Desk S-204'));

    fireEvent.change(screen.getByLabelText('Physical Desk / Unit'), { target: { value: 'Desk S-999' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(screen.getByText(/Marcus Johnson's profile has been updated\./)).toBeInTheDocument());
    // The route only mounts the edit page, so leaving it unmounts the form -- but the toast and
    // the route change commit independently, so this needs its own wait.
    await waitFor(() => expect(screen.queryByLabelText('Physical Desk / Unit')).not.toBeInTheDocument());
    expect((await employeeService.getEmployee('e2'))?.deskLocation).toBe('Desk S-999');
  });
});
