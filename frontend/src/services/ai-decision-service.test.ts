import { beforeEach, describe, expect, it, vi } from 'vitest';

async function freshAIDecisionService() {
  vi.resetModules();
  const mod = await import('@/services/ai-decision-service');
  return mod.aiDecisionService;
}

describe('aiDecisionService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('listProfiles merges AI metrics with the live Asset snapshot, not the legacy fixture\'s own drifted copy', async () => {
    const aiDecisionService = await freshAIDecisionService();
    const profiles = await aiDecisionService.listProfiles();
    expect(profiles.length).toBeGreaterThan(0);

    const a5 = profiles.find((p) => p.assetId === 'a5');
    expect(a5).toBeDefined();
    // Real Asset 'a5' (Dell PowerEdge R750) has purchaseCost 8500 in the shared fixture — the
    // legacy decisionData.ts fixture claims $12,500 for the same asset. Assert the live value wins.
    expect(a5!.purchaseCost).toBe(8500);
    expect(a5!.assetName).toBe('Dell PowerEdge R750');
  });

  it('getProfile returns null for an asset id with no AI decision metrics', async () => {
    const aiDecisionService = await freshAIDecisionService();
    const result = await aiDecisionService.getProfile('does-not-exist');
    expect(result).toBeNull();
  });

  it('simulateDecision computes a deterministic TCO comparison from the given inputs', async () => {
    const aiDecisionService = await freshAIDecisionService();
    const profile = await aiDecisionService.getProfile('a5');
    expect(profile).not.toBeNull();

    const result = aiDecisionService.simulateDecision(
      {
        assetId: 'a5',
        repairCost: profile!.estimatedNextRepairCost,
        replacementCost: profile!.newModelReplacementCost,
        downtimeCostPerDay: 350,
        expectedLifespanExtensionYears: 1.5,
        salvageValue: profile!.estimatedSalvageValue,
        annualEnergyInflationRate: 5,
      },
      { ...profile!, purchaseCost: profile!.purchaseCost }
    );

    expect(result.repairTco).toBeGreaterThan(0);
    expect(result.replaceTco).toBeGreaterThan(0);
    expect(['REPAIR', 'REPLACE', 'MAINTAIN']).toContain(result.recommendedAction);
  });

  it('generateExecutiveBriefing computes totalAssets/capitalRequirement from real services, not hardcoded totals', async () => {
    const aiDecisionService = await freshAIDecisionService();
    const briefing = await aiDecisionService.generateExecutiveBriefing('Q1 2026');

    // Legacy hardcoded totalAssets: 1248 in the executive-summary request body — assert the
    // narrative instead reflects the real (much smaller) seeded asset count.
    expect(briefing.executiveBriefing).not.toMatch(/1,?248/);
    expect(briefing.financialImpactSummary.capitalRequirement).toBeGreaterThanOrEqual(0);
    expect(briefing.financialImpactSummary.riskMitigationValue).toBeNull();
  });
});
