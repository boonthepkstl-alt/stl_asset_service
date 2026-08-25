package repository

import "singer/go-template-new-2026-06/model"

// AuditRepository is RAISE-FR-AUDIT-001's persistence contract. Deliberately exposes only
// Create and List -- no Update or Delete method exists anywhere in this interface, which is
// how AC-AUDIT-001-02 (entries cannot be modified/deleted through normal application
// operation) is enforced at the code level, same reasoning as the SQL layer (see
// model/auditModel.go).
type AuditRepository interface {
	Create(entry model.AuditLogModel) error
	List(query model.AuditListQuery) ([]model.AuditLogModel, int, error)
}

type auditRepository struct {
	pg AuditPGRepository
}

func NewAuditRepository(pg AuditPGRepository) AuditRepository {
	return &auditRepository{pg: pg}
}

func (r *auditRepository) Create(entry model.AuditLogModel) error {
	return r.pg.Insert(entry)
}

func (r *auditRepository) List(query model.AuditListQuery) ([]model.AuditLogModel, int, error) {
	return r.pg.List(query)
}
