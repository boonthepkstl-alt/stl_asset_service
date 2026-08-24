import { assets as assetFixtures } from '@/data/fixtures/mockData';
import { ASSET_API_ENABLED } from '@/config/featureFlags';
import { HttpAssetRepository, MockAssetRepository, type AssetRepository } from '@/services/asset-repository';
import type { Asset, AssetListQuery, AssetListResult, AssignAssetInput, CreateAssetInput } from '@/types/asset';

// Strip the legacy `icon: LucideIcon` field from the fixture rows — the domain Asset type
// no longer carries it (see types/asset.ts and data/asset-icons.ts).
const seedAssets: Asset[] = assetFixtures.map(({ icon: _icon, ...rest }) => rest);

// ASSET_API_ENABLED (config/featureFlags.ts) is off by default -- most dev/test environments
// have no go-template-main/Postgres instance running, and the existing test suite depends on
// the mock's synchronous, seeded data. Flip it on only against a real running backend.
const repository: AssetRepository = ASSET_API_ENABLED ? new HttpAssetRepository() : new MockAssetRepository(seedAssets);

/**
 * The stable frontend contract for Asset Management pages. Every page in
 * pages/Assets, pages/AssetDetail, pages/CreateAsset calls this — never the
 * repository or the fixture data directly — so which repository implementation is active
 * (Mock vs Http) is invisible to every page that consumes this service.
 */
export const assetService = {
  listAssets: (query: AssetListQuery = {}): Promise<AssetListResult> => repository.list(query),
  getAsset: (id: string): Promise<Asset | null> => repository.getById(id),
  createAsset: (input: CreateAssetInput): Promise<Asset> => repository.create(input),
  assignAsset: (input: AssignAssetInput): Promise<Asset> => repository.assign(input),
  checkInAsset: (assetId: string): Promise<Asset> => repository.checkIn(assetId),
};
