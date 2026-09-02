package repository

import "singer/go-template-new-2026-06/model"

// AssetHandoverRepository -- PostgreSQL-only, same thin-wrapper convention as
// TicketRepository/AssetRepository.
type AssetHandoverRepository interface {
	Create(handover model.AssetHandoverModel) error
	GetByCode(code string) (model.AssetHandoverModel, error)
	Update(id string, handover model.AssetHandoverModel) (bool, error)
	List(query model.AssetHandoverListQuery) ([]model.AssetHandoverModel, int, error)
	HasActiveForAsset(assetID string) (bool, error)
	CountByCodePrefix(prefix string) (int, error)
}

type assetHandoverRepository struct {
	pg AssetHandoverPGRepository
}

func NewAssetHandoverRepository(pg AssetHandoverPGRepository) AssetHandoverRepository {
	return &assetHandoverRepository{pg: pg}
}

func (r *assetHandoverRepository) Create(handover model.AssetHandoverModel) error {
	return r.pg.Insert(handover)
}

func (r *assetHandoverRepository) GetByCode(code string) (model.AssetHandoverModel, error) {
	return r.pg.GetByCode(code)
}

func (r *assetHandoverRepository) Update(id string, handover model.AssetHandoverModel) (bool, error) {
	return r.pg.Update(id, handover)
}

func (r *assetHandoverRepository) List(query model.AssetHandoverListQuery) ([]model.AssetHandoverModel, int, error) {
	return r.pg.List(query)
}

func (r *assetHandoverRepository) HasActiveForAsset(assetID string) (bool, error) {
	return r.pg.HasActiveForAsset(assetID)
}

func (r *assetHandoverRepository) CountByCodePrefix(prefix string) (int, error) {
	return r.pg.CountByCodePrefix(prefix)
}
