import { screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { employeeAuditLogs as fixtureAudit, type EmployeeAuditLog } from '@/data/fixtures/mockData';
import { EmployeeDetailPage } from './index';

// Open Finding F-38. EmployeeDetail held the shared audit fixture in `useState(fixtureAudit)`
// and derived its rows through a useMemo keyed on that value. Because pages/EditEmployee appends
// with `fixtureAudit.unshift(...)` — mutating the array in place — the memo's dependency never
// changed identity, so an append could never be reflected in a mounted instance.
//
// The append here happens AFTER mount, which is the only arrangement that distinguishes the
// broken code from the fixed code. An earlier version of this test appended before mounting and
// passed against the original bug — vacuous, and caught by mutation-testing it.
//
// What this asserts is narrow on purpose: an append becomes visible on the next render. It does
// NOT assert reactivity, because there is none — nothing notifies this page when another module
// mutates an array. The tab clicks below are the renders.

const PROBE = 'F-38 regression probe';
let appended: EmployeeAuditLog[] = [];

afterEach(() => {
  // Remove only what this file added, by identity, so the shared module fixture is left as
  // every other test found it. Splicing by index would be wrong if another test appends too.
  for (const entry of appended) {
    const at = fixtureAudit.indexOf(entry);
    if (at !== -1) fixtureAudit.splice(at, 1);
  }
  appended = [];
});

// The Audit tab and the sidebar both contain the word "Audit", and both are buttons. The tab
// carries its row count (components/ui/Tabs appends it), so its accessible name is "Audit <n>"
// while the sidebar item is exactly "Audit" — matching the trailing count separates them.
const auditTab = () => screen.getByRole('button', { name: /^Audit\s*\d+$/ });

describe('EmployeeDetail audit tab (F-38 aliasing)', () => {
  it('reflects an entry appended to the shared fixture after mount, on the next render', async () => {
    renderWithProviders(<EmployeeDetailPage />, { route: '/employees/e1', path: '/employees/:employeeId' });

    // e1 is Sarah Chen, the seeded employee the sibling tests use.
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Sarah Chen' })).toBeInTheDocument();
    });

    fireEvent.click(auditTab());
    await waitFor(() => expect(screen.getByText(/Governance Trail/)).toBeInTheDocument());
    expect(screen.queryByText(PROBE)).not.toBeInTheDocument();

    // Now append, exactly as EditEmployee does — in place, on the shared module array, while
    // this component is mounted. This is the case the original code could never recover from.
    const entry: EmployeeAuditLog = {
      id: 'audit-f38-probe',
      employeeId: 'e1',
      action: PROBE,
      field: 'Job Title',
      oldValue: 'before',
      newValue: 'after',
      actor: 'Test',
      timestamp: '2026-09-07 12:00',
    };
    fixtureAudit.unshift(entry);
    appended.push(entry);

    // Force a render the way any user interaction would. With the original snapshot+memo this
    // still showed the stale list; the rows are now derived on every render instead.
    fireEvent.click(screen.getByRole('button', { name: /^Overview/ }));
    fireEvent.click(auditTab());

    await waitFor(() => {
      expect(screen.getByText(PROBE)).toBeInTheDocument();
    });
  });
});
