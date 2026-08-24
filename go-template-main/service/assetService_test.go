package service

import (
	"errors"
	"singer/go-template-new-2026-06/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mockAssetRepository is an in-memory stand-in for AssetRepository -- this is the "mocked
// unit test at service/repository level" COMPANY-FOUNDATION-BASELINE.md Sec5.5 flags as
// missing from the template (every existing assertion depends on a live DB). No live DB is
// required to run these tests.
type mockAssetRepository struct {
	assets map[string]model.AssetModel
}

func newMockAssetRepository() *mockAssetRepository {
	return &mockAssetRepository{assets: map[string]model.AssetModel{}}
}

func (m *mockAssetRepository) Create(asset model.AssetModel) error {
	m.assets[asset.ID] = asset
	return nil
}

func (m *mockAssetRepository) GetByID(id string) (model.AssetModel, error) {
	a, ok := m.assets[id]
	if !ok {
		return model.AssetModel{}, errors.New("not found")
	}
	return a, nil
}

func (m *mockAssetRepository) Update(id string, asset model.AssetModel) (bool, error) {
	if _, ok := m.assets[id]; !ok {
		return false, nil
	}
	m.assets[id] = asset
	return true, nil
}

func (m *mockAssetRepository) Delete(id string) (bool, error) {
	if _, ok := m.assets[id]; !ok {
		return false, nil
	}
	delete(m.assets, id)
	return true, nil
}

func (m *mockAssetRepository) List(query model.AssetListQuery) ([]model.AssetModel, int, error) {
	items := make([]model.AssetModel, 0, len(m.assets))
	for _, a := range m.assets {
		items = append(items, a)
	}
	return items, len(items), nil
}

func TestCreateAsset_DefaultsMatchMockAssetRepository(t *testing.T) {
	repo := newMockAssetRepository()
	svc := NewAssetService(repo)

	created, err := svc.CreateAsset(model.CreateAssetRequest{
		Name:         "MacBook Pro 16\"",
		Category:     "IT Hardware",
		Type:         "Laptop",
		SerialNumber: "SN-001",
		PurchaseCost: 2500,
		PurchaseDate: "2026-01-15",
		Department:   "Engineering",
		Location:     "HQ",
		Condition:    "Excellent",
	})

	assert.NoError(t, err)
	assert.NotEmpty(t, created.ID)
	assert.NotEmpty(t, created.Code)
	// Same defaulting behavior as frontend/src/services/asset-repository.ts's
	// MockAssetRepository.create: new assets start Available, currentValue == purchaseCost.
	assert.Equal(t, "Available", created.Status)
	assert.Equal(t, 2500.0, created.CurrentValue)
	assert.Nil(t, created.AssignedTo)
	assert.Empty(t, created.Specs)

	stored, err := repo.GetByID(created.ID)
	assert.NoError(t, err)
	assert.Equal(t, created, stored)
}

func TestCreateAsset_RespectsSuppliedCode(t *testing.T) {
	svc := NewAssetService(newMockAssetRepository())

	created, err := svc.CreateAsset(model.CreateAssetRequest{
		Name: "Dell OptiPlex 7090",
		Code: "AST-9999",
	})

	assert.NoError(t, err)
	assert.Equal(t, "AST-9999", created.Code)
}

func TestAssignAsset_SetsStatusAssignedToAndDate(t *testing.T) {
	repo := newMockAssetRepository()
	svc := NewAssetService(repo)

	created, err := svc.CreateAsset(model.CreateAssetRequest{Name: "iPhone 15 Pro"})
	assert.NoError(t, err)

	assigned, err := svc.AssignAsset(created.ID, model.AssignAssetRequest{
		EmployeeID:   "e1",
		EmployeeName: "Sarah Chen",
	})

	assert.NoError(t, err)
	assert.Equal(t, "Assigned", assigned.Status)
	assert.NotNil(t, assigned.AssignedTo)
	assert.Equal(t, "Sarah Chen", *assigned.AssignedTo)
	assert.NotNil(t, assigned.AssignedEmployeeID)
	assert.Equal(t, "e1", *assigned.AssignedEmployeeID)
	assert.NotNil(t, assigned.AssignedDate)
}

func TestAssignAsset_UnknownIDReturnsNotFound(t *testing.T) {
	svc := NewAssetService(newMockAssetRepository())

	_, err := svc.AssignAsset("does-not-exist", model.AssignAssetRequest{EmployeeID: "e1", EmployeeName: "Someone"})

	assert.ErrorIs(t, err, ErrAssetNotFound)
}

func TestCheckInAsset_ClearsAssignmentAndSetsAvailable(t *testing.T) {
	repo := newMockAssetRepository()
	svc := NewAssetService(repo)

	created, err := svc.CreateAsset(model.CreateAssetRequest{Name: "iPhone 15 Pro"})
	assert.NoError(t, err)
	_, err = svc.AssignAsset(created.ID, model.AssignAssetRequest{EmployeeID: "e1", EmployeeName: "Sarah Chen"})
	assert.NoError(t, err)

	checkedIn, err := svc.CheckInAsset(created.ID)

	assert.NoError(t, err)
	assert.Equal(t, "Available", checkedIn.Status)
	assert.Nil(t, checkedIn.AssignedTo)
	assert.Nil(t, checkedIn.AssignedEmployeeID)
	assert.Nil(t, checkedIn.AssignedDate)
}

func TestCheckInAsset_UnknownIDReturnsNotFound(t *testing.T) {
	svc := NewAssetService(newMockAssetRepository())

	_, err := svc.CheckInAsset("does-not-exist")

	assert.ErrorIs(t, err, ErrAssetNotFound)
}

func TestListAssets_ReturnsDataAndTotal(t *testing.T) {
	repo := newMockAssetRepository()
	svc := NewAssetService(repo)

	_, _ = svc.CreateAsset(model.CreateAssetRequest{Name: "Asset One"})
	_, _ = svc.CreateAsset(model.CreateAssetRequest{Name: "Asset Two"})

	resp, err := svc.ListAssets(model.AssetListQuery{})

	assert.NoError(t, err)
	assert.Equal(t, 2, resp.Total)
	assert.Len(t, resp.Data, 2)
}
