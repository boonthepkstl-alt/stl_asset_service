package repository

import "singer/go-template-new-2026-06/model"

// AssetRepository is the RAISE Asset Registry's persistence contract. Unlike
// SampleRepository, this is PostgreSQL-only -- a real domain doesn't need the demo's
// per-database fan-out (see COMPANY-FOUNDATION-BASELINE.md Sec1: "Repository facade shape
// ... KEEP as convention, PROJECT for instances -- each domain builds its own repository
// following it").
type AssetRepository interface {
	Create(asset model.AssetModel) error
	GetByID(id string) (model.AssetModel, error)
	Update(id string, asset model.AssetModel) (bool, error)
	Delete(id string) (bool, error)
	List(query model.AssetListQuery) ([]model.AssetModel, int, error)
}

type assetRepository struct {
	pg AssetPGRepository
}

func NewAssetRepository(pg AssetPGRepository) AssetRepository {
	return &assetRepository{pg: pg}
}

func (r *assetRepository) Create(asset model.AssetModel) error {
	return r.pg.Insert(asset)
}

func (r *assetRepository) GetByID(id string) (model.AssetModel, error) {
	return r.pg.GetByID(id)
}

func (r *assetRepository) Update(id string, asset model.AssetModel) (bool, error) {
	return r.pg.Update(id, asset)
}

func (r *assetRepository) Delete(id string) (bool, error) {
	return r.pg.Delete(id)
}

func (r *assetRepository) List(query model.AssetListQuery) ([]model.AssetModel, int, error) {
	return r.pg.List(query)
}
