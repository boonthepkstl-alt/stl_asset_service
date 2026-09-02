package service

import (
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"time"
)

// DashboardService is RAISE-FR-EXEC-001's first cut -- composes over AssetService (the same
// service-to-service composition pattern TicketService already uses for AssetService/
// EmployeeService) rather than querying the assets table directly, so there is exactly one
// place Asset list/filter logic lives. See model/dashboardModel.go for exactly what is and
// isn't in scope (no NBV/Risk figures, no License count).
type DashboardService interface {
	GetDashboardStats() (model.DashboardStatsModel, error)
}

type dashboardService struct {
	assetService AssetService
}

func NewDashboardService(assetService AssetService) DashboardService {
	return &dashboardService{assetService: assetService}
}

// GetDashboardStats mirrors frontend/src/services/dashboard-service.ts's pre-existing
// getDashboardStats logic field-for-field (status counts, expired-warranty check, department/
// type distribution grouped in first-seen order) -- this is a relocation of already-confirmed
// logic, not a new formula. The expired-warranty check parses `warrantyExpiry` the same way
// the frontend's `new Date(a.warrantyExpiry).getTime() < today.getTime()` does: an empty or
// unparsable value is treated as "not expired" (skipped), matching NaN-comparison-is-false in
// JS.
func (s *dashboardService) GetDashboardStats() (model.DashboardStatsModel, error) {
	log := logger.GetLogger()
	log.Infof("GetDashboardStats")

	resp, err := s.assetService.ListAssets(model.AssetListQuery{})
	if err != nil {
		return model.DashboardStatsModel{}, err
	}
	assets := resp.Data

	stats := model.DashboardStatsModel{TotalAssets: len(assets)}
	now := time.Now()

	deptCounts := map[string]int{}
	deptOrder := []string{}
	typeCounts := map[string]int{}
	typeOrder := []string{}

	for _, a := range assets {
		switch a.Status {
		case "Available":
			stats.Available++
		case "Assigned":
			stats.Assigned++
		case "In Maintenance":
			stats.InMaintenance++
		case "Retired":
			stats.Retired++
		}

		if t, ok := parseAssetDate(a.WarrantyExpiry); ok && t.Before(now) {
			stats.ExpiredWarranty++
		}

		if _, seen := deptCounts[a.Department]; !seen {
			deptOrder = append(deptOrder, a.Department)
		}
		deptCounts[a.Department]++

		if _, seen := typeCounts[a.Type]; !seen {
			typeOrder = append(typeOrder, a.Type)
		}
		typeCounts[a.Type]++
	}

	for _, d := range deptOrder {
		stats.DepartmentDistribution = append(stats.DepartmentDistribution, model.DistributionCount{Label: d, Count: deptCounts[d]})
	}
	for _, t := range typeOrder {
		stats.AssetTypeDistribution = append(stats.AssetTypeDistribution, model.DistributionCount{Label: t, Count: typeCounts[t]})
	}

	return stats, nil
}

// parseAssetDate tolerates both the bare "2006-01-02" layout the unit tests use and the
// RFC3339 "2006-01-02T15:04:05Z07:00" layout the pq driver actually returns when scanning a
// Postgres `date` column into a Go string (found running against a real seeded database,
// where every WarrantyExpiry came back as e.g. "2025-06-10T00:00:00Z" -- the strict
// "2006-01-02"-only parse silently failed for every real row, so ExpiredWarranty stayed 0
// regardless of actual data). An empty or genuinely unparsable value returns ok=false,
// matching NaN-comparison-is-false in the frontend's equivalent `new Date(...)` check.
func parseAssetDate(value string) (time.Time, bool) {
	if value == "" {
		return time.Time{}, false
	}
	if t, err := time.Parse(time.RFC3339, value); err == nil {
		return t, true
	}
	if t, err := time.Parse("2006-01-02", value); err == nil {
		return t, true
	}
	return time.Time{}, false
}
