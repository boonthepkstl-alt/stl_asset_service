import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, Input, Select, Textarea, SectionCard, useToast } from '@/components/ui';
import { departments, locations } from '@/data/fixtures/mockData';
import { assetService } from '@/services/asset-service';
import type { AssetCondition } from '@/types/asset';

// Ported from src/pages/CreateAsset.tsx. The "Create Asset" button submits through
// assetService.createAsset() (MockAssetRepository today, HttpAssetRepository once the Go
// backend lands) instead of only firing a toast — see ASSET-MANAGEMENT-API-CONTRACT.md for the
// POST /api/v1/assets contract this maps to.
//
// Layout: single scrollable page (no step wizard, no separate read-only Review step) with a
// sticky action bar. All validation therefore runs in one pass on submit.

export function CreateAssetPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: '',
    type: '',
    serial: '',
    vendor: '',
    purchaseCost: '',
    purchaseDate: '',
    warrantyExpiry: '',
    department: '',
    location: '',
    condition: 'Excellent' as AssetCondition,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Union of every check the former per-step validateStep() performed, applied in one pass so a
  // failed submit surfaces every failing field at once.
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Asset name is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.serial) e.serial = 'Serial number is required';
    if (!form.purchaseCost) e.purchaseCost = 'Purchase cost is required';
    if (!form.purchaseDate) e.purchaseDate = 'Purchase date is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.location) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await assetService.createAsset({
        name: form.name,
        code: form.code || undefined,
        category: form.category,
        type: form.type,
        serialNumber: form.serial,
        vendor: form.vendor || undefined,
        purchaseCost: Number(form.purchaseCost) || 0,
        purchaseDate: form.purchaseDate,
        warrantyExpiry: form.warrantyExpiry || undefined,
        department: form.department,
        location: form.location,
        condition: form.condition,
        description: form.description || undefined,
      });
      push({ variant: 'success', title: 'Asset created', message: `${created.name} (${created.code}) has been registered.` });
      navigate('/assets');
    } catch {
      setSubmitError('Unable to create the asset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell current="assets" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Asset Management', href: '/assets' }, { label: 'Create Asset' }]}>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <SectionCard title="Basic Information" description="Enter the core details for this asset">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-surface-300 flex items-center justify-center text-surface-400 bg-surface-50">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Upload Photo</Button>
                <p className="text-caption text-surface-500 mt-1.5">PNG or JPG, max 5MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" label="Asset Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
              <Input name="code" label="Asset Code" value={form.code} onChange={(e) => set('code', e.target.value)} helpText="Leave blank for auto-generation" />
              <Select name="category" label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} error={errors.category} options={[
                { value: '', label: 'Select category' },
                { value: 'IT Hardware', label: 'IT Hardware' },
                { value: 'Mobile', label: 'Mobile' },
                { value: 'Office Equipment', label: 'Office Equipment' },
                { value: 'Infrastructure', label: 'Infrastructure' },
              ]} />
              <Select name="type" label="Type" value={form.type} onChange={(e) => set('type', e.target.value)} options={[
                { value: '', label: 'Select type' },
                { value: 'Laptop', label: 'Laptop' },
                { value: 'Monitor', label: 'Monitor' },
                { value: 'Smartphone', label: 'Smartphone' },
                { value: 'Tablet', label: 'Tablet' },
                { value: 'Server', label: 'Server' },
                { value: 'Printer', label: 'Printer' },
              ]} />
              <Input name="serial" label="Serial Number" value={form.serial} onChange={(e) => set('serial', e.target.value)} error={errors.serial} />
              <Input name="vendor" label="Vendor" value={form.vendor} onChange={(e) => set('vendor', e.target.value)} />
            </div>
            <Textarea name="description" label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </SectionCard>

        <SectionCard title="Financial Information" description="Purchase details and warranty">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="purchaseCost" label="Purchase Cost ($)" type="number" value={form.purchaseCost} onChange={(e) => set('purchaseCost', e.target.value)} error={errors.purchaseCost} />
            <Input name="purchaseDate" label="Purchase Date" type="date" value={form.purchaseDate} onChange={(e) => set('purchaseDate', e.target.value)} error={errors.purchaseDate} />
            <Input name="warrantyExpiry" label="Warranty Expiry" type="date" value={form.warrantyExpiry} onChange={(e) => set('warrantyExpiry', e.target.value)} helpText="Leave blank if no warranty" />
          </div>
        </SectionCard>

        <SectionCard title="Assignment & Location" description="Where this asset will be stored or assigned">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select name="department" label="Department" value={form.department} onChange={(e) => set('department', e.target.value)} error={errors.department} options={[
              { value: '', label: 'Select department' },
              ...departments.map((d) => ({ value: d, label: d })),
            ]} />
            <Select name="location" label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} error={errors.location} options={[
              { value: '', label: 'Select location' },
              ...locations.map((l) => ({ value: l, label: l })),
            ]} />
            <Select name="condition" label="Condition" value={form.condition} onChange={(e) => set('condition', e.target.value as AssetCondition)} options={[
              { value: 'Excellent', label: 'Excellent' },
              { value: 'Good', label: 'Good' },
              { value: 'Fair', label: 'Fair' },
              { value: 'Poor', label: 'Poor' },
            ]} />
          </div>
        </SectionCard>

        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-body text-error-700">{submitError}</div>
        )}

        {/* Sticky action bar: `main` in AppShell is the scroll container, so bottom-0 pins this
            to the bottom of the viewport while the form scrolls behind it. */}
        <div className="sticky bottom-0 z-10 -mx-1 px-1 py-3 bg-surface-50/95 backdrop-blur border-t border-surface-200 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/assets')} disabled={submitting}>Cancel</Button>
          <Button onClick={submit} loading={submitting}>Create Asset</Button>
        </div>
      </div>
    </AppShell>
  );
}
