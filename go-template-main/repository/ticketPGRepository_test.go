package repository

// The second repository on the integration harness (see pgharness_test.go), chosen for what its
// SQL does rather than to raise a file count.
//
// Three things here exist only in SQL, and no service-layer mock reaches any of them:
//
//  1. `status=ACTIVE` is not a status. SQL_ticket_pg_list_base expands it, in a three-branch
//     conditional, to `status IN ('PLANNING','IN_PROGRESS','ON_HOLD')` -- documented in
//     RAISE-API-DB-SPEC.md as real API behaviour. A mock filtering on string equality returns
//     nothing for it and still looks correct to a test written against the same mock.
//  2. The row IS the JSON. Tickets store the whole TicketModel in a `doc` jsonb column and List
//     reads it back with `SELECT doc`, so every nested field round-trips through PostgreSQL. An
//     in-memory mock hands back the same struct it was given and can never lose a field.
//  3. Search spans six columns with ILIKE, including two -- asset_code and technician_name -- that
//     no other filter touches.
//
// Skips unless a test database is configured; fails rather than skips in CI.

import (
	"fmt"
	"testing"

	"singer/go-template-new-2026-06/model"

	"github.com/stretchr/testify/assert"
)

// newTicket builds a ticket carrying enough nested structure to prove the JSONB round-trip, not
// merely the scalar columns the WHERE clause reads.
func newTicket(seq int, status, priority, category, department, requester, assetName, assetCode string) model.TicketModel {
	return model.TicketModel{
		ID:             fmt.Sprintf("tkt-%04d", seq),
		TicketCode:     fmt.Sprintf("ITR-%04d", seq),
		Title:          fmt.Sprintf("Ticket %04d", seq),
		Category:       category,
		Priority:       priority,
		SLATargetHours: 8,
		Description:    "Seeded by the repository integration tests.",
		Location:       "HQ",
		CreatedAt:      "2026-09-01T00:00:00Z",
		Status:         status,
		Requester: model.TicketRequester{
			ID:         fmt.Sprintf("emp-%04d", seq),
			Name:       requester,
			Email:      fmt.Sprintf("req%04d@example.invalid", seq),
			Department: department,
		},
		Asset: model.TicketAsset{
			Name: assetName,
			Code: assetCode,
		},
	}
}

func ticketCodesOf(rows []model.TicketModel) []string {
	out := make([]string, 0, len(rows))
	for _, r := range rows {
		out = append(out, r.TicketCode)
	}
	return out
}

