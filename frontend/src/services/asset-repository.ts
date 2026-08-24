import apiClient from '@/services/api-client';
import type { Asset, AssetListQuery, AssetListResult, AssignAssetInput, CreateAssetInput } from '@/types/asset';

/**
 * Contract the AssetService depends on. HttpAssetRepository (below) is the real
 * implementation, backed by go-template-main's Asset Registry domain
 * (go-template-main/controller/assetController.go, RAISE-FR-ASSET-001) -- gated off by
 * default behind ASSET_API_ENABLED (config/featureFlags.ts) since most dev/test
 * environments have no backend/Postgres running. MockAssetRepository is the fallback used
 * whenever that flag is off. Swapping between them here is the only place AssetService or
 * any page needs to change.
 */
export interface AssetRepository {
  list(query: AssetListQuery): Promise<AssetListResult>;
  getById(id: string): Promise<Asset | null>;
  create(input: CreateAssetInput): Promise<Asset>;
  assign(input: AssignAssetInput): Promise<Asset>;
  checkIn(assetId: string): Promise<Asset>;
}

function simulateNetwork<T>(value: T, delayMs = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
}

/**
 * Backed by the legacy ESAPS fixture data (src/data/mockData.ts, copied verbatim into
 * data/fixtures/). Mutates an in-memory copy so create/assign behave like a real backend
 * within a single session — state resets on page reload, same limitation the original
 * ESAPS prototype had.
 */
export class MockAssetRepository implements AssetRepository {
  private assets: Asset[];

  constructor(seed: Asset[]) {
    this.assets = [...seed];
  }

  async list(query: AssetListQuery): Promise<AssetListResult> {
    const search = (query.search ?? '').toLowerCase();
    const filtered = this.assets.filter((a) => {
      const matchesSearch = !search || a.name.toLowerCase().includes(search) || a.code.toLowerCase().includes(search);
      const matchesStatus = !query.status || query.status === 'all' || a.status === query.status;
      const matchesDept = !query.department || query.department === 'all' || a.department === query.department;
      return matchesSearch && matchesStatus && matchesDept;
    });
    return simulateNetwork({ data: filtered, total: filtered.length });
  }

  async getById(id: string): Promise<Asset | null> {
    return simulateNetwork(this.assets.find((a) => a.id === id) ?? null);
  }

  async create(input: CreateAssetInput): Promise<Asset> {
    const id = `a${this.assets.length + 1}`;
    const code = input.code?.trim() || `AST-${(this.assets.length + 1).toString().padStart(4, '0')}`;
    const created: Asset = {
      id,
      code,
      name: input.name,
      category: input.category,
      type: input.type,
      status: 'Available',
      condition: input.condition,
      location: input.location,
      department: input.department,
      assignedTo: null,
      assignedEmployeeId: null,
      purchaseDate: input.purchaseDate,
      purchaseCost: input.purchaseCost,
      currentValue: input.purchaseCost,
      warrantyExpiry: input.warrantyExpiry ?? '',
      vendor: input.vendor ?? '',
      serialNumber: input.serialNumber,
      specs: [],
    };
    this.assets = [created, ...this.assets];
    return simulateNetwork(created);
  }

  async assign(input: AssignAssetInput): Promise<Asset> {
    const asset = this.assets.find((a) => a.id === input.assetId);
    if (!asset) {
      throw new Error(`Asset ${input.assetId} not found`);
    }
    const updated: Asset = {
      ...asset,
      status: 'Assigned',
      assignedTo: input.employeeName,
      assignedEmployeeId: input.employeeId,
      assignedDate: new Date().toISOString().split('T')[0],
    };
    this.assets = this.assets.map((a) => (a.id === input.assetId ? updated : a));
    return simulateNetwork(updated);
  }

  async checkIn(assetId: string): Promise<Asset> {
    const asset = this.assets.find((a) => a.id === assetId);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }
    const updated: Asset = {
      ...asset,
      status: 'Available',
      assignedTo: null,
      assignedEmployeeId: null,
      assignedDate: undefined,
    };
    this.assets = this.assets.map((a) => (a.id === assetId ? updated : a));
    return simulateNetwork(updated);
  }
}

/**
 * Backed by go-template-main's real Asset Registry endpoints
 * (GET/POST /assets, GET /assets/:id, POST /assets/:id/assign). Response field names match
 * the Go backend's AssetModel JSON tags exactly (go-template-main/model/assetModel.go), so no
 * mapping layer is needed -- the wire shape and the Asset domain type are the same shape.
 */
export class HttpAssetRepository implements AssetRepository {
  async list(query: AssetListQuery): Promise<AssetListResult> {
    const params: Record<string, string | number> = {};
    if (query.search) params.search = query.search;
    if (query.status && query.status !== 'all') params.status = query.status;
    if (query.department && query.department !== 'all') params.department = query.department;
    if (query.page) params.page = query.page;
    if (query.limit) params.limit = query.limit;

    const response = await apiClient.get<AssetListResult>('/assets', { params });
    return response.data;
  }

  async getById(id: string): Promise<Asset | null> {
    try {
      const response = await apiClient.get<Asset>(`/assets/${id}`);
      return response.data;
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async create(input: CreateAssetInput): Promise<Asset> {
    const response = await apiClient.post<Asset>('/assets', input);
    return response.data;
  }

  async assign(input: AssignAssetInput): Promise<Asset> {
    const { assetId, ...body } = input;
    const response = await apiClient.post<Asset>(`/assets/${assetId}/assign`, body);
    return response.data;
  }

  async checkIn(assetId: string): Promise<Asset> {
    const response = await apiClient.post<Asset>(`/assets/${assetId}/checkin`, {});
    return response.data;
  }
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}
