// AI Decision domain types (Phase 5G). The legacy fixture (AssetDecisionProfile in
// data/fixtures/decisionData.ts) embeds a full snapshot of Asset fields (category, department,
// location, purchaseCost, currentValue) that duplicate — and, verified by comparing values,
// silently DRIFT from — the real Asset fixture for the same assetId (e.g. legacy's decision
// profile for 'a5' says purchaseCost $12,500 while the real Asset 'a5' says $8,500). This is the
// same disconnected-mock-data problem found and fixed on the Executive Dashboard (Phase 5F) —
// see DASHBOARD-MIGRATION.md and AI-DECISION-MIGRATION.md section 2.
//
// `AIDecisionMetrics` keeps only the fields that have no equivalent in the Asset domain (AI
// scoring, maintenance telemetry, financial projections) — everything else is resolved live from
// assetService and merged in by aiDecisionService.listProfiles(), one-way dependency
// (AIDecision → Asset, never the reverse, same pattern as License → Employee/Asset).

export type DecisionRecommendation = 'REPAIR' | 'REPLACE' | 'REASSIGN' | 'RETIRE' | 'MAINTAIN';

export interface AIDecisionMetrics {
  assetId: string;
  ageYears: number;
  expectedLifespanYears: number;
  cumulativeRepairCost: number;
  estimatedNextRepairCost: number;
  annualMaintenanceCost: number;
  downtimeDaysLastYear: number;
  failureRatePerYear: number;
  mtbfHours: number;
  mttrHours: number;
  newModelReplacementCost: number;
  newModelEnergySavingsYear: number;
  estimatedSalvageValue: number;
  healthScore: number;
  riskScore: number;
  recommendation: DecisionRecommendation;
  recommendationConfidence: number;
  paybackPeriodMonths: number;
  tco3YearRepair: number;
  tco3YearReplace: number;
  costSavings3Year: number;
  aiRationale: string;
  riskFactors: string[];
  actionItems: string[];
}

// The shape pages actually render — AIDecisionMetrics plus the live Asset snapshot fields
// resolved through assetService (not the legacy fixture's own drifted copies).
export interface AIDecisionProfile extends AIDecisionMetrics {
  assetCode: string;
  assetName: string;
  category: string;
  department: string;
  location: string;
  purchaseCost: number;
  currentValue: number;
  condition: string;
  status: string;
}

export interface DecisionSimulationInput {
  assetId: string;
  repairCost: number;
  replacementCost: number;
  downtimeCostPerDay: number;
  expectedLifespanExtensionYears: number;
  salvageValue: number;
  annualEnergyInflationRate: number;
}

export interface DecisionSimulationResult {
  repairTco: number;
  replaceTco: number;
  netSavings: number;
  roiPercent: number;
  breakEvenMonths: number;
  recommendedAction: DecisionRecommendation | 'MAINTAIN';
  confidence: number;
}

export interface ExecutiveBriefing {
  timeframe: string;
  executiveBriefing: string;
  keyRecommendations: string[];
  financialImpactSummary: {
    potentialSavings: number;
    capitalRequirement: number;
    // null, not 0 — there is no Reconciliation/Audit domain yet to compute this from (Phase 6).
    // A real $0 and "not available yet" are different facts; keep them distinguishable.
    riskMitigationValue: number | null;
  };
}
