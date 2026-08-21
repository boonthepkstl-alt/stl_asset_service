import { sampleDecisionProfiles } from '@/data/fixtures/decisionData';
import { assetService } from '@/services/asset-service';
import { licenseService } from '@/services/license-service';
import { MockAIDecisionRepository, type AIDecisionRepository } from '@/services/ai-decision-repository';
import type {
  AIDecisionMetrics,
  AIDecisionProfile,
  DecisionSimulationInput,
  DecisionSimulationResult,
  ExecutiveBriefing,
} from '@/types/ai-decision';

// Strip the legacy fixture's own (drifted) Asset-field snapshot — only the AI-only columns are
// seeded into the repository. See types/ai-decision.ts for why.
const seedMetrics: AIDecisionMetrics[] = sampleDecisionProfiles.map((p) => ({
  assetId: p.assetId,
  ageYears: p.ageYears,
  expectedLifespanYears: p.expectedLifespanYears,
  cumulativeRepairCost: p.cumulativeRepairCost,
  estimatedNextRepairCost: p.estimatedNextRepairCost,
  annualMaintenanceCost: p.annualMaintenanceCost,
  downtimeDaysLastYear: p.downtimeDaysLastYear,
  failureRatePerYear: p.failureRatePerYear,
  mtbfHours: p.mtbfHours,
  mttrHours: p.mttrHours,
  newModelReplacementCost: p.newModelReplacementCost,
  newModelEnergySavingsYear: p.newModelEnergySavingsYear,
  estimatedSalvageValue: p.estimatedSalvageValue,
  healthScore: p.healthScore,
  riskScore: p.riskScore,
  recommendation: p.recommendation,
  recommendationConfidence: p.recommendationConfidence,
  paybackPeriodMonths: p.paybackPeriodMonths,
  tco3YearRepair: p.tco3YearRepair,
  tco3YearReplace: p.tco3YearReplace,
  costSavings3Year: p.costSavings3Year,
  aiRationale: p.aiRationale,
  riskFactors: p.riskFactors,
  actionItems: p.actionItems,
}));

const repository: AIDecisionRepository = new MockAIDecisionRepository(seedMetrics);

async function mergeWithAsset(metrics: AIDecisionMetrics): Promise<AIDecisionProfile | null> {
  const asset = await assetService.getAsset(metrics.assetId);
  if (!asset) return null;
  return {
    ...metrics,
    assetCode: asset.code,
    assetName: asset.name,
    category: asset.category,
    department: asset.department,
    location: asset.location,
    purchaseCost: asset.purchaseCost,
    currentValue: asset.currentValue,
    condition: asset.condition,
    status: asset.status,
  };
}

/**
 * The stable frontend contract for the AI Decision Center page. AIDecision is its own domain —
 * a one-way read against assetService/licenseService for the live snapshot fields those already
 * own (AIDecision → Asset, AIDecision → License, never the reverse — verified no other service
 * imports from here).
 */
