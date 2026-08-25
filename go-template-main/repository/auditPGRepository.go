package repository

import (
	"context"
	"encoding/json"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
)

// AuditPGRepository intentionally has no Update/Delete method -- see AuditRepository's comment.
type AuditPGRepository interface {
	Insert(entry model.AuditLogModel) error
	List(query model.AuditListQuery) ([]model.AuditLogModel, int, error)
}

type auditPGRepository struct{}

func NewAuditPGRepository() AuditPGRepository {
	return &auditPGRepository{}
}

func (r *auditPGRepository) Insert(entry model.AuditLogModel) error {
	log := logger.GetLogger()
	log.Debugf("audit PG insert id=%s entity=%s/%s", entry.ID, entry.EntityType, entry.EntityID)

	db, err := GetPGWriteDb()
	if err != nil {
		return err
	}

	docJSON, err := json.Marshal(entry)
	if err != nil {
		return err
	}

	stmt, err := db.Prepare(model.SQL_audit_pg_insert)
	if err != nil {
		log.Errorf("audit PG insert prepare: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(entry.ID, entry.Actor, entry.Action, entry.EntityType, entry.EntityID, entry.CreatedAt, docJSON)
	if err != nil {
		log.Errorf("audit PG insert exec: %v", err)
		return err
	}

	log.Infof("write served by MASTER (audit insert id=%s)", entry.ID)
	return nil
}

func (r *auditPGRepository) List(query model.AuditListQuery) ([]model.AuditLogModel, int, error) {
	log := logger.GetLogger()
	log.Debugf("audit PG list query=%+v", query)

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, 0, err
	}
	ctx := context.Background()

	var total int
	if err = rdb.DB.QueryRowContext(ctx, model.SQL_audit_pg_count_base, query.EntityType, query.EntityID).Scan(&total); err != nil {
		log.Errorf("audit PG count query: %v", err)
		return nil, 0, err
	}

	limit := query.Limit
	if limit <= 0 {
		limit = total
		if limit <= 0 {
			limit = 1
		}
	}
	page := query.Page
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	rows, err := rdb.DB.QueryContext(ctx, model.SQL_audit_pg_list_base, query.EntityType, query.EntityID, limit, offset)
	if err != nil {
		log.Errorf("audit PG list query: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	items := []model.AuditLogModel{}
	for rows.Next() {
		var a model.AuditLogModel
		if err := rows.Scan(&a.ID, &a.Actor, &a.Action, &a.EntityType, &a.EntityID, &a.CreatedAt); err != nil {
			log.Errorf("audit PG list scan: %v", err)
			return nil, 0, err
		}
		items = append(items, a)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	log.Infof("read served by %s (audit list total=%d)", rdb.Label, total)
	return items, total, nil
}
