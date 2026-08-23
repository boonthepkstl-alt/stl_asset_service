package repository

import (
	"context"
	"encoding/json"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
)

type TicketPGRepository interface {
	Insert(ticket model.TicketModel) error
	GetByCode(code string) (model.TicketModel, error)
	Update(id string, ticket model.TicketModel) (bool, error)
	List(query model.TicketListQuery) ([]model.TicketModel, int, error)
	ListTechnicians() ([]model.ITTechnician, error)
}

type ticketPGRepository struct{}

func NewTicketPGRepository() TicketPGRepository {
	return &ticketPGRepository{}
}

func scanTicketDoc(row interface{ Scan(dest ...any) error }) (model.TicketModel, error) {
	var docRaw []byte
	if err := row.Scan(&docRaw); err != nil {
		return model.TicketModel{}, err
	}
	var ticket model.TicketModel
	if err := json.Unmarshal(docRaw, &ticket); err != nil {
		return model.TicketModel{}, err
	}
	return ticket, nil
}

// technicianName safely reads the nullable itAssignment.technicianName for the denormalized
// column -- most tickets have no technician assigned until Dispatch.
func technicianName(t model.TicketModel) *string {
	return t.ITAssignment.TechnicianName
}

func (r *ticketPGRepository) GetByCode(code string) (model.TicketModel, error) {
	log := logger.GetLogger()
	log.Debugf("ticket PG get code=%s", code)

	rdb, err := GetPGReadDB()
	if err != nil {
		return model.TicketModel{}, err
	}

	row := rdb.DB.QueryRowContext(context.Background(), model.SQL_ticket_pg_get, code)
	ticket, err := scanTicketDoc(row)
	if err != nil {
		log.Errorf("ticket PG get scan: %v", err)
		return model.TicketModel{}, err
	}

	log.Infof("read served by %s (ticket get code=%s)", rdb.Label, code)
	return ticket, nil
}

func (r *ticketPGRepository) List(query model.TicketListQuery) ([]model.TicketModel, int, error) {
	log := logger.GetLogger()
	log.Debugf("ticket PG list query=%+v", query)

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, 0, err
	}
	ctx := context.Background()

	var total int
	if err = rdb.DB.QueryRowContext(ctx, model.SQL_ticket_pg_count_base,
		query.Status, query.Priority, query.Category, query.Department, query.RequesterName, query.Search,
	).Scan(&total); err != nil {
		log.Errorf("ticket PG count query: %v", err)
		return nil, 0, err
	}

	rows, err := rdb.DB.QueryContext(ctx, model.SQL_ticket_pg_list_base,
		query.Status, query.Priority, query.Category, query.Department, query.RequesterName, query.Search,
	)
	if err != nil {
		log.Errorf("ticket PG list query: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	items := []model.TicketModel{}
	for rows.Next() {
		ticket, err := scanTicketDoc(rows)
		if err != nil {
			log.Errorf("ticket PG list scan: %v", err)
			return nil, 0, err
		}
		items = append(items, ticket)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	log.Infof("read served by %s (ticket list total=%d)", rdb.Label, total)
	return items, total, nil
}

func (r *ticketPGRepository) Insert(ticket model.TicketModel) error {
	log := logger.GetLogger()
	log.Debugf("ticket PG insert id=%s", ticket.ID)

	db, err := GetPGWriteDb()
	if err != nil {
		return err
	}

	docJSON, err := json.Marshal(ticket)
	if err != nil {
		return err
	}

	stmt, err := db.Prepare(model.SQL_ticket_pg_insert)
	if err != nil {
		log.Errorf("ticket PG insert prepare: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		ticket.ID, ticket.TicketCode, ticket.Title, ticket.Status, ticket.Category, ticket.Priority,
		nullableString(&ticket.Requester.Department), nullableString(&ticket.Requester.Name),
		technicianName(ticket), nullableString(&ticket.Asset.Name), nullableString(&ticket.Asset.Code),
		docJSON,
	)
	if err != nil {
		log.Errorf("ticket PG insert exec: %v", err)
		return err
	}

	log.Infof("write served by MASTER (ticket insert id=%s)", ticket.ID)
	return nil
}

func (r *ticketPGRepository) Update(id string, ticket model.TicketModel) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("ticket PG update id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	docJSON, err := json.Marshal(ticket)
	if err != nil {
		return false, err
	}

	stmt, err := db.PrepareContext(ctx, model.SQL_ticket_pg_update)
	if err != nil {
		log.Errorf("ticket PG update prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx,
		ticket.Status, nullableString(&ticket.Requester.Department), nullableString(&ticket.Requester.Name),
		technicianName(ticket), nullableString(&ticket.Asset.Name), nullableString(&ticket.Asset.Code),
		docJSON, id,
	)
	if err != nil {
		log.Errorf("ticket PG update exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (ticket update id=%s)", id)
	return rowsAffected > 0, nil
}

func (r *ticketPGRepository) ListTechnicians() ([]model.ITTechnician, error) {
	log := logger.GetLogger()
	log.Debug("technician PG list")

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, err
	}

	rows, err := rdb.DB.QueryContext(context.Background(), model.SQL_technician_pg_list)
	if err != nil {
		log.Errorf("technician PG list query: %v", err)
		return nil, err
	}
	defer rows.Close()

	items := []model.ITTechnician{}
	for rows.Next() {
		var t model.ITTechnician
		if err := rows.Scan(&t.ID, &t.Name, &t.Role, &t.Specialty, &t.AvatarColor, &t.Initials, &t.ActiveTicketsCount, &t.CompletedThisMonth); err != nil {
			log.Errorf("technician PG list scan: %v", err)
			return nil, err
		}
		items = append(items, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	log.Infof("read served by %s (technician list total=%d)", rdb.Label, len(items))
	return items, nil
}