export const aiDecisionService = {
  listProfiles: async (): Promise<AIDecisionProfile[]> => {
    const metrics = await repository.list();
    const merged = await Promise.all(metrics.map(mergeWithAsset));
    return merged.filter((p): p is AIDecisionProfile => p !== null);
  },

  getProfile: async (assetId: string): Promise<AIDecisionProfile | null> => {
    const metrics = await repository.getByAssetId(assetId);
    if (!metrics) return null;
    return mergeWithAsset(metrics);
  },

  // Pure deterministic financial model — no I/O, ported verbatim from
  // data/fixtures/decisionData.ts's calculateSimulation (same formula, renamed for the domain
  // boundary). Real Gemini-driven re-analysis is Phase 7 work (see AI-DECISION-MIGRATION.md).
  simulateDecision: (input: DecisionSimulationInput, baseProfile: AIDecisionProfile): DecisionSimulationResult => {
    const years = 3;
    const downtimeDaysYear = baseProfile.downtimeDaysLastYear;

    const repairTco =
      input.repairCost +
      baseProfile.annualMaintenanceCost * years * 1.15 +
      downtimeDaysYear * input.downtimeCostPerDay * years;

    const replaceTco =
      input.replacementCost - input.salvageValue +
      baseProfile.annualMaintenanceCost * 0.25 * years -
      baseProfile.newModelEnergySavingsYear * years * (1 + input.annualEnergyInflationRate / 100);

    const netSavings = repairTco - replaceTco;
    const roiPercent = (netSavings / (input.replacementCost || 1)) * 100;
    const breakEvenMonths = Math.max(1, Math.min(36, (input.replacementCost - input.salvageValue) / Math.max(1, (repairTco - replaceTco) / 36)));

    const recommendedAction = netSavings > 500 ? 'REPLACE' : netSavings < -500 ? 'REPAIR' : 'MAINTAIN';
    const confidence = Math.min(99, Math.max(70, Math.round(75 + Math.abs(netSavings) / 200)));

    return {
      repairTco: Math.round(repairTco),
      replaceTco: Math.round(replaceTco),
      netSavings: Math.round(netSavings),
      roiPercent: Math.round(roiPercent),
      breakEvenMonths: Number(breakEvenMonths.toFixed(1)),
      recommendedAction,
      confidence,
    };
  },

  // Legacy called a live /api/ai/executive-summary Gemini endpoint and fell back to a fully
  // hardcoded narrative (fake totalAssets: 1248, fake savings figures) if the call failed — the
  // same disconnected-numbers problem as the Dashboard. There is no Gemini integration in this
  // app yet (that's Phase 7 — AI-ARCHITECTURE.md), so this substitutes real numbers from
  // assetService/licenseService/listProfiles into the narrative instead of inventing an LLM
  // call this app has no backend to serve. `keyRecommendations` and `riskMitigationValue` stay
  // as documented static illustrative content — there's no Approval/Reconciliation domain yet to
  // compute them from (same DEFER reasoning as the Dashboard's Oracle FA banner).
  generateExecutiveBriefing: async (timeframe: string): Promise<ExecutiveBriefing> => {
    const [{ data: assets }, profiles, { data: licenses }] = await Promise.all([
      assetService.listAssets({}),
      aiDecisionService.listProfiles(),
      licenseService.listLicenses({}),
    ]);

    const totalAssets = assets.length;
    const portfolioValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const replaceCandidates = profiles.filter((p) => p.recommendation === 'REPLACE');
    const capitalRequirement = replaceCandidates.reduce((sum, p) => sum + p.newModelReplacementCost, 0);
    const potentialSavings = licenses.reduce(
      (sum, l) => sum + l.allocatedSeats.filter((s) => s.usageStatus === 'Inactive (>30d)').length * l.costPerSeat,
      0
    );

    return {
      timeframe,
      executiveBriefing: `Executive Briefing for ${timeframe}: The organizational asset portfolio stands at $${(portfolioValue / 1000).toFixed(1)}K net book value across ${totalAssets} registered units. AI Decision analysis flags ${replaceCandidates.length} asset${replaceCandidates.length === 1 ? '' : 's'} for replacement, requiring $${capitalRequirement.toLocaleString()} in capital allocation. Oracle FA reconciliation match rate and audit-risk figures are not yet available from a live domain (pending Phase 6 Reconciliation integration).`,
      keyRecommendations: [
        `Review and approve $${capitalRequirement.toLocaleString()} CapEx for the ${replaceCandidates.length} flagged high-risk asset replacement${replaceCandidates.length === 1 ? '' : 's'}`,
        'Oracle FA reconciliation batch adjustments — pending Phase 6 Reconciliation domain',
        'SaaS license seat optimization — see Software License Waste Scanner for current dormant-seat detail',
      ],
      financialImpactSummary: {
        potentialSavings,
        capitalRequirement,
        riskMitigationValue: null, // no Reconciliation/Audit domain yet to compute this from — see AI-DECISION-MIGRATION.md
      },
    };
  },
};
