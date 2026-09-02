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

// ErrRequiresHandoverApproval is returned by AssignAsset when the target asset is IT
// Hardware category -- per RAISE-FR-OPS-002's IT Hardware Assignment Approval Workflow
// (PRD Sec16 Resolved Question 43), assigning this category requires going through
// AssetHandoverService.InitiateHandover (POST /assets/:id/handover) instead of the
// immediate state-change every other category still uses.
var ErrRequiresHandoverApproval = errors.New("IT Hardware assets require the handover approval workflow")

// CategoryITHardware is the one Asset Category that RAISE-FR-OPS-002's approval-workflow
// exception applies to -- matches the literal value used throughout frontend/src/data/
// fixtures/mockData.ts and frontend/src/pages/CreateAsset/index.tsx's category dropdown.
// No Go-side category enum exists in this codebase (Category is a plain string), so this is
// compared as a raw literal, same convention as every other status/category string here.
const CategoryITHardware = "IT Hardware"

// AssetService is RAISE-FR-ASSET-001's business layer -- CreateAsset/AssignAsset mirror the
// defaulting behavior already established in the frontend's MockAssetRepository
// (frontend/src/services/asset-repository.ts) exactly, so swapping the frontend's mock for a
// real HTTP call changes no page-visible behavior.
type AssetService interface {
	ListAssets(query model.AssetListQuery) (*model.AssetListResponse, error)
	GetAsset(id string) (model.AssetModel, error)
	CreateAsset(input model.CreateAssetRequest) (model.AssetModel, error)
	AssignAsset(id string, input model.AssignAssetRequest) (model.AssetModel, error)
	CheckInAsset(id string) (model.AssetModel, error)
	// CompleteHandoverAssignment performs the same state-change AssignAsset does (status ->
	// Assigned, custody fields set), but skips the CategoryITHardware guard -- this is the one
	// authorized caller of that transition for IT Hardware assets: AssetHandoverService, at
	// Stage 4 (IT Supervisor Approval) of RAISE-FR-OPS-002's approval workflow. Never call this
	// directly from a controller.
	CompleteHandoverAssignment(id string, employeeID string, employeeName string) (model.AssetModel, error)
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

	if asset.Category == CategoryITHardware {
		log.Infof("AssignAsset rejected - id: %s is IT Hardware, requires handover approval workflow", id)
		return model.AssetModel{}, ErrRequiresHandoverApproval
	}

	return s.applyAssignment(id, asset, input.EmployeeID, input.EmployeeName)
}

// CompleteHandoverAssignment is AssetHandoverService's Stage 4 completion call -- see the
// AssetService interface doc comment. Intentionally skips the CategoryITHardware guard
// AssignAsset enforces, since this *is* the authorized path for that category once approved.
func (s *assetService) CompleteHandoverAssignment(id string, employeeID string, employeeName string) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Infof("CompleteHandoverAssignment - id: %s, employeeId: %s", id, employeeID)

	asset, err := s.repo.GetByID(id)
	if err != nil {
		log.Errorf("CompleteHandoverAssignment lookup error: %v", err)
		return model.AssetModel{}, ErrAssetNotFound
	}

	return s.applyAssignment(id, asset, employeeID, employeeName)
}

// applyAssignment is the shared state-change AssignAsset/CompleteHandoverAssignment both use:
// status -> Assigned, custody fields set, matching MockAssetRepository.assign exactly.
func (s *assetService) applyAssignment(id string, asset model.AssetModel, employeeID string, employeeName string) (model.AssetModel, error) {
	log := logger.GetLogger()

	today := time.Now().Format("2006-01-02")
	asset.Status = "Assigned"
	asset.AssignedTo = &employeeName
	asset.AssignedEmployeeID = &employeeID
	asset.AssignedDate = &today

	updated, err := s.repo.Update(id, asset)
	if err != nil {
		log.Errorf("applyAssignment update error: %v", err)
		return model.AssetModel{}, err
	}
	if !updated {
		return model.AssetModel{}, ErrAssetNotFound
	}

	return asset, nil
}

// CheckInAsset is AssignAsset's inverse (RAISE-FR-OPS-002): clears the custody fields and
// returns the asset to "Available". The detailed workflow (approval step, who may check in,
// holder data model) is still an open question in RAISE-PRD.md Sec16 Q11-Q13, so this only
// implements the confirmed, symmetric state transition -- no approval/permission logic is
// invented here.
func (s *assetService) CheckInAsset(id string) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Infof("CheckInAsset - id: %s", id)

	asset, err := s.repo.GetByID(id)
	if err != nil {
		log.Errorf("CheckInAsset lookup error: %v", err)
		return model.AssetModel{}, ErrAssetNotFound
	}

	asset.Status = "Available"
	asset.AssignedTo = nil
	asset.AssignedEmployeeID = nil
	asset.AssignedDate = nil

	updated, err := s.repo.Update(id, asset)
	if err != nil {
		log.Errorf("CheckInAsset update error: %v", err)
		return model.AssetModel{}, err
	}
	if !updated {
		return model.AssetModel{}, ErrAssetNotFound
	}

	return asset, nil
}
