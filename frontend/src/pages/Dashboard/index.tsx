import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  KeyRound,
  TrendingDown,
  DollarSign,
  UserCheck,
  Gauge,
  ShoppingCart,
  KeyRound as KeyIcon,
  ClipboardCheck,
  ArrowRightLeft,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Lightbulb,
  ShieldCheck,
  Wrench as WrenchIcon,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, CardHeader, Badge, StatusBadge, Button, EmptyState } from '@/components/ui';
import { BarChart, DonutChart, ProgressBarChart } from '@/components/Charts';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { computeUtilization } from '@/lib/utilization';
import { kpis as staticKpis, assetLifecycleData, activities, approvals, maintenanceRecords } from '@/data/fixtures/mockData';
import { aiInsights } from '@/data/fixtures/aiData';
import { cn } from '@/lib/cn';

// Ported from src/pages/Dashboard.tsx. Total Assets/Available/Assigned/In Maintenance/Expired
// Warranty/Software Licenses and both distribution charts (Department, Asset Type) now come
// from assetService/licenseService via dashboardService/useDashboardStats — real, not the
// legacy's disconnected hardcoded numbers (legacy showed "1,248 total assets" while the real
// Asset Management page only ever had 15). Monthly Depreciation/Monthly Cost, AI Insights, the
// Oracle FA Reconciliation banner, the Asset Lifecycle trend chart, Pending Approvals, Recent
// Activities, and the Maintenance Calendar stay as static illustrative content ported verbatim
// — none of those have a real domain yet (Approval, Activity log, AI, Reconciliation are Phase
// 6/7+ work; the acquisition/retirement trend has no historical tracking in the Asset domain).
// See DASHBOARD-MIGRATION.md for the full KEEP/COMPUTE/DEFER breakdown.

const activityIcons: Record<string, ReactNode> = {
  assignment: <UserCheck className="h-4 w-4" />,
  maintenance: <WrenchIcon className="h-4 w-4" />,
  procurement: <ShoppingCart className="h-4 w-4" />,
  license: <KeyIcon className="h-4 w-4" />,
  audit: <ClipboardCheck className="h-4 w-4" />,
  transfer: <ArrowRightLeft className="h-4 w-4" />,
};

