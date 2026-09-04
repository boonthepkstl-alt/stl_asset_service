import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CreateAssetPage } from './index';

// The page is a single scrollable form (no step wizard, no Review step), so every field is
// reachable on first render and all validation runs in one pass on submit.
const renderPage = () =>
  renderWithProviders(<CreateAssetPage />, { route: '/assets/create', path: '/assets/create' });

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText('Asset Name'), { target: { value: 'Test Laptop' } });
  fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'IT Hardware' } });
  fireEvent.change(screen.getByLabelText('Serial Number'), { target: { value: 'SN-TEST-1' } });
  fireEvent.change(screen.getByLabelText('Purchase Cost ($)'), { target: { value: '1200' } });
  fireEvent.change(screen.getByLabelText('Purchase Date'), { target: { value: '2026-01-01' } });
  fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'Engineering' } });
  fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'HQ - Floor 4' } });
};

describe('CreateAssetPage', () => {
  it('renders every section and field on one page without step navigation', () => {
    renderPage();

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Financial Information')).toBeInTheDocument();
    expect(screen.getByText('Assignment & Location')).toBeInTheDocument();

    expect(screen.getByLabelText('Asset Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Asset Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Serial Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Vendor')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Purchase Cost ($)')).toBeInTheDocument();
    expect(screen.getByLabelText('Purchase Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Warranty Expiry')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Condition')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('shows a sticky action bar with Cancel and Create Asset', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Asset' })).toBeInTheDocument();
  });

  it('shows every required-field error at once on submit and does not create the asset', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

    expect(screen.getByText('Asset name is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Serial number is required')).toBeInTheDocument();
    expect(screen.getByText('Purchase cost is required')).toBeInTheDocument();
    expect(screen.getByText('Purchase date is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
    expect(screen.getByText('Location is required')).toBeInTheDocument();

    // Nothing was created: the success toast never appears and the form is still mounted.
    await waitFor(() => expect(screen.getByLabelText('Asset Name')).toBeInTheDocument());
    expect(screen.queryByText(/has been registered/)).not.toBeInTheDocument();
  });

  it('creates the asset and navigates away once every required field is filled', async () => {
    renderPage();

    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Create Asset' }));

    await waitFor(() => {
      expect(screen.getByText(/Test Laptop .* has been registered\./)).toBeInTheDocument();
    });
    // Same independent-commit race as CreateEmployee's equivalent test: the toast and the
    // route change flush separately, so the form's removal needs its own wait.
    await waitFor(() => expect(screen.queryByLabelText('Asset Name')).not.toBeInTheDocument());
  });
});
