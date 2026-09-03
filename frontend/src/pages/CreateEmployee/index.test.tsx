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
});
