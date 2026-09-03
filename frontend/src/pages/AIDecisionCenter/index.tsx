import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Sliders,
  AlertTriangle,
  DollarSign,
  ShieldAlert,
  FileText,
  Activity,
  Zap,
  ChevronRight,
  Download,
  Check,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, CardHeader, Button, Badge, Select, useToast, EmptyState } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/Charts';
import { useAIDecisionProfiles } from '@/hooks/useAIDecisionProfiles';
import { aiDecisionService } from '@/services/ai-decision-service';
import type { AIDecisionProfile, DecisionSimulationInput, ExecutiveBriefing } from '@/types/ai-decision';
import { cn } from '@/lib/cn';

// Ported from src/pages/AIDecisionCenter.tsx. Legacy called live /api/ai/decision-matrix and
// /api/ai/executive-summary Gemini endpoints (server.ts) with a hardcoded-narrative fallback —
// this app has no such backend yet (Gemini/AI integration is Phase 7, see AI-ARCHITECTURE.md),
// so "Re-Analyze" now honestly refreshes the live Asset snapshot instead of pretending to call an
// LLM, and Executive Briefing substitutes real numbers from assetService/licenseService into the
// narrative instead of the legacy's fully invented totals. See AI-DECISION-MIGRATION.md.

export function AIDecisionCenterPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { profiles, loading, error, refetch } = useAIDecisionProfiles();

  const [activeTab, setActiveTab] = useState<'matrix' | 'fleet' | 'executive'>('matrix');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [execTimeframe, setExecTimeframe] = useState('Q1 2026');
  const [execBriefing, setExecBriefing] = useState<ExecutiveBriefing | null>(null);
  const [isGeneratingExec, setIsGeneratingExec] = useState(false);

  useEffect(() => {
    if (!selectedAssetId && profiles.length > 0) setSelectedAssetId(profiles[0].assetId);
  }, [profiles, selectedAssetId]);

  const selectedProfile = profiles.find((p) => p.assetId === selectedAssetId) ?? profiles[0] ?? null;

  const defaultSimParams = (profile: AIDecisionProfile): DecisionSimulationInput => ({
    assetId: profile.assetId,
    repairCost: profile.estimatedNextRepairCost,
    replacementCost: profile.newModelReplacementCost,
    downtimeCostPerDay: 350,
    expectedLifespanExtensionYears: 1.5,
    salvageValue: profile.estimatedSalvageValue,
    annualEnergyInflationRate: 5,
  });

  const [simOverrides, setSimOverrides] = useState<DecisionSimulationInput | null>(null);

  const simParams = useMemo(
    () => (selectedProfile ? (simOverrides?.assetId === selectedProfile.assetId ? simOverrides : defaultSimParams(selectedProfile)) : null),
    [selectedProfile, simOverrides]
  );

  const simResult = selectedProfile && simParams ? aiDecisionService.simulateDecision(simParams, selectedProfile) : null;

  const handleReanalyze = async () => {
    if (!selectedProfile) return;
    setIsAnalyzing(true);
    try {
      await refetch();
      addToast(`Refreshed ${selectedProfile.assetCode} with the latest asset data. Live Gemini re-analysis is not yet wired up (pending Phase 7 AI integration).`, 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateExecutiveBriefing = async () => {
    setIsGeneratingExec(true);
    try {
      const briefing = await aiDecisionService.generateExecutiveBriefing(execTimeframe);
      setExecBriefing(briefing);
      addToast('Executive Briefing report generated successfully', 'success');
    } catch {
      addToast('Unable to generate the Executive Briefing. Please try again.', 'error');
    } finally {
      setIsGeneratingExec(false);
    }
  };

  const replaceCandidates = profiles.filter((p) => p.recommendation === 'REPLACE');
  const totalCapexNeeded = replaceCandidates.reduce((acc, p) => acc + p.newModelReplacementCost, 0);
  const totalProjectedSavings = profiles.reduce((acc, p) => acc + (p.costSavings3Year || 0), 0);
  const avgRiskScore = profiles.length > 0 ? Math.round(profiles.reduce((acc, p) => acc + p.riskScore, 0) / profiles.length) : 0;

  if (loading) {
    return (
      <AppShell current="ai" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'AI Decision Center' }]}>
        <div className="flex items-center justify-center py-24 text-body text-surface-400">Loading AI decision profiles...</div>
      </AppShell>
    );
  }
  if (error) {
    return (
      <AppShell current="ai" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'AI Decision Center' }]}>
        <EmptyState icon={<AlertTriangle className="h-6 w-6" />} title="Unable to load AI decision profiles" description={error} action={<Button onClick={refetch}>Retry</Button>} />
      </AppShell>
    );
  }
  if (!selectedProfile) {
    return (
      <AppShell current="ai" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'AI Decision Center' }]}>
        <EmptyState icon={<Sparkles className="h-6 w-6" />} title="No AI decision profiles available" description="No assets currently have an AI-scored decision profile." />
      </AppShell>
    );
  }

  return (
    <AppShell current="ai" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'AI Decision Center' }]}>
      <div className="flex flex-col gap-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-brand-900 via-surface-900 to-accent-950 text-white rounded-xl p-6 shadow-md border border-brand-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                  RAISE Asset Intelligence
                </span>
                <span className="text-caption text-surface-400">· Deterministic financial model (live Gemini pending Phase 7)</span>
              </div>
              <h1 className="text-display font-bold tracking-tight text-white">AI Decision Center</h1>
              <p className="text-body text-surface-300 max-w-2xl mt-1">
                Automated financial lifecycle analytics, predictive Repair vs. Replace evaluation, ROI simulation, and portfolio risk management.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="md" leftIcon={<Sparkles className="h-4 w-4 text-brand-300" />} onClick={handleReanalyze} loading={isAnalyzing} className="border-brand-400/30 bg-white/10 hover:bg-white/20 text-white">
                Re-Analyze Active Asset
              </Button>
              <Button variant="primary" size="md" leftIcon={<Download className="h-4 w-4" />} onClick={() => addToast('Downloading AI Strategic Decision Matrix Report (PDF)...', 'success')}>
                Export Decision Pack
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-t border-surface-800/80 pt-4">
            <button
              onClick={() => setActiveTab('matrix')}
              className={cn('px-4 py-2 rounded-lg text-body font-medium transition-all flex items-center gap-2', activeTab === 'matrix' ? 'bg-white text-surface-900 shadow' : 'text-surface-300 hover:text-white hover:bg-white/10')}
            >
              <Sliders className="h-4 w-4" />
              Repair vs. Replace Analyzer
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={cn('px-4 py-2 rounded-lg text-body font-medium transition-all flex items-center gap-2', activeTab === 'fleet' ? 'bg-white text-surface-900 shadow' : 'text-surface-300 hover:text-white hover:bg-white/10')}
            >
              <ShieldAlert className="h-4 w-4" />
              Portfolio Risk Matrix
              <Badge variant="warning" className="ml-1">{profiles.length}</Badge>
            </button>
            <button
              onClick={() => {
                setActiveTab('executive');
                if (!execBriefing) handleGenerateExecutiveBriefing();
              }}
              className={cn('px-4 py-2 rounded-lg text-body font-medium transition-all flex items-center gap-2', activeTab === 'executive' ? 'bg-white text-surface-900 shadow' : 'text-surface-300 hover:text-white hover:bg-white/10')}
            >
              <FileText className="h-4 w-4" />
              Executive Intelligence & Briefing
            </button>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-l-4 border-l-error-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-error-50 flex items-center justify-center text-error-600"><AlertTriangle className="h-5 w-5" /></div>
              <Badge variant="error">High Priority</Badge>
            </div>
            <p className="text-display font-bold text-surface-900 mt-4">{replaceCandidates.length} Assets</p>
            <p className="text-body font-medium text-surface-700 mt-0.5">Replacement Candidates</p>
            <p className="text-caption text-surface-500 mt-1">Requires ${totalCapexNeeded.toLocaleString()} CapEx</p>
          </Card>

          <Card className="p-5 border-l-4 border-l-success-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-success-50 flex items-center justify-center text-success-600"><DollarSign className="h-5 w-5" /></div>
            </div>
            <p className="text-display font-bold text-surface-900 mt-4">${totalProjectedSavings.toLocaleString()}</p>
            <p className="text-body font-medium text-surface-700 mt-0.5">Projected 3-Yr TCO Savings</p>
            <p className="text-caption text-surface-500 mt-1">From timely replacement & reassignments</p>
          </Card>

          <Card className="p-5 border-l-4 border-l-brand-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600"><Activity className="h-5 w-5" /></div>
              <span className="text-caption text-surface-500">Fleet Average</span>
            </div>
            <p className="text-display font-bold text-surface-900 mt-4">{avgRiskScore}<span className="text-body text-surface-400 font-normal">/100</span></p>
            <p className="text-body font-medium text-surface-700 mt-0.5">Portfolio Risk Index</p>
            <p className="text-caption text-surface-500 mt-1">Based on MTBF, MTTR, & age</p>
          </Card>

          <Card className="p-5 border-l-4 border-l-accent-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600"><Zap className="h-5 w-5" /></div>
              <Badge variant="accent">Illustrative</Badge>
            </div>
            <p className="text-display font-bold text-surface-900 mt-4">14 Units</p>
            <p className="text-body font-medium text-surface-700 mt-0.5">Idle Capital In Storage</p>
            <p className="text-caption text-surface-500 mt-1">No idle-duration tracking in Asset domain yet</p>
          </Card>
        </div>

        {/* TAB 1: REPAIR VS REPLACE MATRIX */}
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-title font-bold text-surface-900">Select Critical Asset</h3>
                  <span className="text-caption text-surface-500">{profiles.length} items</span>
                </div>
                <div className="space-y-2">
                  {profiles.map((p) => {
                    const isSelected = p.assetId === selectedAssetId;
                    const recColors = {
                      REPLACE: 'bg-error-50 text-error-700 border-error-200',
                      REPAIR: 'bg-success-50 text-success-700 border-success-200',
                      REASSIGN: 'bg-brand-50 text-brand-700 border-brand-200',
                      RETIRE: 'bg-surface-100 text-surface-700 border-surface-300',
                      MAINTAIN: 'bg-accent-50 text-accent-700 border-accent-200',
                    }[p.recommendation];

                    return (
                      <div
                        key={p.assetId}
                        onClick={() => setSelectedAssetId(p.assetId)}
                        className={cn('p-3.5 rounded-xl border transition-all cursor-pointer text-left', isSelected ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20' : 'border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50')}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-caption font-bold text-surface-500">{p.assetCode}</span>
                          <span className={cn('text-caption font-semibold px-2 py-0.5 rounded-full border', recColors)}>{p.recommendation} ({p.recommendationConfidence}%)</span>
                        </div>
                        <p className="text-body font-semibold text-surface-900 truncate">{p.assetName}</p>
                        <div className="flex items-center justify-between text-caption text-surface-500 mt-2">
                          <span>{p.department} · {p.ageYears} yrs</span>
                          <span className="font-medium text-surface-700">Risk: <span className={p.riskScore > 70 ? 'text-error-600 font-bold' : 'text-success-600'}>{p.riskScore}/100</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-title font-bold text-surface-900 mb-3">Asset Technical Telemetry</h3>
                <div className="space-y-3 text-body">
                  <div className="flex justify-between py-1.5 border-b border-surface-100">
                    <span className="text-surface-500">Initial Acquisition Cost</span>
                    <span className="font-semibold text-surface-900">${selectedProfile.purchaseCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-100">
                    <span className="text-surface-500">Current Net Book Value</span>
                    <span className="font-semibold text-surface-900">${selectedProfile.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-100">
                    <span className="text-surface-500">Cumulative Repair Costs</span>
                    <span className="font-bold text-error-600">${selectedProfile.cumulativeRepairCost.toLocaleString()} ({((selectedProfile.cumulativeRepairCost / selectedProfile.purchaseCost) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-100">
                    <span className="text-surface-500">Mean Time Between Failures (MTBF)</span>
                    <span className="font-semibold text-surface-900">{selectedProfile.mtbfHours.toLocaleString()} hrs</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-100">
                    <span className="text-surface-500">Mean Time to Repair (MTTR)</span>
                    <span className="font-semibold text-surface-900">{selectedProfile.mttrHours} hrs</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-surface-500">Annual Downtime</span>
                    <span className="font-semibold text-surface-900">{selectedProfile.downtimeDaysLastYear} days/yr</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="p-6 border-2 border-brand-500/30 shadow-md">
                <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-surface-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-caption font-bold text-surface-500 uppercase">{selectedProfile.assetCode}</span>
                      <span className="text-caption text-surface-400">·</span>
                      <span className="text-caption font-medium text-surface-600">{selectedProfile.location}</span>
                    </div>
                    <h2 className="text-heading font-bold text-surface-900 mt-0.5">{selectedProfile.assetName}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-caption text-surface-500 font-medium">AI Recommended Action</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn('text-title font-extrabold px-3 py-1 rounded-lg',
                          selectedProfile.recommendation === 'REPLACE' ? 'bg-error-100 text-error-800' :
                          selectedProfile.recommendation === 'REPAIR' ? 'bg-success-100 text-success-800' :
                          selectedProfile.recommendation === 'REASSIGN' ? 'bg-brand-100 text-brand-800' : 'bg-surface-200 text-surface-800'
                        )}>
                          {selectedProfile.recommendation}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-brand-50 border border-brand-200 flex flex-col items-center justify-center text-center">
                      <span className="text-title font-bold text-brand-700">{selectedProfile.recommendationConfidence}%</span>
                      <span className="text-[10px] text-brand-500 font-semibold uppercase">Confidence</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
                  <div className="p-4 rounded-xl bg-surface-50 border border-surface-200">
                    <p className="text-caption font-semibold text-surface-500 uppercase">3-Yr Repair Strategy TCO</p>
                    <p className="text-heading font-bold text-surface-900 mt-1">${selectedProfile.tco3YearRepair.toLocaleString()}</p>
                    <p className="text-caption text-surface-500 mt-0.5">Repairs + Downtime + Maint.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200">
                    <p className="text-caption font-semibold text-brand-700 uppercase">3-Yr Replace Strategy TCO</p>
                    <p className="text-heading font-bold text-brand-900 mt-1">${selectedProfile.tco3YearReplace.toLocaleString()}</p>
                    <p className="text-caption text-brand-600 mt-0.5">New CapEx - Energy - Salvage</p>
                  </div>
                  <div className="p-4 rounded-xl bg-success-50 border border-success-200">
                    <p className="text-caption font-semibold text-success-700 uppercase">Net Financial Benefit</p>
                    <p className="text-heading font-bold text-success-800 mt-1">+${selectedProfile.costSavings3Year.toLocaleString()}</p>
                    <p className="text-caption text-success-600 mt-0.5">Payback: {selectedProfile.paybackPeriodMonths} Months</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-body font-bold text-surface-900 flex items-center gap-1.5 mb-1"><Sparkles className="h-4 w-4 text-brand-600" />AI Decision Analysis & Financial Rationale</h4>
                    <p className="text-body text-surface-700 bg-surface-50 p-3.5 rounded-lg border border-surface-200/80 leading-relaxed">{selectedProfile.aiRationale}</p>
                  </div>

                  <div>
                    <h4 className="text-body font-bold text-surface-900 mb-2">Key Risk & Operational Factors</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProfile.riskFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-2 text-body text-surface-700 bg-surface-50/70 p-2.5 rounded-lg border border-surface-200/60">
                          <AlertTriangle className="h-4 w-4 text-warning-600 shrink-0 mt-0.5" />
                          <span className="text-caption">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-body font-bold text-surface-900 mb-2">Recommended Next Actions</h4>
                    <div className="space-y-2">
                      {selectedProfile.actionItems.map((action, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-brand-50/50 border border-brand-100 hover:bg-brand-50 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className="h-5 w-5 rounded-full bg-brand-600 text-white text-caption font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="text-body font-medium text-surface-900">{action}</span>
                          </div>
                          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-3.5 w-3.5" />} onClick={() => addToast(`Action initiated: ${action}`, 'success')}>
                            Execute
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-surface-200 flex-wrap">
                  <Button variant="outline" size="md" onClick={() => navigate('/maintenance')}>Schedule Work Order</Button>
                  <Button variant="primary" size="md" leftIcon={<Check className="h-4 w-4" />} onClick={() => addToast(`Approved ${selectedProfile.recommendation} workflow for ${selectedProfile.assetCode}`, 'success')}>
                    Approve AI Recommendation
                  </Button>
                </div>
              </Card>

              {simParams && simResult && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-title font-bold text-surface-900 flex items-center gap-2"><Sliders className="h-5 w-5 text-brand-600" />Interactive "What-If" Financial Simulator</h3>
                      <p className="text-caption text-surface-500 mt-0.5">Adjust variables in real time to simulate TCO under varying repair costs, failure rates, and replacement pricing.</p>
                    </div>
                    <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={() => { setSimOverrides(null); addToast('Simulation parameters reset to default telemetry', 'info'); }}>
                      Reset
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-50 p-4 rounded-xl border border-surface-200">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">Estimated Immediate Repair Cost:</span><span className="font-bold text-surface-900">${simParams.repairCost.toLocaleString()}</span></div>
                        <input type="range" min={100} max={10000} step={100} value={simParams.repairCost} onChange={(e) => setSimOverrides({ ...simParams, repairCost: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">New Replacement Model Price:</span><span className="font-bold text-surface-900">${simParams.replacementCost.toLocaleString()}</span></div>
                        <input type="range" min={500} max={25000} step={250} value={simParams.replacementCost} onChange={(e) => setSimOverrides({ ...simParams, replacementCost: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">Downtime Cost per Day:</span><span className="font-bold text-surface-900">${simParams.downtimeCostPerDay}</span></div>
                        <input type="range" min={50} max={1500} step={50} value={simParams.downtimeCostPerDay} onChange={(e) => setSimOverrides({ ...simParams, downtimeCostPerDay: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">Estimated Salvage / Trade-In Value:</span><span className="font-bold text-surface-900">${simParams.salvageValue.toLocaleString()}</span></div>
                        <input type="range" min={0} max={5000} step={50} value={simParams.salvageValue} onChange={(e) => setSimOverrides({ ...simParams, salvageValue: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">Lifespan Extension from Repair:</span><span className="font-bold text-surface-900">{simParams.expectedLifespanExtensionYears} Years</span></div>
                        <input type="range" min={0.5} max={4} step={0.5} value={simParams.expectedLifespanExtensionYears} onChange={(e) => setSimOverrides({ ...simParams, expectedLifespanExtensionYears: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                      <div>
                        <div className="flex justify-between text-body font-medium mb-1"><span className="text-surface-700">Energy & Inflation Adjustment:</span><span className="font-bold text-surface-900">{simParams.annualEnergyInflationRate}% / yr</span></div>
                        <input type="range" min={0} max={15} step={1} value={simParams.annualEnergyInflationRate} onChange={(e) => setSimOverrides({ ...simParams, annualEnergyInflationRate: Number(e.target.value) })} className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-brand-900 to-surface-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-caption text-brand-300 font-semibold uppercase">Simulated Dynamic Decision</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-heading font-extrabold text-white">Action: {simResult.recommendedAction}</span>
                        <span className="text-caption bg-white/20 px-2 py-0.5 rounded text-white font-medium">{simResult.confidence}% confidence</span>
                      </div>
                      <p className="text-caption text-surface-300 mt-1">
                        Simulated 3-Year Savings: <span className="font-bold text-success-300">${simResult.netSavings.toLocaleString()}</span> · Break-even: <span className="font-bold text-white">{simResult.breakEvenMonths} mo</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-caption text-surface-400">Repair TCO: ${simResult.repairTco.toLocaleString()}</p>
                        <p className="text-caption text-surface-400">Replace TCO: ${simResult.replaceTco.toLocaleString()}</p>
                      </div>
                      <Button variant="primary" size="sm" onClick={() => addToast(`Simulation saved to ${selectedProfile.assetCode} scenario folder`, 'success')}>
                        Apply Scenario
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO RISK MATRIX */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-5">
                <CardHeader title="Risk Distribution" description="Fleet assets categorized by operational risk" />
                <div className="p-2">
                  <DonutChart
                    data={[
                      { label: 'Critical Risk (80-100)', value: profiles.filter((p) => p.riskScore >= 80).length, color: 'bg-error-500' },
                      { label: 'High Risk (60-79)', value: profiles.filter((p) => p.riskScore >= 60 && p.riskScore < 80).length, color: 'bg-warning-500' },
                      { label: 'Moderate (30-59)', value: profiles.filter((p) => p.riskScore >= 30 && p.riskScore < 60).length, color: 'bg-accent-500' },
                      { label: 'Low Risk (0-29)', value: profiles.filter((p) => p.riskScore < 30).length, color: 'bg-success-500' },
                    ]}
                    centerValue={`${profiles.length}`}
                    centerLabel="Evaluated"
                  />
                </div>
              </Card>

              <Card className="lg:col-span-2 p-5">
                <CardHeader title="Health Score vs. Maintenance Burden" description="Asset health (0-100) compared to cumulative repair expense" />
                <div className="h-64 p-2">
                  <BarChart
                    data={profiles.map((p) => ({ label: p.assetCode, value: p.healthScore, value2: Math.round((p.cumulativeRepairCost / p.purchaseCost) * 100) }))}
                    height={220}
                  />
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader
                title="Asset Lifecycle Decision & Risk Register"
                description="Comprehensive AI health evaluation and recommended action for organizational assets"
                action={<Button size="sm" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => addToast('Exported Risk Matrix to Excel', 'success')}>Export Matrix</Button>}
              />
              <div className="overflow-x-auto">
                <table className="w-full text-body text-left">
                  <thead className="bg-surface-50 border-b border-surface-200 text-caption font-bold text-surface-600 uppercase">
                    <tr>
                      <th className="px-4 py-3">Asset Details</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Age / Life</th>
                      <th className="px-4 py-3">Repairs / Cost</th>
                      <th className="px-4 py-3">Health / Risk</th>
                      <th className="px-4 py-3">AI Recommendation</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {profiles.map((p) => (
                      <tr key={p.assetId} className="hover:bg-surface-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-surface-900">{p.assetName}</div>
                          <div className="text-caption text-surface-500 font-mono">{p.assetCode} · {p.category}</div>
                        </td>
                        <td className="px-4 py-3.5 text-surface-700">{p.department}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-surface-900">{p.ageYears} yrs</span>
                          <span className="text-caption text-surface-400"> / {p.expectedLifespanYears} yrs</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-surface-900">${p.cumulativeRepairCost.toLocaleString()}</div>
                          <div className="text-caption text-surface-500">{((p.cumulativeRepairCost / p.purchaseCost) * 100).toFixed(0)}% of CapEx</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-surface-100 rounded-full overflow-hidden">
                              <div className={cn('h-full', p.riskScore > 75 ? 'bg-error-500' : p.riskScore > 40 ? 'bg-warning-500' : 'bg-success-500')} style={{ width: `${p.riskScore}%` }} />
                            </div>
                            <span className="text-caption font-bold text-surface-700">{p.riskScore}/100</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn('inline-flex items-center gap-1 text-caption font-bold px-2.5 py-1 rounded-full',
                            p.recommendation === 'REPLACE' ? 'bg-error-100 text-error-800' :
                            p.recommendation === 'REPAIR' ? 'bg-success-100 text-success-800' :
                            p.recommendation === 'REASSIGN' ? 'bg-brand-100 text-brand-800' : 'bg-surface-200 text-surface-800'
                          )}>
                            {p.recommendation} ({p.recommendationConfidence}%)
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedAssetId(p.assetId); setActiveTab('matrix'); }}>Deep Dive</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: EXECUTIVE INTELLIGENCE & BRIEFING */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-surface-200">
                <div>
                  <h3 className="text-heading font-bold text-surface-900">Executive Asset Intelligence Briefing</h3>
                  <p className="text-caption text-surface-500 mt-0.5">Board-ready briefing computed from live Asset/License data — narrative generation via Gemini is Phase 7 work</p>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={execTimeframe} onChange={(e) => setExecTimeframe(e.target.value)} options={[
                    { value: 'Q1 2026', label: 'Q1 2026 (Current)' },
                    { value: 'Q2 2026', label: 'Q2 2026 Forecast' },
                    { value: 'FY 2026', label: 'Full Year 2026' },
                  ]} />
                  <Button variant="outline" size="md" leftIcon={<Sparkles className="h-4 w-4 text-brand-600" />} onClick={handleGenerateExecutiveBriefing} loading={isGeneratingExec}>
                    Regenerate Briefing
                  </Button>
                  <Button variant="primary" size="md" leftIcon={<Download className="h-4 w-4" />} onClick={() => addToast('Executive Briefing exported as PDF', 'success')}>
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="my-6 p-5 rounded-xl bg-surface-50 border border-surface-200">
                <h4 className="text-title font-bold text-surface-900 mb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" />Executive Summary ({execTimeframe})</h4>
                <p className="text-body text-surface-800 leading-relaxed">
                  {execBriefing?.executiveBriefing || 'Generating briefing...'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                {(execBriefing?.keyRecommendations ?? []).map((rec: string, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-brand-50/40 border border-brand-100 flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-brand-600 text-white font-bold text-caption flex items-center justify-center shrink-0">{i + 1}</div>
                    <div><p className="text-body font-semibold text-surface-900">{rec}</p></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-200">
                <div className="p-4 rounded-xl bg-success-50 border border-success-200">
                  <span className="text-caption font-semibold text-success-700 uppercase">Total Potential OPEX Savings</span>
                  <p className="text-heading font-extrabold text-success-900 mt-1">${(execBriefing?.financialImpactSummary.potentialSavings ?? 0).toLocaleString()}</p>
                  <p className="text-caption text-success-600 mt-0.5">Dormant SaaS seats, annualized</p>
                </div>

                <div className="p-4 rounded-xl bg-brand-50 border border-brand-200">
                  <span className="text-caption font-semibold text-brand-700 uppercase">Recommended CapEx Investment</span>
                  <p className="text-heading font-extrabold text-brand-900 mt-1">${(execBriefing?.financialImpactSummary.capitalRequirement ?? 0).toLocaleString()}</p>
                  <p className="text-caption text-brand-600 mt-0.5">High-priority replacement</p>
                </div>

                <div className="p-4 rounded-xl bg-accent-50 border border-accent-200">
                  <span className="text-caption font-semibold text-accent-700 uppercase">Audit & Risk Mitigation Value</span>
                  <p className="text-heading font-extrabold text-accent-900 mt-1">
                    {execBriefing?.financialImpactSummary.riskMitigationValue == null ? 'Pending Reconciliation domain' : `$${execBriefing.financialImpactSummary.riskMitigationValue.toLocaleString()}`}
                  </p>
                  <p className="text-caption text-accent-600 mt-0.5">Reconciled variance portfolio</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
