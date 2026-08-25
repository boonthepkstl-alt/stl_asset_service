package service

import (
	"singer/go-template-new-2026-06/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

// mockAuditRepository is an in-memory stand-in for AuditRepository -- same "mocked unit test"
// convention as mockAssetRepository. Deliberately has no update/delete method, mirroring the
// real AuditRepository interface (AC-AUDIT-001-02).
type mockAuditRepository struct {
	entries []model.AuditLogModel
}

func newMockAuditRepository() *mockAuditRepository {
	return &mockAuditRepository{entries: []model.AuditLogModel{}}
}

func (m *mockAuditRepository) Create(entry model.AuditLogModel) error {
	m.entries = append(m.entries, entry)
	return nil
}

func (m *mockAuditRepository) List(query model.AuditListQuery) ([]model.AuditLogModel, int, error) {
	items := make([]model.AuditLogModel, 0, len(m.entries))
	for _, e := range m.entries {
		if query.EntityType != "" && e.EntityType != query.EntityType {
			continue
		}
		if query.EntityID != "" && e.EntityID != query.EntityID {
			continue
		}
		items = append(items, e)
	}
	return items, len(items), nil
}

func TestRecord_CreatesEntryWithRequiredFields(t *testing.T) {
	repo := newMockAuditRepository()
	svc := NewAuditService(repo)

	entry, err := svc.Record("sarah.chen", "Asset created", "asset", "a1")

	assert.NoError(t, err)
	assert.NotEmpty(t, entry.ID)
	assert.Equal(t, "sarah.chen", entry.Actor)
	assert.Equal(t, "Asset created", entry.Action)
	assert.Equal(t, "asset", entry.EntityType)
	assert.Equal(t, "a1", entry.EntityID)
	assert.NotEmpty(t, entry.CreatedAt)
}

func TestListAuditLogs_FiltersByEntity(t *testing.T) {
	repo := newMockAuditRepository()
	svc := NewAuditService(repo)

	_, _ = svc.Record("actor1", "Asset created", "asset", "a1")
	_, _ = svc.Record("actor1", "Asset assigned to Sarah Chen", "asset", "a1")
	_, _ = svc.Record("actor1", "Asset created", "asset", "a2")

	resp, err := svc.ListAuditLogs(model.AuditListQuery{EntityType: "asset", EntityID: "a1"})

	assert.NoError(t, err)
	assert.Equal(t, 2, resp.Total)
	assert.Len(t, resp.Data, 2)
	for _, e := range resp.Data {
		assert.Equal(t, "a1", e.EntityID)
	}
}

func TestListAuditLogs_NoFilterReturnsAll(t *testing.T) {
	repo := newMockAuditRepository()
	svc := NewAuditService(repo)

	_, _ = svc.Record("actor1", "Asset created", "asset", "a1")
	_, _ = svc.Record("actor1", "Asset created", "asset", "a2")

	resp, err := svc.ListAuditLogs(model.AuditListQuery{})

	assert.NoError(t, err)
	assert.Equal(t, 2, resp.Total)
}
