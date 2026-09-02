package service

import (
	"singer/go-template-new-2026-06/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

// fakeAssetService is a minimal AssetService double -- only ListAssets is exercised by
// DashboardService, so the rest are unused stubs. Kept separate from mockAssetRepository
// (assetService_test.go) since DashboardService composes over the AssetService interface, not
// the repository.
type fakeAssetService struct {
	assets []model.AssetModel
}

func (f *fakeAssetService) ListAssets(query model.AssetListQuery) (*model.AssetListResponse, error) {
	return &model.AssetListResponse{Data: f.assets, Total: len(f.assets)}, nil
}
func (f *fakeAssetService) GetAsset(id string) (model.AssetModel, error) { return model.AssetModel{}, nil }
func (f *fakeAssetService) CreateAsset(input model.CreateAssetRequest) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *fakeAssetService) AssignAsset(id string, input model.AssignAssetRequest) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}
func (f *fakeAssetService) CheckInAsset(id string) (model.AssetModel, error) {
	return model.AssetModel{}, nil
}

func TestGetDashboardStats_ComputesStatusCounts(t *testing.T) {
	svc := NewDashboardService(&fakeAssetService{assets: []model.AssetModel{
		{Status: "Available", Department: "Engineering", Type: "Laptop"},
		{Status: "Assigned", Department: "Engineering", Type: "Monitor"},
		{Status: "In Maintenance", Department: "Sales", Type: "Laptop"},
		{Status: "Retired", Department: "Sales", Type: "Phone"},
	}})

	stats, err := svc.GetDashboardStats()

	assert.NoError(t, err)
	assert.Equal(t, 4, stats.TotalAssets)
	assert.Equal(t, 1, stats.Available)
	assert.Equal(t, 1, stats.Assigned)
	assert.Equal(t, 1, stats.InMaintenance)
	assert.Equal(t, 1, stats.Retired)
}

func TestGetDashboardStats_CountsExpiredWarrantyOnly(t *testing.T) {
	svc := NewDashboardService(&fakeAssetService{assets: []model.AssetModel{
		{Status: "Available", WarrantyExpiry: "2020-01-01"}, // expired
		{Status: "Available", WarrantyExpiry: "2099-01-01"}, // not expired
		{Status: "Available", WarrantyExpiry: ""},           // no warranty -- not counted
	}})

	stats, err := svc.GetDashboardStats()

	assert.NoError(t, err)
	assert.Equal(t, 1, stats.ExpiredWarranty)
}

// Found running against a real seeded Postgres database (2026-09-02): scanning a `date`
// column via the pq driver into a Go string yields RFC3339 ("2025-06-10T00:00:00Z"), not the
// bare "2006-01-02" layout used elsewhere in this file's fixtures -- ExpiredWarranty silently
// stayed 0 for every real row until parseAssetDate learned to accept both layouts.
func TestGetDashboardStats_CountsExpiredWarranty_RFC3339Layout(t *testing.T) {
	svc := NewDashboardService(&fakeAssetService{assets: []model.AssetModel{
		{Status: "Available", WarrantyExpiry: "2020-01-01T00:00:00Z"}, // expired
		{Status: "Available", WarrantyExpiry: "2099-01-01T00:00:00Z"}, // not expired
	}})

	stats, err := svc.GetDashboardStats()

	assert.NoError(t, err)
	assert.Equal(t, 1, stats.ExpiredWarranty)
}

func TestGetDashboardStats_GroupsDistributionsInFirstSeenOrder(t *testing.T) {
	svc := NewDashboardService(&fakeAssetService{assets: []model.AssetModel{
		{Department: "Sales", Type: "Laptop"},
		{Department: "Engineering", Type: "Laptop"},
		{Department: "Sales", Type: "Phone"},
	}})

	stats, err := svc.GetDashboardStats()

	assert.NoError(t, err)
	assert.Equal(t, []model.DistributionCount{{Label: "Sales", Count: 2}, {Label: "Engineering", Count: 1}}, stats.DepartmentDistribution)
	assert.Equal(t, []model.DistributionCount{{Label: "Laptop", Count: 2}, {Label: "Phone", Count: 1}}, stats.AssetTypeDistribution)
}

func TestGetDashboardStats_EmptyAssetList(t *testing.T) {
	svc := NewDashboardService(&fakeAssetService{assets: []model.AssetModel{}})

	stats, err := svc.GetDashboardStats()

	assert.NoError(t, err)
	assert.Equal(t, 0, stats.TotalAssets)
	assert.Empty(t, stats.DepartmentDistribution)
	assert.Empty(t, stats.AssetTypeDistribution)
}