const severityConfig = {
  high: { bg: 'bg-error-50', text: 'text-error-600', dot: 'bg-error-500', label: 'High Risk' },
  medium: { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500', label: 'Medium' },
  low: { bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-500', label: 'Low' },
  info: { bg: 'bg-brand-50', text: 'text-brand-600', dot: 'bg-brand-500', label: 'Info' },
} as const;

export function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading, error, refetch } = useDashboardStats();
  // `stats` is null only while loading/errored, when the KPI grid below isn't rendered at all;
  // the zero fallback keeps this free of a non-null assertion rather than guarding twice.
  const utilization = computeUtilization(stats ?? { available: 0, assigned: 0 });
  const upcomingMaintenance = maintenanceRecords.filter((m) => m.status === 'Scheduled' || m.status === 'Overdue').slice(0, 4);

  const kpiCards = stats
    ? [
        { label: 'Total Assets', value: stats.totalAssets, icon: Boxes, color: 'brand', sub: 'across all locations' },
        { label: 'Available', value: stats.available, icon: CheckCircle2, color: 'success', sub: 'ready to assign' },
        { label: 'Assigned', value: stats.assigned, icon: UserCheck, color: 'accent', sub: 'in active use' },
        { label: 'Utilization', value: `${utilization.percent}%`, icon: Gauge, color: 'brand', sub: `${utilization.assigned} of ${utilization.eligible} assignable assets` },
        { label: 'In Maintenance', value: stats.inMaintenance, icon: Wrench, color: 'warning', sub: 'under repair' },
        { label: 'Expired Warranty', value: stats.expiredWarranty, icon: AlertTriangle, color: 'error', sub: 'needs attention' },
        { label: 'Software Licenses', value: stats.softwareLicenseCount, icon: KeyRound, color: 'singer', sub: 'active contracts' },
        { label: 'Monthly Depreciation', value: `$${(staticKpis.monthlyDepreciation / 1000).toFixed(1)}K`, icon: TrendingDown, color: 'accent', sub: 'illustrative — no depreciation model yet' },
        { label: 'Monthly Cost', value: `$${(staticKpis.monthlyCost / 1000).toFixed(1)}K`, icon: DollarSign, color: 'success', sub: 'illustrative — no depreciation model yet' },
      ]
    : [];

  const colorMap: Record<string, { bg: string; text: string }> = {
    brand: { bg: 'bg-brand-50', text: 'text-brand-600' },
    success: { bg: 'bg-success-50', text: 'text-success-600' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-600' },
    error: { bg: 'bg-error-50', text: 'text-error-600' },
    accent: { bg: 'bg-accent-50', text: 'text-accent-600' },
    // Singer CI accent -- used only on Software Licenses, deliberately not on Total Assets
    // (which sits directly above the error-colored Expired Warranty card and would read as a
    // second alert in the same column). See RAISE-BRAND-STYLE-GUIDE.md Sec2/Sec4.
    singer: { bg: 'bg-singer-50', text: 'text-singer-600' },
  };

  return (
    <AppShell current="dashboard" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'Dashboard' }]}>
      {error ? (
        <Card className="p-0">
          <EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="Unable to load dashboard" description={error} action={<Button onClick={refetch}>Retry</Button>} />
        </Card>
      ) : loading || !stats ? (
        <div className="flex items-center justify-center py-24 text-body text-surface-400">Loading dashboard...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => {
              const c = colorMap[kpi.color];
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="p-5 hover:shadow-md transition-shadow">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', c.bg)}>
                    <Icon className={cn('h-5 w-5', c.text)} />
                  </div>
                  <p className="text-display font-bold text-surface-900 mt-4">{kpi.value}</p>
                  <p className="text-body font-medium text-surface-700 mt-1">{kpi.label}</p>
                  <p className="text-caption text-surface-500 mt-0.5">{kpi.sub}</p>
                </Card>
              );
            })}
          </div>

          {/* AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader
                title="AI Insights"
                description="AI-detected findings across your portfolio"
                action={
                  <span className="inline-flex items-center gap-1.5 text-caption font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    {aiInsights.length} findings
                  </span>
                }
              />
              <div className="p-3">
                {aiInsights.slice(0, 3).map((insight) => {
                  const InsightIcon = insight.icon;
                  const sevConfig = severityConfig[insight.severity];
                  return (
                    <div key={insight.id} className="flex items-start gap-3 px-2 py-3 rounded-md hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0">
                      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', sevConfig.bg)}>
                        <InsightIcon className={cn('h-4.5 w-4.5', sevConfig.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('inline-flex items-center gap-1 text-caption font-medium px-1.5 py-0.5 rounded', sevConfig.bg, sevConfig.text)}>
                            <span className={cn('h-1.5 w-1.5 rounded-full', sevConfig.dot)} />
                            {sevConfig.label}
                          </span>
                          {insight.count > 0 && <span className="text-caption text-surface-500">{insight.count} assets</span>}
                        </div>
                        <p className="text-body font-medium text-surface-900 mt-1">{insight.title}</p>
                        <p className="text-caption text-surface-500 mt-0.5">{insight.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-caption text-surface-400">Confidence</span>
                            <div className="h-1.5 w-16 bg-surface-100 rounded-full overflow-hidden">
                              <div className={cn('h-full rounded-full', insight.confidence >= 85 ? 'bg-success-500' : insight.confidence >= 70 ? 'bg-warning-500' : 'bg-error-500')} style={{ width: `${insight.confidence}%` }} />
                            </div>
                            <span className="text-caption font-medium text-surface-600">{insight.confidence}%</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-caption font-medium text-brand-600">
                            {insight.actionLabel}
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="flex flex-col">
              <CardHeader title="AI Portfolio Health" description="AI-assessed portfolio metrics" />
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100">
                  <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-caption text-surface-500">Overall Health Score</p>
                    <p className="text-heading font-bold text-surface-900">78<span className="text-body text-surface-400">/100</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-error-50 border border-error-100">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-error-600" />
                    <span className="text-body font-medium text-surface-800">High Risk Assets</span>
                  </div>
                  <span className="text-heading font-bold text-error-600">7</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-warning-50 border border-warning-100">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-5 w-5 text-warning-600" />
                    <span className="text-body font-medium text-surface-800">Idle &gt; 90 days</span>
                  </div>
                  <span className="text-heading font-bold text-warning-600">14</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-brand-50 border border-brand-100">
                  <div className="flex items-center gap-2.5">
                    <Lightbulb className="h-5 w-5 text-brand-600" />
                    <span className="text-body font-medium text-surface-800">Optimizations</span>
                  </div>
                  <span className="text-heading font-bold text-brand-600">5</span>
                </div>

                <Button variant="outline" size="sm" className="mt-auto w-full" leftIcon={<Sparkles className="h-4 w-4 text-brand-600" />} onClick={() => navigate('/ai')}>
                  Open AI Decision Center
                </Button>
              </div>
            </Card>
          </div>

          {/* Oracle FA Reconciliation Highlight Banner */}
          <div className="bg-gradient-to-r from-surface-900 to-brand-950 text-white rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-surface-800 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center text-brand-300 shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-caption font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Oracle FA Synced</span>
                  <span className="text-caption text-surface-400">94.8% Match Rate</span>
                </div>
                <h3 className="text-body font-bold text-white mt-0.5">Oracle Fixed Assets (FA) & Physical Register Reconciliation</h3>
                <p className="text-caption text-surface-300">1,152 matched · 28 ghost assets detected on floor · 19 unverified paper assets</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <Button variant="outline" size="sm" className="border-surface-600 bg-white/10 hover:bg-white/20 text-white w-full md:w-auto" onClick={() => navigate('/reconciliation')}>
                Review Discrepancies (49)
              </Button>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader title="Asset Lifecycle" description="Acquisitions vs. retirements over time" action={
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-caption"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" />Acquired</span>
                  <span className="flex items-center gap-1.5 text-caption"><span className="h-2.5 w-2.5 rounded-full bg-accent-400" />Retired</span>
                </div>
              } />
              <div className="p-5 h-64">
                <BarChart data={assetLifecycleData.map((d) => ({ label: d.month, value: d.acquired, value2: d.retired }))} height={220} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Department Distribution" description="Assets by department" />
              <div className="p-5">
                <DonutChart
                  data={stats.departmentDistribution.map((d) => ({ label: d.label, value: d.count, color: d.color }))}
                  centerValue={stats.totalAssets.toString()}
                  centerLabel="Total"
                />
              </div>
            </Card>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader title="Asset Status" description="Current portfolio breakdown" />
              <div className="p-5">
                <ProgressBarChart
                  data={[
                    { label: 'Available', value: stats.available, max: stats.totalAssets, color: 'bg-success-500' },
                    { label: 'Assigned', value: stats.assigned, max: stats.totalAssets, color: 'bg-brand-500' },
                    { label: 'In Maintenance', value: stats.inMaintenance, max: stats.totalAssets, color: 'bg-warning-500' },
                    { label: 'Retired', value: stats.retired, max: stats.totalAssets, color: 'bg-surface-400' },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHeader title="Asset Type" description="Distribution by category" />
              <div className="p-5">
                <ProgressBarChart data={stats.assetTypeDistribution.map((t) => ({ label: t.label, value: t.count, max: stats.totalAssets, color: t.color }))} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Pending Approvals" description="Requests awaiting review" action={<Badge variant="warning">{approvals.length} pending</Badge>} />
              <div className="p-3">
                {approvals.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', a.priority === 'High' ? 'bg-error-50 text-error-600' : a.priority === 'Medium' ? 'bg-warning-50 text-warning-600' : 'bg-surface-100 text-surface-500')}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-surface-900 truncate">{a.title}</p>
                      <p className="text-caption text-surface-500">{a.type} · {a.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">Review</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Third row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader title="Recent Activities" description="Latest events across the platform" action={<Button variant="ghost" size="sm">View all</Button>} />
              <div className="p-3">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">{activityIcons[act.type]}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-surface-900">{act.title}</p>
                      <p className="text-caption text-surface-500">{act.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-caption text-surface-400">{act.timestamp}</p>
                      <p className="text-caption text-surface-500 mt-0.5">{act.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Maintenance Calendar" description="Upcoming maintenance" action={<Calendar className="h-4 w-4 text-surface-400" />} />
              <div className="p-3">
                {upcomingMaintenance.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-50 transition-colors">
                    <div className="text-center shrink-0 w-10">
                      <p className="text-caption text-surface-400 uppercase">{new Date(m.scheduledDate).toLocaleDateString('en', { month: 'short' })}</p>
                      <p className="text-title font-bold text-surface-900">{new Date(m.scheduledDate).getDate()}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium text-surface-900 truncate">{m.assetName}</p>
                      <p className="text-caption text-surface-500">{m.type} · {m.technician}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}
