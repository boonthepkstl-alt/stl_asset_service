package service

import (
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
	"singer/go-template-new-2026-06/repository"
	"time"

	"github.com/google/uuid"
)

// AuditService is RAISE-FR-AUDIT-001's business layer -- a first cut scoped to exactly what
// AC-AUDIT-001 confirms: record an entry (Actor/Action/Entity/Timestamp) when a significant
// activity completes, and let it be listed back. There is deliberately no Update/Delete method
// (AC-AUDIT-001-02); see repository/auditRepository.go for where that's enforced.
type AuditService interface {
	Record(actor, action, entityType, entityID string) (model.AuditLogModel, error)
	ListAuditLogs(query model.AuditListQuery) (*model.AuditListResponse, error)
}

type auditService struct {
	repo repository.AuditRepository
}

func NewAuditService(repo repository.AuditRepository) AuditService {
	return &auditService{repo: repo}
}

func (s *auditService) Record(actor, action, entityType, entityID string) (model.AuditLogModel, error) {
	log := logger.GetLogger()
	log.Infof("Audit Record - actor: %s, action: %s, entity: %s/%s", actor, action, entityType, entityID)

	entry := model.AuditLogModel{
		ID:         uuid.New().String(),
		Actor:      actor,
		Action:     action,
		EntityType: entityType,
		EntityID:   entityID,
		CreatedAt:  time.Now().UTC().Format(time.RFC3339),
	}

	if err := s.repo.Create(entry); err != nil {
		log.Errorf("Audit Record error: %v", err)
		return model.AuditLogModel{}, err
	}

	return entry, nil
}

func (s *auditService) ListAuditLogs(query model.AuditListQuery) (*model.AuditListResponse, error) {
	log := logger.GetLogger()
	log.Infof("ListAuditLogs - query: %+v", query)

	items, total, err := s.repo.List(query)
	if err != nil {
		return nil, err
	}

	return &model.AuditListResponse{Data: items, Total: total}, nil
}
