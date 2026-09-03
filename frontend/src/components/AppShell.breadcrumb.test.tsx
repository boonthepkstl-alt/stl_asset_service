import { screen, fireEvent, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/test-utils';
import { AppShell } from './AppShell';

// Regression coverage for AppShell's breadcrumb (PR #84). Worth its own file: the `href` field
// existed on the breadcrumb prop for a long time and ~9 pages passed real values, but the
// renderer ignored it entirely and emitted a plain <span> for every crumb -- so those trails
// looked navigable and silently weren't. Nothing caught it because no test touched breadcrumbs
// at all. These tests pin the three rules that bug violated: the root is prepended and
// navigable, an href'd crumb navigates, and the current-page crumb never does.

function renderShell(breadcrumb: { label: string; href?: string }[], onNavigate = vi.fn()) {
  renderWithProviders(
    <AppShell current="employees" onNavigate={onNavigate} breadcrumb={breadcrumb}>
      <div />
    </AppShell>
  );
  // Scoped to the breadcrumb landmark: the sidebar renders nav items with the same labels
  // ("Employee Management", "Asset Management"), so an unscoped query matches both.
  const crumbs = within(screen.getByRole('navigation', { name: 'Breadcrumb' }));
  return { onNavigate, crumbs };
}

describe('AppShell breadcrumb', () => {
  it('prepends a Home crumb that pages do not pass themselves', () => {
    const { crumbs } = renderShell([{ label: 'Employee Management' }]);

    // AppShell owns the root crumb -- the 39 call sites used to hardcode `{ label: 'RAISE' }`
    // each, which is exactly how they drifted out of sync.
    expect(crumbs.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('navigates to the dashboard when Home is clicked', () => {
    const { onNavigate, crumbs } = renderShell([{ label: 'Employee Management' }]);

    fireEvent.click(crumbs.getByRole('button', { name: 'Home' }));

    // Bare nav id, not the '/dashboard' path: AppShell is router-agnostic and every call site
    // implements onNavigate as navigate('/' + id), so a leading slash would double it.
    expect(onNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('renders an intermediate crumb with an href as a navigating button', () => {
    const { onNavigate, crumbs } = renderShell([
      { label: 'Employee Management', href: '/employees' },
      { label: 'Create Employee' },
    ]);

    fireEvent.click(crumbs.getByRole('button', { name: 'Employee Management' }));

    expect(onNavigate).toHaveBeenCalledWith('employees');
  });

  it('renders an intermediate crumb without an href as plain text', () => {
    const { crumbs } = renderShell([{ label: 'Asset Details' }, { label: 'AST-0001' }]);

    expect(crumbs.getByText('Asset Details')).toBeInTheDocument();
    expect(crumbs.queryByRole('button', { name: 'Asset Details' })).not.toBeInTheDocument();
  });

  it('never links the last crumb, even when it carries an href', () => {
    // The regression this guards: the last crumb is the page you are already on, so linking it
    // is a no-op that still looks clickable. Several pages pass an href on their final crumb.
    const { crumbs } = renderShell([{ label: 'Asset Management', href: '/assets' }]);

    expect(crumbs.getByText('Asset Management')).toBeInTheDocument();
    expect(crumbs.queryByRole('button', { name: 'Asset Management' })).not.toBeInTheDocument();
  });

  it('leaves Home inert when it is the only crumb', () => {
    // Edge case: with an empty trail, Home is itself the current page, so the last-crumb rule
    // applies to it and it stops being a link.
    const { crumbs } = renderShell([]);

    expect(crumbs.getByText('Home')).toBeInTheDocument();
    expect(crumbs.queryByRole('button', { name: 'Home' })).not.toBeInTheDocument();
  });
});