// TestTicketPGRepository_ActiveStatusFilter covers the synthetic value. This is the highest-value
// test in the file: `ACTIVE` exists nowhere in the data, only in the query's own conditional.
func TestTicketPGRepository_ActiveStatusFilter(t *testing.T) {
	newPGHarness(t)
	repo := NewTicketPGRepository()

	seed := []struct {
		seq    int
		status string
	}{
		{1, "PENDING_DEPT_APPROVAL"},
		{2, "PENDING_IT_DISPATCH"},
		{3, "PLANNING"},
		{4, "IN_PROGRESS"},
		{5, "ON_HOLD"},
		{6, "DONE"},
		{7, "REJECTED_BY_DEPT"},
	}
	for _, s := range seed {
		if err := repo.Insert(newTicket(s.seq, s.status, "High", "Hardware Fault & Repair",
			"Engineering", "Requester One", "Dell Laptop", "AST-0001")); err != nil {
			t.Fatalf("seeding ticket %d failed: %v", s.seq, err)
		}
	}

	t.Run("ACTIVE expands to exactly the three in-flight statuses", func(t *testing.T) {
		rows, total, err := repo.List(model.TicketListQuery{Status: "ACTIVE"})
		assert.NoError(t, err)
		assert.Equal(t, 3, total, "PLANNING, IN_PROGRESS and ON_HOLD -- and nothing else")
		// ORDER BY ticket_code DESC.
		assert.Equal(t, []string{"ITR-0005", "ITR-0004", "ITR-0003"}, ticketCodesOf(rows))
	})

	t.Run("ACTIVE excludes the terminal and pre-dispatch statuses", func(t *testing.T) {
		rows, _, err := repo.List(model.TicketListQuery{Status: "ACTIVE"})
		assert.NoError(t, err)
		for _, r := range rows {
			assert.NotContains(t, []string{"DONE", "REJECTED_BY_DEPT", "PENDING_DEPT_APPROVAL", "PENDING_IT_DISPATCH"},
				r.Status, "ticket %s leaked into ACTIVE with status %s", r.TicketCode, r.Status)
		}
	})

	// The third branch of the conditional: a real status must still match literally, and must NOT
	// be swallowed by the ACTIVE branch.
	t.Run("a literal status still matches only itself", func(t *testing.T) {
		for _, s := range seed {
			rows, total, err := repo.List(model.TicketListQuery{Status: s.status})
			assert.NoError(t, err)
			assert.Equal(t, 1, total, "status %s", s.status)
			assert.Len(t, rows, 1)
			assert.Equal(t, s.status, rows[0].Status)
		}
	})

	t.Run("an empty status returns everything", func(t *testing.T) {
		_, total, err := repo.List(model.TicketListQuery{})
		assert.NoError(t, err)
		assert.Equal(t, len(seed), total)
	})

	t.Run("an unknown status matches nothing rather than everything", func(t *testing.T) {
		rows, total, err := repo.List(model.TicketListQuery{Status: "NOT_A_STATUS"})
		assert.NoError(t, err)
		assert.Equal(t, 0, total, "an unrecognised status must not fall through to the empty-string branch")
		assert.Empty(t, rows)
	})
}

// TestTicketPGRepository_DocRoundTrip proves the JSONB column preserves the whole model. The scalar
// columns beside `doc` are only there for filtering; everything a caller reads comes back out of
// the JSON.
func TestTicketPGRepository_DocRoundTrip(t *testing.T) {
	newPGHarness(t)
	repo := NewTicketPGRepository()

	original := newTicket(1, "PLANNING", "Critical", "Hardware Fault & Repair",
		"Engineering", "Sarah Chen", "Dell OptiPlex 7090", "AST-0013")
	original.Timeline = []model.TimelineEvent{
		{ID: "tl-1", Stage: "Submitted", ActorName: "Sarah Chen", ActorRole: "Requester",
			Timestamp: "2026-09-01T01:00:00Z", Action: "Submitted the requisition"},
		{ID: "tl-2", Stage: "Dept Approval", ActorName: "Manager", ActorRole: "Approver",
			Timestamp: "2026-09-01T02:00:00Z", Action: "Approved"},
	}
	if err := repo.Insert(original); err != nil {
		t.Fatalf("insert failed: %v", err)
	}

	rows, _, err := repo.List(model.TicketListQuery{})
	assert.NoError(t, err)
	assert.Len(t, rows, 1)
	got := rows[0]

	// Fields that exist ONLY inside the JSON document -- no column carries them, so a broken
	// marshal/unmarshal loses them silently while every filter still works.
	assert.Equal(t, 8, got.SLATargetHours, "SLATargetHours survives the JSONB round-trip")
	assert.Equal(t, "req0001@example.invalid", got.Requester.Email)
	assert.Equal(t, "Seeded by the repository integration tests.", got.Description)
	assert.Equal(t, "HQ", got.Location)
	assert.Len(t, got.Timeline, 2, "the nested timeline array survives")
	assert.Equal(t, "Dept Approval", got.Timeline[1].Stage)
	assert.Equal(t, "Approved", got.Timeline[1].Action, "a field only the JSON carries")
}

