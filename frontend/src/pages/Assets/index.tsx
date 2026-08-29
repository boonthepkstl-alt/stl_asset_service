import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, QrCode, Eye, Edit, Trash2, ArrowRightLeft, Wrench, Filter, X, Sparkles, Send, ScanLine, ChevronDown, ChevronRight, FolderTree } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Button, Badge, Avatar, StatusBadge, Select, Modal, ConfirmDialog, useToast, Alert, Input, Card, Tabs } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { AssetQrCode } from '@/components/AssetQrCode';
import { departments, locations, categories } from '@/data/fixtures/mockData';
import { getAssetIcon } from '@/data/asset-icons';
import { useAssets } from '@/hooks/useAssets';
import { assetService } from '@/services/asset-service';
import type { Asset } from '@/types/asset';

// Ported from src/pages/AssetList.tsx — see ASSET-MANAGEMENT-MIGRATION.md for the
// KEEP/MIGRATE/REFACTOR breakdown. Preserves the natural-language "Ask AI" filter box exactly
// as it was: it's a client-side keyword matcher over whatever page of assets is currently
// loaded, not a real AI call — same limitation the legacy page had, not something this
// migration introduced.
export function AssetsPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Asset['status']>('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  // RAISE-FR-ASSET-002 / Prototype P-005 "Category & Hierarchy" (F-25, OPEN-FINDINGS.md): this
  // started as a standalone /categories screen, then was folded into Asset Management as an
  // alternate view (per user request) since it's just another lens on the same Asset Registry
  // data, not a separate domain -- Design/Prototype group P-005 under Asset Management too.
  // Deliberately shows only the one parent/child relationship actually confirmed anywhere in
  // the chain (category -> its real assets), not Prototype P-005's illustrative sub-category
  // tree (Computer > Notebook/Desktop, etc.), which remains TBD (tracked as F-27).
  const [view, setView] = useState<'list' | 'category'>('list');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiInterpretation, setAiInterpretation] = useState<{ filters: { label: string; value: string }[]; count: number } | null>(null);

  const { assets, loading, error, refetch } = useAssets({
    search,
    status: statusFilter,
    department: deptFilter,
    category: categoryFilter,
  });

  const handleAISearch = () => {
    if (!aiQuery.trim()) return;
    const lower = aiQuery.toLowerCase();
    const filters: { label: string; value: string }[] = [];

    if (lower.includes('laptop') || lower.includes('notebook')) filters.push({ label: 'Type', value: 'Laptop' });
    if (lower.includes('monitor') || lower.includes('display')) filters.push({ label: 'Type', value: 'Monitor' });
    if (lower.includes('phone') || lower.includes('smartphone') || lower.includes('mobile')) filters.push({ label: 'Type', value: 'Smartphone' });
    if (lower.includes('idle') || lower.includes('available')) filters.push({ label: 'Status', value: 'Available' });
    if (lower.includes('assigned') || lower.includes('in use')) filters.push({ label: 'Status', value: 'Assigned' });
    if (lower.includes('maintenance') || lower.includes('repair')) filters.push({ label: 'Status', value: 'In Maintenance' });
    if (lower.includes('engineering')) filters.push({ label: 'Department', value: 'Engineering' });
    if (lower.includes('sales')) filters.push({ label: 'Department', value: 'Sales' });

    const statusMatch = filters.find((f) => f.label === 'Status');
    const deptMatch = filters.find((f) => f.label === 'Department');
    if (statusMatch) setStatusFilter(statusMatch.value as Asset['status']);
    if (deptMatch) setDeptFilter(deptMatch.value);

    setAiInterpretation({ filters, count: assets.length });
  };

  const clearAISearch = () => {
    setAiQuery('');
    setAiInterpretation(null);
    setStatusFilter('all');
    setDeptFilter('all');
  };

  const toggleCategoryExpanded = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const openScan = () => {
    setScanCode('');
    setScanError(null);
    setScanOpen(true);
  };

  const closeScan = () => {
    setScanOpen(false);
    setScanCode('');
    setScanError(null);
  };

  // RAISE-FR-OPS-001 (QR/Barcode Identification). This input is intentionally a plain
  // auto-focused text field rather than a camera view: real enterprise barcode/QR scanner
  // hardware works as a "keyboard wedge" -- it types the decoded code into whichever input has
  // focus, exactly like this one. Submits look up the asset by code (or id) and jump straight
  // to its record, satisfying "the identified asset can be connected to its asset record."
  //
  // AC-OPS-001-03 requires a distinct "invalid code" state, separate from "not found"
  // (AC-OPS-001-02) -- confirmed missing by TC-OPS-001-03 (F-21, OPEN-FINDINGS.md): scanning a
  // malformed code previously showed the identical "not found" message as an unmapped-but-
  // well-formed one. Every real code/id in this system (asset codes like "AST-0004", internal
  // ids like "a1", ticket codes like "REQ-2026-0043") is plain alphanumeric plus `-`/`_` -- this
  // checks only that shape, not a specific prefix/length/format, so it doesn't invent a
  // business rule about what a "valid" code looks like beyond what a scanner could plausibly
  // produce.
  const isPlausibleCodeFormat = (code: string) => /^[A-Za-z0-9_-]+$/.test(code);

  const handleScanSubmit = async () => {
    const code = scanCode.trim();
    if (!code) return;
    setScanning(true);
    setScanError(null);
    try {
      if (!isPlausibleCodeFormat(code)) {
        setScanError(`Invalid code — "${code}" doesn't look like a scannable asset code.`);
        return;
      }
      const found = await assetService.getAsset(code);
      if (!found) {
        setScanError(`No asset found for "${code}".`);
        return;
      }
      closeScan();
      navigate(`/assets/${found.id}`);
    } catch {
      setScanError('Unable to look up that code. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const columns: Column<Asset>[] = [
    {
      key: 'name',
      header: 'Asset',
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => {
        const Icon = getAssetIcon(r.type);
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
              <Icon className="h-4.5 w-4.5 text-surface-500" style={{ width: 18, height: 18 }} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-surface-900 truncate">{r.name}</p>
              <p className="text-caption text-surface-500">{r.code}</p>
            </div>
          </div>
        );
      },
    },
    { key: 'category', header: 'Category', sortable: true, sortValue: (r) => r.category, render: (r) => <span className="text-surface-600">{r.category}</span> },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'department', header: 'Department', sortable: true, sortValue: (r) => r.department, render: (r) => <span className="text-surface-600">{r.department}</span> },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (r) =>
        r.assignedTo ? (
          <div className="flex items-center gap-2">
            <Avatar initials={r.assignedTo.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="xs" color="bg-brand-500" />
            <span className="text-surface-700">{r.assignedTo}</span>
          </div>
        ) : (
          <span className="text-surface-400">—</span>
        ),
    },
    { key: 'location', header: 'Location', sortable: true, sortValue: (r) => r.location, render: (r) => <span className="text-surface-600">{r.location}</span> },
    {
      key: 'warranty',
      header: 'Warranty',
      sortable: true,
      sortValue: (r) => r.warrantyExpiry,
      // AC-WARRANTY-001-01/-02 (RAISE-FR-WARRANTY-001, field list resolved 2026-08-29:
      // warrantyExpiry only for MVP). Per explicit user direction, this isn't a standalone
      // Warranty screen (P-010) -- it's added to the relevant asset page instead, same
      // Active/Expired binary already shown on Asset Detail's "Warranty & Coverage" section
      // (a 3rd "Expiring" state would need the still-unconfirmed 90-day-style threshold from
      // AC-WARRANTY-001-03, which stays a separate open question -- not invented here).
      render: (r) => {
        const expired = new Date(r.warrantyExpiry) < new Date();
        return (
          <div className="flex flex-col gap-0.5">
            <Badge variant={expired ? 'error' : 'success'} dot>{expired ? 'Expired' : 'Active'}</Badge>
            <span className="text-caption text-surface-400">{r.warrantyExpiry}</span>
          </div>
        );
      },
    },
    {
      key: 'value',
      header: 'Current Value',
      sortable: true,
      sortValue: (r) => r.currentValue,
      align: 'right',
      render: (r) => <span className="font-medium text-surface-900">${r.currentValue.toLocaleString()}</span>,
    },
  ];

  const rowActions = (row: Asset) => [
    { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/assets/${row.id}`) },
    { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: () => push({ variant: 'info', title: 'Edit mode', message: row.name }) },
    { label: 'Transfer', icon: <ArrowRightLeft className="h-4 w-4" />, onClick: () => push({ variant: 'info', title: 'Transfer asset', message: row.name }) },
    { label: 'Schedule Maintenance', icon: <Wrench className="h-4 w-4" />, onClick: () => push({ variant: 'info', title: 'Maintenance scheduled', message: row.name }) },
    { label: 'Print QR Code', icon: <QrCode className="h-4 w-4" />, onClick: () => setQrAsset(row) },
    { divider: true, label: '' },
    { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true, onClick: () => setDeleteTarget(row) },
  ];

  return (
    <AppShell current="assets" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'Asset Management' }]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="brand">{assets.length} assets</Badge>
            {(statusFilter !== 'all' || deptFilter !== 'all' || categoryFilter !== 'all') && (
              <Button variant="ghost" size="sm" leftIcon={<X className="h-3.5 w-3.5" />} onClick={() => { setStatusFilter('all'); setDeptFilter('all'); setCategoryFilter('all'); }}>
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Import</Button>
            <Button variant="outline" size="sm" leftIcon={<QrCode className="h-4 w-4" />} onClick={openScan}>Scan QR</Button>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/assets/create')}>New Asset</Button>
          </div>
        </div>

        {showFilters && (
          <div className="card-base p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Asset['status'] | 'all')}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'Available', label: 'Available' },
                  { value: 'Assigned', label: 'Assigned' },
                  { value: 'In Maintenance', label: 'In Maintenance' },
                  { value: 'Retired', label: 'Retired' },
                ]}
              />
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
              />
              <Select
                label="Department"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                options={[{ value: 'all', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
              />
              <Select label="Location" options={[{ value: 'all', label: 'All Locations' }, ...locations.map((l) => ({ value: l, label: l }))]} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-brand-500" />
              </div>
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAISearch(); }}
                placeholder="Ask AI: e.g. 'Show me idle laptops in Engineering'"
                className="w-full rounded-xl border border-brand-200 bg-brand-50/30 pl-10 pr-4 py-2.5 text-body text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
              />
            </div>
            <Button size="sm" leftIcon={<Send className="h-4 w-4" />} onClick={handleAISearch} disabled={!aiQuery.trim()}>
              Ask AI
            </Button>
          </div>

          {aiInterpretation && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-brand-50 border border-brand-100">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-medium text-brand-700 mb-1">AI interpreted:</p>
                <div className="flex flex-wrap gap-1.5">
                  {aiInterpretation.filters.length === 0 ? (
                    <span className="text-caption text-surface-500">No specific filters detected — showing all assets.</span>
                  ) : (
                    aiInterpretation.filters.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-caption bg-white border border-brand-200 text-brand-700 px-2 py-0.5 rounded-md font-medium">
                        {f.label} = {f.value}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <button onClick={clearAISearch} className="text-surface-400 hover:text-surface-600 transition-colors shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <Tabs
          items={[
            { id: 'list', label: 'List' },
            { id: 'category', label: 'By Category' },
          ]}
          active={view}
          onChange={(id) => setView(id as 'list' | 'category')}
        />

        {error ? (
          <Alert variant="error" title="Unable to load assets">
            {error}{' '}
            <button onClick={refetch} className="underline font-medium">
              Retry
            </button>
          </Alert>
        ) : view === 'list' ? (
          <DataTable
            columns={columns}
            data={assets}
            loading={loading}
            searchable
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name or code..."
            rowActions={rowActions}
            onRowClick={(row) => navigate(`/assets/${row.id}`)}
            toolbar={
              <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />} onClick={() => setShowFilters((s) => !s)}>
                Filters
              </Button>
            }
            emptyTitle="No assets found"
            emptyDescription="Try adjusting your search or filters, or create a new asset."
            emptyAction={<Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/assets/create')}>New Asset</Button>}
          />
        ) : loading ? (
          <Card className="p-8 text-center text-body text-surface-400">Loading categories...</Card>
        ) : (
          <Card className="p-2">
            {categories.map((category) => {
              const categoryAssets = assets.filter((a) => a.category === category);
              const isOpen = expandedCategories.has(category);
              return (
                <div key={category} className="border-b border-surface-100 last:border-0">
                  <button
                    onClick={() => toggleCategoryExpanded(category)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-surface-50 rounded-md transition-colors"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4 text-surface-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-surface-400 shrink-0" />}
                    <FolderTree className="h-4 w-4 text-brand-500 shrink-0" />
                    <span className="text-body font-medium text-surface-900 flex-1">{category}</span>
                    <Badge variant="neutral">{categoryAssets.length} asset{categoryAssets.length === 1 ? '' : 's'}</Badge>
                  </button>
                  {isOpen && (
                    <div className="pl-11 pb-2">
                      {categoryAssets.length === 0 ? (
                        <p className="text-caption text-surface-400 py-2">No assets currently in this category.</p>
                      ) : (
                        categoryAssets.map((asset) => {
                          const Icon = getAssetIcon(asset.type);
                          return (
                            <button
                              key={asset.id}
                              onClick={() => navigate(`/assets/${asset.id}`)}
                              className="w-full flex items-center gap-3 py-2 text-left hover:bg-surface-50 rounded-md transition-colors -ml-1 pl-1"
                            >
                              <Icon className="h-4 w-4 text-surface-400 shrink-0" />
                              <span className="text-body text-surface-800 flex-1 min-w-0 truncate">{asset.name}</span>
                              <span className="text-caption text-surface-400 font-mono">{asset.code}</span>
                              <StatusBadge status={asset.status} />
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => push({ variant: 'success', title: 'Asset deleted', message: deleteTarget?.name })}
          title="Delete this asset?"
          message={`This will permanently remove ${deleteTarget?.name} (${deleteTarget?.code}) and all associated records. This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />

        <Modal open={!!qrAsset} onClose={() => setQrAsset(null)} title="QR Code" description={qrAsset ? `${qrAsset.name} — ${qrAsset.code}` : ''} size="sm">
          {qrAsset && <AssetQrCode assetCode={qrAsset.code} />}
        </Modal>

        <Modal open={scanOpen} onClose={closeScan} title="Scan QR / Barcode" description="Scan a code or enter it manually to jump to that asset's record." size="sm">
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-surface-100">
              <ScanLine className="h-7 w-7 text-surface-500" />
            </div>
            <Input
              autoFocus
              placeholder="Scan or type asset code..."
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleScanSubmit(); }}
              error={scanError ?? undefined}
              helpText={scanError ? undefined : 'Most scanners type directly into this field — just point and scan.'}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeScan}>Cancel</Button>
              <Button onClick={handleScanSubmit} disabled={!scanCode.trim() || scanning}>
                {scanning ? 'Looking up...' : 'Go to asset'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
