import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CreateEmployeePage } from './index';

// The page is a single scrollable form (no step wizard, no Review step): every field is on
// screen from first render, and all validation runs in one pass on submit. The on-blur
// duplicate/format checks are unchanged.
const renderPage = () =>
  renderWithProviders(<CreateEmployeePage />, { route: '/employees/create', path: '/employees/create' });

// The employee list backing the duplicate checks loads asynchronously (MockEmployeeRepository
// simulates network latency), so these tests wait for it before submitting -- otherwise the
// check would run against an empty list and never find a match. The "Reporting Manager" <select>
// options come from that same fetched list, so once Sarah Chen (a seeded fixture employee) shows
// up as an option, the list has arrived.
const waitForEmployeesLoaded = () =>
  waitFor(() => expect(screen.getByText('Sarah Chen')).toBeInTheDocument());

describe('CreateEmployeePage', () => {
  it('renders every section and field on one page without step navigation', () => {
    renderPage();

    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Organization & Location')).toBeInTheDocument();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Work Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Employee Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Job Title / Position')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Location Campus')).toBeInTheDocument();
    expect(screen.getByLabelText('Physical Desk')).toBeInTheDocument();
    expect(screen.getByLabelText('Reporting Manager')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('shows a sticky action bar with Cancel and Create Employee', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Employee' })).toBeInTheDocument();
  });

  it('shows every required-field error at once on submit and does not create the employee', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Work email is required')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByLabelText('Full Name')).toBeInTheDocument());
    expect(screen.queryByText(/added to system/)).not.toBeInTheDocument();
  });

  it('creates the employee and navigates away once the required fields are filled', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test Employee' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'test.employee@example.com' } });
    fireEvent.change(screen.getByLabelText('Physical Desk'), { target: { value: 'Desk 42' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => expect(screen.getByText(/Test Employee .* added to system\./)).toBeInTheDocument());
    // The toast and the route change commit independently, so the form's removal needs its own
    // wait rather than being asserted synchronously off the back of the toast. Asserting it
    // directly passed locally but failed on CI, which is how this was found.
    await waitFor(() => expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument());
  });

  it('blocks submit when the email matches an existing employee', async () => {
    renderPage();
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'sarah.chen@raise.co' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    expect(screen.getByText('An employee with this email already exists')).toBeInTheDocument();
    expect(screen.queryByText(/added to system/)).not.toBeInTheDocument();
  });

  it('shows the duplicate email error on blur, matching case-insensitively', async () => {
    renderPage();
    await waitForEmployeesLoaded();

    const emailInput = screen.getByLabelText('Work Email');
    fireEvent.change(emailInput, { target: { value: 'SARAH.CHEN@RAISE.CO' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText('An employee with this email already exists')).toBeInTheDocument();
  });

  it('blocks submit when the phone number matches an existing employee', async () => {
    renderPage();
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate Phone Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'unique.person@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1 (555) 234-5678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    expect(screen.getByText('An employee with this phone number already exists')).toBeInTheDocument();
    expect(screen.queryByText(/added to system/)).not.toBeInTheDocument();
  });

  it('allows submit when phone is left empty (phone stays optional)', async () => {
    renderPage();
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'No Phone Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'no.phone@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => expect(screen.getByText(/No Phone Tester .* added to system\./)).toBeInTheDocument());
    expect(screen.queryByText('An employee with this phone number already exists')).not.toBeInTheDocument();
  });

  it('uses a manually entered Employee Code on submit instead of auto-generating', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Coded Employee' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'coded.employee@example.com' } });
    // 8 digits, first 2 = Gregorian join year -- the company's real Employee ID convention,
    // confirmed with the business 2026-09-03.
    fireEvent.change(screen.getByLabelText('Employee Code'), { target: { value: '26900001' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => expect(screen.getByText(/26900001/)).toBeInTheDocument());
  });

  it('leaves Employee Code blank and still auto-generates (existing behavior preserved)', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Auto Code Employee' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'auto.code@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => expect(screen.getByText(/EMP-\d{4}/)).toBeInTheDocument());
  });

  it('rejects an Employee Code that is not exactly 8 digits', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Bad Code Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'bad.code@example.com' } });

    // Too short, non-numeric, and the legacy EMP-#### shape are all rejected -- HR issues an
    // 8-digit ID, so anything else is a typo rather than a valid alternative format.
    for (const bad of ['2672589', '267258980', 'EMP-0001', '2672589a']) {
      fireEvent.change(screen.getByLabelText('Employee Code'), { target: { value: bad } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));
      expect(screen.getByText(/must be exactly 8 digits/)).toBeInTheDocument();
      expect(screen.queryByText(/added to system/)).not.toBeInTheDocument();
    }
  });

  it('blocks submit when the Employee Code matches an existing employee', async () => {
    // The seeded fixtures use the legacy auto-generated EMP-#### shape, which the format check
    // now rejects outright -- so a *duplicate* can only ever be a real 8-digit HR code. Create
    // one first, then attempt to reuse it.
    const { unmount } = renderPage();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Original Code Holder' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'original.holder@example.com' } });
    fireEvent.change(screen.getByLabelText('Employee Code'), { target: { value: '26900002' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));
    await waitFor(() => expect(screen.getByText(/26900002/)).toBeInTheDocument());
    unmount();

    renderPage();
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate Code Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'unique.code.tester@example.com' } });
    fireEvent.change(screen.getByLabelText('Employee Code'), { target: { value: '26900002' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    expect(screen.getByText('An employee with this code already exists')).toBeInTheDocument();
    expect(screen.queryByText(/added to system/)).not.toBeInTheDocument();
  });

  it('submits when the email is unique', async () => {
    renderPage();
    await waitForEmployeesLoaded();

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Unique Tester' } });
    fireEvent.change(screen.getByLabelText('Work Email'), { target: { value: 'unique.tester@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Employee' }));

    await waitFor(() => expect(screen.getByText(/Unique Tester .* added to system\./)).toBeInTheDocument());
  });
});