func TestTicketPGRepository_SearchAndFilters(t *testing.T) {
	newPGHarness(t)
	repo := NewTicketPGRepository()

	tickets := []model.TicketModel{
		newTicket(1, "PLANNING", "Critical", "Hardware Fault & Repair", "Engineering", "Sarah Chen", "Dell OptiPlex", "AST-0013"),
		newTicket(2, "PLANNING", "Low", "Software & Access", "Finance", "John Smith", "HP Monitor", "AST-0014"),
		newTicket(3, "DONE", "Critical", "Hardware Fault & Repair", "Finance", "Sarah Chen", "Epson Projector", "AST-0015"),
	}
	for _, tk := range tickets {
		if err := repo.Insert(tk); err != nil {
			t.Fatalf("seeding %s failed: %v", tk.TicketCode, err)
		}
	}

	t.Run("search matches the asset code, a column no other filter reads", func(t *testing.T) {
		rows, total, err := repo.List(model.TicketListQuery{Search: "AST-0014"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total)
		assert.Equal(t, "ITR-0002", rows[0].TicketCode)
	})

	t.Run("search is case-insensitive and matches a substring", func(t *testing.T) {
		_, total, err := repo.List(model.TicketListQuery{Search: "sarah"})
		assert.NoError(t, err)
		assert.Equal(t, 2, total, "ILIKE, not LIKE -- lowercase must match \"Sarah Chen\"")
	})

	t.Run("requesterName is an exact match, unlike search", func(t *testing.T) {
		_, exact, err := repo.List(model.TicketListQuery{RequesterName: "Sarah"})
		assert.NoError(t, err)
		assert.Equal(t, 0, exact, "the requesterName filter is =, so a partial name matches nothing")

		_, full, err := repo.List(model.TicketListQuery{RequesterName: "Sarah Chen"})
		assert.NoError(t, err)
		assert.Equal(t, 2, full)
	})

	// Filters AND together. A query that ORed them would return more rows and pass any
	// single-filter assertion above.
	t.Run("filters combine with AND, not OR", func(t *testing.T) {
		_, total, err := repo.List(model.TicketListQuery{Priority: "Critical", Department: "Finance"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total, "only ITR-0003 is both Critical and Finance")
	})

	t.Run("ACTIVE composes with another filter", func(t *testing.T) {
		_, total, err := repo.List(model.TicketListQuery{Status: "ACTIVE", Priority: "Critical"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total, "ITR-0003 is Critical but DONE, so only ITR-0001 qualifies")
	})
}

func TestTicketPGRepository_ListPagination(t *testing.T) {
	newPGHarness(t)
	repo := NewTicketPGRepository()

	for i := 1; i <= 12; i++ {
		if err := repo.Insert(newTicket(i, "PLANNING", "Medium", "Software & Access",
			"Engineering", "Requester", "Asset", fmt.Sprintf("AST-%04d", i))); err != nil {
			t.Fatalf("seeding %d failed: %v", i, err)
		}
	}

	t.Run("a page is one page while total stays the full count", func(t *testing.T) {
		rows, total, err := repo.List(model.TicketListQuery{Limit: 5})
		assert.NoError(t, err)
		assert.Len(t, rows, 5)
		assert.Equal(t, 12, total)
		// DESC: the newest code first.
		assert.Equal(t, []string{"ITR-0012", "ITR-0011", "ITR-0010", "ITR-0009", "ITR-0008"}, ticketCodesOf(rows))
	})

	t.Run("paging through covers every row exactly once, in DESC order", func(t *testing.T) {
		var seen []string
		for page := 1; ; page++ {
			rows, _, err := repo.List(model.TicketListQuery{Limit: 5, Page: page})
			assert.NoError(t, err)
			if len(rows) == 0 {
				break
			}
			seen = append(seen, ticketCodesOf(rows)...)
			if page > 6 {
				t.Fatal("paging did not terminate")
			}
		}
		var want []string
		for i := 12; i >= 1; i-- {
			want = append(want, fmt.Sprintf("ITR-%04d", i))
		}
		assert.Equal(t, want, seen)
	})

	t.Run("total reflects the filter, not the table, when paging a filtered set", func(t *testing.T) {
		rows, total, err := repo.List(model.TicketListQuery{Status: "ACTIVE", Limit: 5})
		assert.NoError(t, err)
		assert.Len(t, rows, 5)
		assert.Equal(t, 12, total, "all 12 are PLANNING, so ACTIVE matches all of them")
	})
}
