import { FileSpreadsheet } from 'lucide-react';
import { ModulePage } from '@/pages/_shared/ModulePage';

// Remaining placeholder set — Assets/Employees graduated in Phase 4/5A, Maintenance/Tickets in
// Phase 5B, Licenses in Phase 5C, AI Decision Center in Phase 5G. This one still proves routing +
// AppShell + design system integration only, per MIGRATION-PLAN.md.

export function ReconciliationPage() {
  return <ModulePage pageId="reconciliation" breadcrumbLabel="Oracle FA Reconciliation" icon={<FileSpreadsheet className="h-6 w-6" />} description="Migrates from src/pages/Reconciliation.tsx once Oracle FA is connected in Phase 6." />;
}
