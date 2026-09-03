import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CreateEmployeePage } from './index';

describe('CreateEmployeePage', () => {
  it('renders all steps fields correctly', () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

    // Step 1 fields
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Work Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Title / Position')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
  });

  it('blocks advancing past step 1 until required fields are filled', () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Work email is required')).toBeInTheDocument();
  });

  it('advances to step 2 and shows organization/location fields, then Back returns to step 1', () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test Employee' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'test.employee@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Location Campus')).toBeInTheDocument();
    expect(screen.getByLabelText('Physical Desk')).toBeInTheDocument();
    expect(screen.getByLabelText('Reporting Manager')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByLabelText('Full Name')).toHaveValue('Test Employee');
  });

  it('advances through all 3 steps and submits, creating the employee and navigating away', async () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test Employee' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'test.employee@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    fireEvent.change(screen.getByLabelText('Physical Desk'), { target: { value: 'Desk 42' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Review & Confirm')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Employee')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => {
      expect(screen.queryByText('Review & Confirm')).not.toBeInTheDocument();
    });
  });

  // The employee list backing the duplicate check loads asynchronously (MockEmployeeRepository
  // simulates network latency), so these tests wait for it before interacting with step 1 --
  // otherwise the check would run against an empty list and never find a match.
  const waitForEmployeesLoaded = async () => {
    // The "Reporting Manager" <select> options come straight from the same fetched employee
    // list the duplicate check reads -- once Sarah Chen (a seeded fixture employee) shows up as
    // an option, the list has arrived.
    await waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  };

  it('blocks advancing past step 1 when the email matches an existing employee', async () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Seed' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'seed@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'sarah.chen@raise.co' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('An employee with this email already exists')).toBeInTheDocument();
    expect(screen.queryByLabelText('Department')).not.toBeInTheDocument();
  });

  it('shows the duplicate email error on blur, matching case-insensitively', async () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Seed' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'seed@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitForEmployeesLoaded();

    const emailInput = screen.getByLabelText('Work Email');
    fireEvent.change(emailInput, { target: { value: 'SARAH.CHEN@RAISE.CO' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('An employee with this email already exists')).toBeInTheDocument();
  });

  it('blocks advancing past step 1 when the phone number matches an existing employee', async () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Seed' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'seed@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate Phone Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'unique.person@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1 (555) 234-5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('An employee with this phone number already exists')).toBeInTheDocument();
    expect(screen.queryByLabelText('Department')).not.toBeInTheDocument();
  });

  it('allows advancing when phone is left empty (phone stays optional)', () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'No Phone Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'no.phone@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByLabelText('Department')).toBeInTheDocument();
  });

  it('advances to step 2 when the email is unique', async () => {
    renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Seed' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'seed@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Unique Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'unique.tester@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByLabelText('Department')).toBeInTheDocument();
  });
});
