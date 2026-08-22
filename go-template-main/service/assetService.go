package service

import (
	"errors"
	"fmt"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/repository"
	"time"

	"github.com/google/uuid"
)

var ErrAssetNotFound = errors.New("asset not found")

// AssetService is RAISE-FR-ASSET-001's business layer -- CreateAsset/AssignAsset mirror the
// defaulting behavior already established in the frontend's MockAssetRepository
// (frontend/src/services/asset-repository.ts) exactly, so swapping the frontend's mock for a
// real HTTP call changes no page-visible behavior.
type AssetService interface {
	ListAssets(query model.AssetListQuery) (*model.AssetListResponse, error)
	GetAsset(id string) (model.AssetModel, error)
	CreateAsset(input model.CreateAssetRequest) (model.AssetModel, error)
	AssignAsset(id string, input model.AssignAssetRequest) (model.AssetModel, error)
}

type assetService struct {
	repo repository.AssetRepository
}

func NewAssetService(repo repository.AssetRepository) AssetService {
	return &assetService{repo: repo}
}

func (s *assetService) ListAssets(query model.AssetListQuery) (*model.AssetListResponse, error) {
	log := logger.GetLogger()
	log.Infof("ListAssets - query: %+v", query)

	items, total, err := s.repo.List(query)
	if err != nil {
		return nil, err
	}

	return &model.AssetListResponse{Data: items, Total: total}, nil
}

func (s *assetService) GetAsset(id string) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Infof("GetAsset - id: %s", id)

	return s.repo.GetByID(id)
}

// CreateAsset generates an ID (UUID, like SampleService.CreateSample) and an asset code when
// none is supplied -- MockAssetRepository generates `AST-0001`-style sequential codes keyed to
// list length, which isn't meaningful once assets are deleted or paginated server-side, so
// this uses a date+random-suffix code instead. Status always starts "Available" and
// currentValue defaults to purchaseCost, matching MockAssetRepository.create exactly.
func (s *assetService) CreateAsset(input model.CreateAssetRequest) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Infof("CreateAsset - input: %+v", input)

	code := input.Code
	if code == "" {
		code = fmt.Sprintf("AST-%s", uuid.New().String()[:8])
	}

	asset := model.AssetModel{
		ID:             uuid.New().String(),
		Code:           code,
		Name:           input.Name,
		Category:       input.Category,
		Type:           input.Type,
		Status:         "Available",
		Condition:      input.Condition,
		Location:       input.Location,
		Department:     input.Department,
		PurchaseDate:   input.PurchaseDate,
		PurchaseCost:   input.PurchaseCost,
		CurrentValue:   input.PurchaseCost,
		WarrantyExpiry: input.WarrantyExpiry,
		Vendor:         input.Vendor,
		SerialNumber:   input.SerialNumber,
		Specs:          []model.AssetSpec{},
	}

	if err := s.repo.Create(asset); err != nil {
		log.Errorf("CreateAsset error: %v", err)
		return model.AssetModel{}, err
	}

	return asset, nil
}

// AssignAsset sets status to "Assigned" and stamps today's date, matching
// MockAssetRepository.assign exactly (frontend/src/services/asset-repository.ts).
func (s *assetService) AssignAsset(id string, input model.AssignAssetRequest) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Infof("AssignAsset - id: %s, employeeId: %s", id, input.EmployeeID)

	asset, err := s.repo.GetByID(id)
	if err != nil {
		log.Errorf("AssignAsset lookup error: %v", err)
		return model.AssetModel{}, ErrAssetNotFound
	}

	today := time.Now().Format("2006-01-02")
	asset.Status = "Assigned"
	asset.AssignedTo = &input.EmployeeName
	asset.AssignedEmployeeID = &input.EmployeeID
	asset.AssignedDate = &today

	updated, err := s.repo.Update(id, asset)
	if err != nil {
		log.Errorf("AssignAsset update error: %v", err)
		return model.AssetModel{}, err
	}
	if !updated {
		return model.AssetModel{}, ErrAssetNotFound
	}

	return asset, nil
}
