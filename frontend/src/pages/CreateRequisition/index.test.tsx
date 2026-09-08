import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { CreateRequisitionPage } from './index';
import { ticketService } from '@/services/ticket-service';

// Guards the Modal -> full page conversion. The point of these tests is not that a form
// renders, but that the DOMAIN behaviour survived the move: the same required fields, the same
// ticketService.createTicket() call, and Stage 1 still landing in PENDING_DEPT_APPROVAL
// (RAISE-FR-MAINT-001, AC-MAINT-001-03).

const renderPage = () =>
  renderWithProviders(<CreateRequisitionPage />, {
    route: '/maintenance/create',
    path: '/maintenance/create',
  });

describe('CreateRequisitionPage', () => {
  it('renders as a full page with every field on one screen, not in a dialog', () => {
    renderPage();

    // No dialog wrapper: this is the whole point of the change. If the page were ever put back
    // behind a Modal, ui/Modal renders role="dialog" and this fails.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(screen.getByText('Request Details')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();

    expect(screen.getByLabelText('Affected Asset')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject / Problem Summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Detailed Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Physical Location')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Submit IT Requisition' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('preselects the requester\'s first assigned asset once assets load', async () => {
    renderPage();

    // Assets arrive asynchronously, so the select starts empty and fills in afterwards.
    const assetSelect = await waitFor(() => {
      const el = screen.getByLabelText('Affected Asset') as HTMLSelectElement;
      expect(el.value).not.toBe('');
      return el;
    });
    expect(assetSelect.value).toBeTruthy();
  });

  it('keeps the Physical Location default the Modal used to prefill', () => {
    renderPage();
    expect((screen.getByLabelText('Physical Location') as HTMLInputElement).value).toBe(
      'HQ - Floor 4, Desk E-412',
    );
  });

  it('blocks submission and shows a field error when the subject is empty', async () => {
    renderPage();

    // Wait for the asset preselect so the only thing missing is the subject — this isolates
    // the title check instead of passing for the wrong reason.
    await waitFor(() => {
      expect((screen.getByLabelText('Affected Asset') as HTMLSelectElement).value).not.toBe('');
    });

    const before = (await ticketService.listTickets({})).total;
    fireEvent.click(screen.getByRole('button', { name: 'Submit IT Requisition' }));

    expect(await screen.findByText('Subject / problem summary is required')).toBeInTheDocument();
    // Nothing was created — the guard has to actually stop the write, not just render a
    // message. Waited out deliberately: the mock repositories add artificial latency, so a
    // same-tick read would pass even if the write had been fired.
    await new Promise((r) => setTimeout(r, 1200));
    expect((await ticketService.listTickets({})).total).toBe(before);
  });

  it('submits through ticketService and lands the ticket in PENDING_DEPT_APPROVAL', async () => {
    renderPage();

    await waitFor(() => {
      expect((screen.getByLabelText('Affected Asset') as HTMLSelectElement).value).not.toBe('');
    });

    fireEvent.change(screen.getByLabelText('Subject / Problem Summary'), {
      target: { value: 'Keyboard keys unresponsive' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'High' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit IT Requisition' }));

    // Assert on the created record rather than on the toast: the toast is presentation, the
    // Stage 1 state transition is the acceptance criterion.
    // The repositories return { data, total } and add artificial latency on every hop —
    // getEmployee, getAsset, create, list — so this needs more than waitFor's 1s default.
    await waitFor(
      async () => {
        const { data } = await ticketService.listTickets({ search: 'Keyboard keys unresponsive' });
        expect(data).toHaveLength(1);
        expect(data[0].status).toBe('PENDING_DEPT_APPROVAL');
        expect(data[0].priority).toBe('High');
      },
      { timeout: 5000 },
    );
  });
});

// ── Context from the other two entry points ─────────────────────────────────────────────────
// Asset Detail and Employee Detail each used to open their own Modal with their own prefill.
// Those Modals are gone; this page serves them via query params, so these tests exist to keep
// each prefill from being quietly lost the way the Modals themselves were quietly missed.

describe('CreateRequisitionPage — context from query params', () => {
  it('prefills from the URL and does not let the asset preselect override an explicit assetId', async () => {
    renderWithProviders(<CreateRequisitionPage />, {
      route:
        '/maintenance/create?assetId=a5&title=Report+issue+with+Dell+PowerEdge+R750&location=DC+Rack+12&priority=Critical',
      path: '/maintenance/create',
    });

    expect((screen.getByLabelText('Subject / Problem Summary') as HTMLInputElement).value).toBe(
      'Report issue with Dell PowerEdge R750',
    );
    expect((screen.getByLabelText('Physical Location') as HTMLInputElement).value).toBe('DC Rack 12');
    expect((screen.getByLabelText('Priority') as HTMLSelectElement).value).toBe('Critical');

    // The asset options load asynchronously, and a <select> whose value matches no option yet
    // reports '' — so wait for the option to exist before asserting the selection.
    await waitFor(() => {
      expect((screen.getByLabelText('Affected Asset') as HTMLSelectElement).value).toBe('a5');
    });

    // a5 is not Sarah Chen's first assigned asset, so if the preselect effect ever stopped
    // respecting an explicit assetId this would flip to a1 once the assets load.
    await new Promise((r) => setTimeout(r, 1200));
    expect((screen.getByLabelText('Affected Asset') as HTMLSelectElement).value).toBe('a5');
  });

  it('files the ticket against the requester named in the URL, not the default', async () => {
    renderWithProviders(<CreateRequisitionPage />, {
      route: '/maintenance/create?assetId=a1&requesterId=e2&title=Filed+on+behalf',
      path: '/maintenance/create',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit IT Requisition' }));

    // Employee Detail files on the employee's behalf; the default 'e1' (Sarah Chen) would be
    // wrong there, and nothing else in the UI would reveal the substitution.
    await waitFor(
      async () => {
        const { data } = await ticketService.listTickets({ search: 'Filed on behalf' });
        expect(data).toHaveLength(1);
        expect(data[0].requester.id).toBe('e2');
      },
      { timeout: 5000 },
    );
  });

  it('returns to the page named by returnTo when cancelled, not always to the list', async () => {
    renderWithProviders(<CreateRequisitionPage />, {
      route: '/maintenance/create?assetId=a1&returnTo=%2Fassets%2Fa1',
      path: '/maintenance/create',
      extraRoutes: [{ path: '/assets/a1', element: <div>asset detail stub</div> }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByText('asset detail stub')).toBeInTheDocument();
  });
});
