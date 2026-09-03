import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, Card, Input, Select, SectionCard, useToast } from '@/components/ui';
import { departments, locations } from '@/data/fixtures/mockData';
import { useEmployees } from '@/hooks/useEmployees';
import { employeeService } from '@/services/employee-service';
import { cn } from '@/lib/cn';

// Full-page "Create Employee" flow, mirroring pages/CreateAsset/index.tsx's step-indicator +
// SectionCard-per-step pattern (layout-only change -- see
// EMPLOYEE-MANAGEMENT-MIGRATION.md / DEVELOPMENT-LOG.md for the modal -> full-page conversion).
// Fields are exactly the ones the former "Add New Employee Profile" modal on pages/Employees
// had -- no new fields were added.

const steps = [
  { id: 1, label: 'Basic Info', description: 'Name, email, and role' },
  { id: 2, label: 'Organization & Location', description: 'Department, location, and manager' },
  { id: 3, label: 'Review', description: 'Confirm and create' },
];

export function CreateEmployeePage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const { employees: employeeList } = useEmployees({});

  const [step, setStep] = useState(1);
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
  // leaves the field, but never invents the "required" error here -- that's validateStep's job.
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

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
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
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(3, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!validateStep()) {
      setStep(1);
      return;
    }
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
    <AppShell current="employees" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'Employee Management', href: '/employees' }, { label: 'Create Employee' }]}>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center text-body font-medium transition-colors shrink-0',
                    step > s.id ? 'bg-success-500 text-white' : step === s.id ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-400'
                  )}>
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className={cn('text-caption font-medium', step >= s.id ? 'text-surface-900' : 'text-surface-400')}>{s.label}</p>
                    <p className="text-caption text-surface-400 hidden md:block">{s.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 mx-2 sm:mx-4 transition-colors', step > s.id ? 'bg-success-500' : 'bg-surface-200')} />}
              </div>
            ))}
          </div>
        </Card>

        {step === 1 && (
          <SectionCard title="Basic Information" description="Enter the employee's core details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
              <Input name="email" label="Work Email" value={form.email} onChange={(e) => set('email', e.target.value)} onBlur={handleEmailBlur} error={errors.email} />
              <Input name="employeeCode" label="Employee Code" value={form.employeeCode} onChange={(e) => set('employeeCode', e.target.value)} onBlur={handleEmployeeCodeBlur} error={errors.employeeCode} helpText="8 digits, first 2 = join year (e.g. 26725898). Leave blank for auto-generation." />
              <Input name="jobTitle" label="Job Title / Position" value={form.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
              <Input name="phone" label="Phone Number" value={form.phone} onChange={(e) => set('phone', e.target.value)} onBlur={handlePhoneBlur} error={errors.phone} />
            </div>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard title="Organization & Location" description="Where this employee is based and who they report to">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select name="department" label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} options={departments.map((d) => ({ label: d, value: d }))} />
              <Select name="location" label="Location Campus" value={form.location} onChange={(e) => set('location', e.target.value)} options={locations.map((l) => ({ label: l, value: l }))} />
              <Input name="deskLocation" label="Physical Desk" value={form.deskLocation} onChange={(e) => set('deskLocation', e.target.value)} />
              <Select name="manager" label="Reporting Manager" value={form.manager} onChange={(e) => set('manager', e.target.value)} options={employeeList.map((e) => ({ label: e.name, value: e.name }))} />
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <SectionCard title="Review & Confirm" description="Verify the details before creating the employee profile">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-50 border border-brand-200">
                <div>
                  <p className="text-title font-semibold text-surface-900">{form.name || 'Unnamed Employee'}</p>
                  <p className="text-caption text-surface-500">{form.jobTitle || 'No job title'} · {form.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <ReviewRow label="Work Email" value={form.email || '—'} />
                <ReviewRow label="Phone Number" value={form.phone || '—'} />
                <ReviewRow label="Location Campus" value={form.location} />
                <ReviewRow label="Physical Desk" value={form.deskLocation || '—'} />
                <ReviewRow label="Reporting Manager" value={form.manager || '—'} />
              </div>
              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-body text-error-700">{submitError}</div>
              )}
            </div>
          </SectionCard>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={step === 1 ? () => navigate('/employees') : back} disabled={submitting}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button rightIcon={<ChevronRight className="h-4 w-4" />} onClick={next}>Continue</Button>
          ) : (
            <Button onClick={submit} loading={submitting}>Create Employee</Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-surface-500">{label}</p>
      <p className="text-body font-medium text-surface-900">{value}</p>
    </div>
  );
}
