package repository

import "singer/go-template-new-2026-06/model"

// TicketRepository -- PostgreSQL-only, same convention as Asset/Employee. Deliberately
// narrower than the frontend's TicketRepository interface: changeAsset/changeRequester
// (admin correction utilities) aren't part of RAISE-FR-MAINT-001's confirmed 4-stage workflow
// (AC-MAINT-001-03..09) and are left out for now, not silently reinterpreted -- see
// service/ticketService.go's doc comment.
type TicketRepository interface {
	Create(ticket model.TicketModel) error
	GetByCode(code string) (model.TicketModel, error)
	Update(id string, ticket model.TicketModel) (bool, error)
	List(query model.TicketListQuery) ([]model.TicketModel, int, error)
	ListTechnicians() ([]model.ITTechnician, error)
}

type ticketRepository struct {
	pg TicketPGRepository
}

func NewTicketRepository(pg TicketPGRepository) TicketRepository {
	return &ticketRepository{pg: pg}
}

func (r *ticketRepository) Create(ticket model.TicketModel) error {
	return r.pg.Insert(ticket)
}

func (r *ticketRepository) GetByCode(code string) (model.TicketModel, error) {
	return r.pg.GetByCode(code)
}

func (r *ticketRepository) Update(id string, ticket model.TicketModel) (bool, error) {
	return r.pg.Update(id, ticket)
}

func (r *ticketRepository) List(query model.TicketListQuery) ([]model.TicketModel, int, error) {
	return r.pg.List(query)
}

func (r *ticketRepository) ListTechnicians() ([]model.ITTechnician, error) {
	return r.pg.ListTechnicians()
}
