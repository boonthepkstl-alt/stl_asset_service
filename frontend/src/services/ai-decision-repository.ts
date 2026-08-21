import type { AIDecisionMetrics } from '@/types/ai-decision';

/**
 * Contract aiDecisionService depends on. MockAIDecisionRepository is the only implementation in
 * Phase 5G — swap it for an HttpAIDecisionRepository backed by the Go+Gemini endpoints in
 * AI-ARCHITECTURE.md once Phase 7 lands, same pattern as every other MockRepository.
 */
export interface AIDecisionRepository {
  list(): Promise<AIDecisionMetrics[]>;
  getByAssetId(assetId: string): Promise<AIDecisionMetrics | null>;
}

function simulateNetwork<T>(value: T, delayMs = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}

/** Backed by the AI-only fields of the legacy fixture (data/fixtures/decisionData.ts). */
export class MockAIDecisionRepository implements AIDecisionRepository {
  private metrics: AIDecisionMetrics[];

  constructor(seed: AIDecisionMetrics[]) {
    this.metrics = [...seed];
  }

  async list(): Promise<AIDecisionMetrics[]> {
    return simulateNetwork([...this.metrics]);
  }

  async getByAssetId(assetId: string): Promise<AIDecisionMetrics | null> {
    return simulateNetwork(this.metrics.find((m) => m.assetId === assetId) ?? null);
  }
}
