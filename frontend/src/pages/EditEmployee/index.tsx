import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, User } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, EmptyState, Input, Select, SectionCard, useToast } from '@/components/ui';
import { EMPLOYEE_API_ENABLED } from '@/config/featureFlags';
import { useAuth } from '@/contexts/AuthContext';
import { departments, locations, employeeAuditLogs as fixtureAudit, type EmployeeAuditLog } from '@/data/fixtures/mockData';
import { useEmployee } from '@/hooks/useEmployee';
import { useEmployees } from '@/hooks/useEmployees';
import { employeeService } from '@/services/employee-service';
import type { EmployeeStatus } from '@/types/employee';

// Full-page "Edit Identity & Organization" flow, converted from the modal that used to live on
// pages/EmployeeDetail (mirrors the CreateEmployee modal -> full-page conversion, PRs #78/#82).
// Layout/navigation change only: the fields, their labels, the phone duplicate check (which
// excludes the employee being edited, PR #79) and the updateEmployee payload are unchanged --
// no field added, removed or renamed, and UpdateEmployeeInput is untouched.

export function EditEmployeePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const { employee, loading, error, notFound, refetch } = useEmployee(employeeId);
  const { employees: allEmployees, loading: employeesLoading, error: employeesError } = useEmployees({});
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    jobTitle: '',
    department: '',
    location: '',
    deskLocation: '',
    phone: '',
    manager: '',
    status: 'Active' as EmployeeStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill from the loaded record. The old modal did this in openEditModal(); here the record
  // arrives asynchronously, so the same assignment runs once the employee resolves.
  useEffect(() => {
    if (!employee) return;
    setForm({
      jobTitle: employee.jobTitle,
      department: employee.department,
      location: employee.location,
      deskLocation: employee.deskLocation || '',
      phone: employee.phone || '',
      manager: employee.manager || '',
      status: employee.status,
    });
    setErrors({});
  }, [employee]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setStatus = (v: EmployeeStatus) => setForm((f) => ({ ...f, status: v }));

  // Client-side-only duplicate check against the already-fetched employee list -- excludes the
  // employee currently being edited (matching your own existing phone is not a duplicate). No
  // new repository method, no backend change; email isn't editable here (see
  // UpdateEmployeeInput), so only phone is checked.
  //
  // 'unverified' matters: useEmployees returns an empty array both when there genuinely are no
  // other employees and when the list request is still in flight or failed outright. Treating
  // that empty array as "no duplicate found" would silently disable the check whenever the list
  // endpoint is down, so the two cases are kept distinct and submit refuses to guess.
  type PhoneCheck = { status: 'ok' } | { status: 'duplicate'; message: string } | { status: 'unverified'; message: string };

  const checkPhoneDuplicate = (phone: string): PhoneCheck => {
    const trimmed = phone.trim();
    if (!trimmed || !employee) return { status: 'ok' };
    if (employeesLoading || employeesError) {
      return { status: 'unverified', message: 'Cannot check this phone number for duplicates right now. Please retry in a moment.' };
    }
    return allEmployees.some((emp) => emp.id !== employee.id && emp.phone && emp.phone.trim() === trimmed)
      ? { status: 'duplicate', message: 'An employee with this phone number already exists' }
      : { status: 'ok' };
  };

  const handlePhoneBlur = () => {
    setErrors((prev) => {
      const next = { ...prev };
      const check = checkPhoneDuplicate(form.phone);
      // Only a confirmed duplicate is a field-level error on blur -- an unverified check is
      // reported at submit time instead, so a slow list request doesn't flag a valid number.
      if (check.status === 'duplicate') next.phone = check.message;
      else delete next.phone;
      return next;
    });
  };

  const submit = async () => {
    if (!employee) return;
    const phoneCheck = checkPhoneDuplicate(form.phone);
    if (phoneCheck.status !== 'ok') {
      setErrors({ phone: phoneCheck.message });
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Same audit entries the modal recorded. The modal pushed them into EmployeeDetail's local
      // state (lost on navigation anyway); from a separate page the only way to keep them visible
      // on the detail page's Audit tab is to prepend to the shared fixture array it reads from.
      //
      // Mock mode only. With EMPLOYEE_API_ENABLED the backend owns the audit trail, and writing
      // client-invented rows into the fixture would put entries on the Audit tab that exist
      // nowhere server-side while looking exactly like real ones.
      const actor = user?.fullName || user?.username || 'Unknown user';
      const stamp = Date.now();
      const changes: EmployeeAuditLog[] = [];
      if (form.jobTitle !== employee.jobTitle) {
        changes.push({ id: `aud-${stamp}-title`, employeeId: employee.id, action: 'Position Change', actor, timestamp: new Date().toLocaleString(), field: 'Job Title', oldValue: employee.jobTitle, newValue: form.jobTitle });
      }
      if (form.department !== employee.department) {
        changes.push({ id: `aud-${stamp}-dept`, employeeId: employee.id, action: 'Department Change', actor, timestamp: new Date().toLocaleString(), field: 'Department', oldValue: employee.department, newValue: form.department });
      }
      // Compare against the same `|| ''` normalization the form was seeded with -- comparing a
      // normalized '' against a raw undefined would log a bogus "None -> ''" change on every save
      // for any record whose deskLocation the backend omits.
      if (form.deskLocation !== (employee.deskLocation || '')) {
        changes.push({ id: `aud-${stamp}-desk`, employeeId: employee.id, action: 'Location Update', actor, timestamp: new Date().toLocaleString(), field: 'Physical Desk Workspace', oldValue: employee.deskLocation || 'None', newValue: form.deskLocation });
      }

      await employeeService.updateEmployee(employee.id, {
        jobTitle: form.jobTitle,
        department: form.department,
        location: form.location,
        deskLocation: form.deskLocation,
        phone: form.phone,
        manager: form.manager,
        status: form.status,
      });

      if (changes.length > 0 && !EMPLOYEE_API_ENABLED) fixtureAudit.unshift(...changes);

      push({ variant: 'success', title: 'Profile Updated', message: `${employee.name}'s profile has been updated.` });
      navigate(`/employees/${employee.id}`);
    } catch {
      setSubmitError('Unable to update the employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell current="employees" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Employee Management', href: '/employees' }, { label: 'Edit' }]}>
        <div className="flex items-center justify-center py-24 text-body text-surface-400">Loading employee...</div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell current="employees" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Employee Management', href: '/employees' }, { label: 'Edit' }]}>
        <EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="Unable to load employee" description={error} action={<Button onClick={refetch}>Retry</Button>} />
      </AppShell>
    );
  }

  if (notFound || !employee) {
    return (
      <AppShell current="employees" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Employee Management', href: '/employees' }, { label: 'Edit' }]}>
        <EmptyState
          icon={<User className="h-6 w-6" />}
          title="Employee not found"
          description="This employee may have left the company or the link is out of date."
          action={<Button onClick={() => navigate('/employees')}>Back to Employee Management</Button>}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      current="employees"
      onNavigate={(id) => navigate(`/${id}`)}
      breadcrumb={[{ label: 'Employee Management', href: '/employees' }, { label: employee.name, href: `/employees/${employee.id}` }, { label: 'Edit' }]}
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <SectionCard title="Basic Information" description={`Identity and contact details for ${employee.name}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="jobTitle" label="Job Title / Position" value={form.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
            <Input name="phone" label="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} onBlur={handlePhoneBlur} error={errors.phone} />
            <Select name="status" label="Status" value={form.status} onChange={(e) => setStatus(e.target.value as EmployeeStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'On Leave', value: 'On Leave' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
        </SectionCard>

        <SectionCard title="Organization & Location" description="Where this employee is based and who they report to">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select name="department" label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} options={departments.map((d) => ({ label: d, value: d }))} />
            <Select name="location" label="Location Campus" value={form.location} onChange={(e) => set('location', e.target.value)} options={locations.map((l) => ({ label: l, value: l }))} />
            <Input name="deskLocation" label="Physical Desk / Unit" value={form.deskLocation} onChange={(e) => set('deskLocation', e.target.value)} />
            <Input name="manager" label="Reporting Manager" value={form.manager} onChange={(e) => set('manager', e.target.value)} />
          </div>
        </SectionCard>

        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-body text-error-700">{submitError}</div>
        )}

        {/* Sticky action bar: `main` in AppShell is the scroll container, so bottom-0 pins this
            to the bottom of the viewport while the form scrolls behind it. */}
        <div className="sticky bottom-0 z-10 -mx-1 px-1 py-3 bg-surface-50/95 backdrop-blur border-t border-surface-200 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(`/employees/${employee.id}`)} disabled={submitting}>Cancel</Button>
          <Button onClick={submit} loading={submitting}>Save Changes</Button>
        </div>
      </div>
    </AppShell>
  );
}
