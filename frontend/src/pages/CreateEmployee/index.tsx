import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Button, Input, Select, SectionCard, useToast } from '@/components/ui';
import { departments, locations } from '@/data/fixtures/mockData';
import { useEmployees } from '@/hooks/useEmployees';
import { employeeService } from '@/services/employee-service';

// Full-page "Create Employee" flow, mirroring pages/CreateAsset/index.tsx's single scrollable
// page + sticky action bar pattern (layout-only change -- see
// EMPLOYEE-MANAGEMENT-MIGRATION.md / DEVELOPMENT-LOG.md for the modal -> full-page conversion).
// Fields are exactly the ones the former "Add New Employee Profile" modal on pages/Employees
// had -- no new fields were added.

export function CreateEmployeePage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { employees: employeeList } = useEmployees({});

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeCode: '',
    jobTitle: '',
    phone: '',
    department: departments[0] || 'Engineering',
    location: locations[0] || 'HQ - Floor 4',
    deskLocation: '',
    manager: 'David Kim',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Client-side-only duplicate checks against the already-fetched employee list -- no new
  // repository method, no backend change. Case-insensitive exact match on email; phone matches
  // as-typed (stays optional, see checkPhoneDuplicate callers below).
  const checkEmailDuplicate = (email: string): string | undefined => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return undefined;
    return employeeList.some((emp) => emp.email.toLowerCase() === trimmed)
      ? 'An employee with this email already exists'
      : undefined;
  };

  const checkPhoneDuplicate = (phone: string): string | undefined => {
    const trimmed = phone.trim();
    if (!trimmed) return undefined;
    return employeeList.some((emp) => emp.phone && emp.phone.trim() === trimmed)
      ? 'An employee with this phone number already exists'
      : undefined;
  };

  // Employee Code is optional (left blank -> auto-generated), so the duplicate check only runs
  // when the user actually typed one -- same "skip when blank" rule as phone, above.
  const checkEmployeeCodeDuplicate = (employeeCode: string): string | undefined => {
    const trimmed = employeeCode.trim().toLowerCase();
    if (!trimmed) return undefined;
    return employeeList.some((emp) => emp.employeeCode && emp.employeeCode.toLowerCase() === trimmed)
      ? 'An employee with this code already exists'
      : undefined;
  };

  // Format check for the company's real Employee ID convention, confirmed with the business
  // 2026-09-03: 8 digits, where the first 2 are the Gregorian join year (e.g. 26725898 -> joined
  // 2026). The remaining 6 digits are issued by HR/payroll -- RAISE cannot derive or generate
  // them, so this only validates what a user types; it deliberately does NOT auto-generate this
  // format (leaving the field blank still falls back to the existing EMP-#### placeholder).
  const checkEmployeeCodeFormat = (employeeCode: string): string | undefined => {
    const trimmed = employeeCode.trim();
    if (!trimmed) return undefined;
    return /^\d{8}$/.test(trimmed)
      ? undefined
      : 'Employee ID must be exactly 8 digits (first 2 = join year, e.g. 26725898)';
  };

  // Format is checked before uniqueness: a malformed code is the more actionable error, and a
  // duplicate check against a malformed value tells the user nothing useful.
  const checkEmployeeCode = (employeeCode: string): string | undefined =>
    checkEmployeeCodeFormat(employeeCode) ?? checkEmployeeCodeDuplicate(employeeCode);

  // On-blur validation (not on every keystroke): shows the duplicate error as soon as the user
  // leaves the field, but never invents the "required" error here -- that's validate()'s job.
  const handleEmailBlur = () => {
    setErrors((prev) => {
      const next = { ...prev };
      const dup = checkEmailDuplicate(form.email);
      if (dup) next.email = dup;
      else if (next.email && next.email !== 'Work email is required') delete next.email;
      return next;
    });
  };

  const handlePhoneBlur = () => {
    setErrors((prev) => {
      const next = { ...prev };
      const dup = checkPhoneDuplicate(form.phone);
      if (dup) next.phone = dup;
      else delete next.phone;
      return next;
    });
  };

  const handleEmployeeCodeBlur = () => {
    setErrors((prev) => {
      const next = { ...prev };
      const err = checkEmployeeCode(form.employeeCode);
      if (err) next.employeeCode = err;
      else delete next.employeeCode;
      return next;
    });
  };

  // Every field check the former per-step validateStep() performed, in one pass on submit so all
  // failing fields show their inline error at once.
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Work email is required';
    else {
      const emailDup = checkEmailDuplicate(form.email);
      if (emailDup) e.email = emailDup;
    }
    const phoneDup = checkPhoneDuplicate(form.phone);
    if (phoneDup) e.phone = phoneDup;
    const employeeCodeErr = checkEmployeeCode(form.employeeCode);
    if (employeeCodeErr) e.employeeCode = employeeCodeErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await employeeService.createEmployee({
        name: form.name,
        email: form.email,
        employeeCode: form.employeeCode || undefined,
        jobTitle: form.jobTitle || undefined,
        phone: form.phone || undefined,
        department: form.department,
        location: form.location,
        deskLocation: form.deskLocation || undefined,
        manager: form.manager || undefined,
        status: 'Active',
      });
      push({ variant: 'success', title: 'Employee Profile Created', message: `${created.name} (${created.employeeCode}) added to system.` });
      navigate('/employees');
    } catch {
      setSubmitError('Unable to create the employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell current="employees" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Employee Management', href: '/employees' }, { label: 'Create Employee' }]}>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <SectionCard title="Basic Information" description="Enter the employee's core details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
            <Input name="email" label="Work Email" value={form.email} onChange={(e) => set('email', e.target.value)} onBlur={handleEmailBlur} error={errors.email} />
            <Input name="employeeCode" label="Employee Code" value={form.employeeCode} onChange={(e) => set('employeeCode', e.target.value)} onBlur={handleEmployeeCodeBlur} error={errors.employeeCode} helpText="8 digits, first 2 = join year (e.g. 26725898). Leave blank for auto-generation." />
            <Input name="jobTitle" label="Job Title / Position" value={form.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
            <Input name="phone" label="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} onBlur={handlePhoneBlur} error={errors.phone} />
          </div>
        </SectionCard>

        <SectionCard title="Organization & Location" description="Where this employee is based and who they report to">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select name="department" label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} options={departments.map((d) => ({ label: d, value: d }))} />
            <Select name="location" label="Location Campus" value={form.location} onChange={(e) => set('location', e.target.value)} options={locations.map((l) => ({ label: l, value: l }))} />
            <Input name="deskLocation" label="Physical Desk" value={form.deskLocation} onChange={(e) => set('deskLocation', e.target.value)} />
            <Select name="manager" label="Reporting Manager" value={form.manager} onChange={(e) => set('manager', e.target.value)} options={employeeList.map((e) => ({ label: e.name, value: e.name }))} />
          </div>
        </SectionCard>

        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-body text-error-700">{submitError}</div>
        )}

        {/* Sticky action bar: `main` in AppShell is the scroll container, so bottom-0 pins this
            to the bottom of the viewport while the form scrolls behind it. */}
        <div className="sticky bottom-0 z-10 -mx-1 px-1 py-3 bg-surface-50/95 backdrop-blur border-t border-surface-200 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/employees')} disabled={submitting}>Cancel</Button>
          <Button onClick={submit} loading={submitting}>Create Employee</Button>
        </div>
      </div>
    </AppShell>
  );
}
