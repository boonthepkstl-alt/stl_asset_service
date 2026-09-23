package repository

// Third repository on the integration harness (see pgharness_test.go), and the one carrying the
// most logic that exists nowhere except in SQL.
//
// Four things here are worth a real database:
//
//  1. HasActiveForAsset enforces "one live handover per asset" with
//     `status NOT IN ('ASSIGNED','REJECTED')`. It is the guard that stops a second handover being
//     opened for an asset already in one, and it is a single SQL predicate -- nothing in Go
//     re-checks it.
//  2. CountByCodePrefix backs the AHO-<year>-<seq> sequence. If its scoping is wrong, generated
//     codes collide, and the collision surfaces as a unique-constraint violation far away from
//     the cause.
//  3. Update writes the denormalised `status` column AND the `doc` JSON in one statement. If those
//     ever disagree, a status filter returns rows whose document says something else -- the row
//     matches the query and the payload contradicts it.
//  4. GetByCode accepts EITHER the internal id or the handover code, in one `OR` predicate.
//
// Skips unless a test database is configured; fails rather than skips in CI.

import (
	"fmt"
	"testing"

	"singer/go-template-new-2026-06/model"

	"github.com/stretchr/testify/assert"
)

func newHandover(seq int, status, assetID, assetCode, assetName, recipientID, recipientName string) model.AssetHandoverModel {
	return model.AssetHandoverModel{
		ID:           fmt.Sprintf("aho-%04d", seq),
		HandoverCode: fmt.Sprintf("AHO-2026-%04d", seq),
		Status:       status,
		CreatedAt:    "2026-09-01T00:00:00Z",
		Asset: model.HandoverAsset{
			ID:       assetID,
			Code:     assetCode,
			Name:     assetName,
			Category: "IT Hardware",
			Type:     "Laptop",
		},
		Recipient:   model.HandoverPerson{ID: recipientID, Name: recipientName, Role: "Recipient"},
		InitiatedBy: model.HandoverPerson{ID: "admin", Name: "Admin User", Role: "Initiator"},
		InitiatedAt: "2026-09-01T00:00:00Z",
	}
}

func handoverCodesOf(rows []model.AssetHandoverModel) []string {
	out := make([]string, 0, len(rows))
	for _, r := range rows {
		out = append(out, r.HandoverCode)
	}
	return out
}

// TestAssetHandoverPGRepository_HasActiveForAsset covers the one-live-handover-per-asset guard.
// The interesting half is which statuses are terminal: ASSIGNED and REJECTED release the asset,
// every other status holds it.
func TestAssetHandoverPGRepository_HasActiveForAsset(t *testing.T) {
	newPGHarness(t)
	repo := NewAssetHandoverPGRepository()

	t.Run("an asset with no handover at all is not held", func(t *testing.T) {
		active, err := repo.HasActiveForAsset("asset-never-used")
		assert.NoError(t, err)
		assert.False(t, active)
	})

	// Each in-flight stage must hold the asset. A guard that checked only the first stage would
	// let a second handover open once the first advanced.
	for i, status := range []string{
		"PENDING_RECIPIENT_CONFIRMATION",
		"PENDING_IT_PROCESSING",
		"PENDING_IT_SUPERVISOR_APPROVAL",
	} {
		t.Run("an asset in "+status+" is held", func(t *testing.T) {
			assetID := fmt.Sprintf("asset-inflight-%d", i)
			h := newHandover(100+i, status, assetID, "AST-1000", "Dell Laptop", "emp-1", "Recipient One")
			assert.NoError(t, repo.Insert(h))

			active, err := repo.HasActiveForAsset(assetID)
			assert.NoError(t, err)
			assert.True(t, active, "%s is in flight, so the asset must not accept a second handover", status)
		})
	}

	// The two terminal states release the asset. Getting this wrong locks an asset forever after
	// its first handover completes.
	for i, status := range []string{"ASSIGNED", "REJECTED"} {
		t.Run("an asset whose handover is "+status+" is released", func(t *testing.T) {
			assetID := fmt.Sprintf("asset-terminal-%d", i)
			h := newHandover(200+i, status, assetID, "AST-2000", "HP Monitor", "emp-2", "Recipient Two")
			assert.NoError(t, repo.Insert(h))

			active, err := repo.HasActiveForAsset(assetID)
			assert.NoError(t, err)
			assert.False(t, active, "%s is terminal -- the asset must be free to hand over again", status)
		})
	}

	// Scoping: the predicate filters on asset_id. A version that dropped it would report every
	// asset as held the moment any handover anywhere was in flight, and every test above would
	// still pass.
	t.Run("the guard is scoped to the asset, not global", func(t *testing.T) {
		assert.NoError(t, repo.Insert(newHandover(300, "PENDING_IT_PROCESSING",
			"asset-busy", "AST-3000", "Busy Asset", "emp-3", "Recipient Three")))

		busy, err := repo.HasActiveForAsset("asset-busy")
		assert.NoError(t, err)
		assert.True(t, busy)

		other, err := repo.HasActiveForAsset("asset-idle")
		assert.NoError(t, err)
		assert.False(t, other, "an unrelated asset must not be reported as held")
	})

	// A completed handover in the asset's history must not mask a live one.
	t.Run("a past completed handover does not hide a current live one", func(t *testing.T) {
		assetID := "asset-repeat"
		assert.NoError(t, repo.Insert(newHandover(400, "ASSIGNED", assetID, "AST-4000", "Repeat Asset", "emp-4", "Recipient Four")))
		assert.NoError(t, repo.Insert(newHandover(401, "PENDING_RECIPIENT_CONFIRMATION", assetID, "AST-4000", "Repeat Asset", "emp-5", "Recipient Five")))

		active, err := repo.HasActiveForAsset(assetID)
		assert.NoError(t, err)
		assert.True(t, active, "one terminal and one in-flight handover means the asset IS held")
	})
}

// TestAssetHandoverPGRepository_CountByCodePrefix covers the sequence behind AHO-<year>-<seq>.
// A wrong count produces a duplicate code, which fails on the unique constraint far from here.
func TestAssetHandoverPGRepository_CountByCodePrefix(t *testing.T) {
	newPGHarness(t)
	repo := NewAssetHandoverPGRepository()

	for i := 1; i <= 3; i++ {
		assert.NoError(t, repo.Insert(newHandover(i, "ASSIGNED", fmt.Sprintf("asset-%d", i),
			"AST-0001", "Asset", "emp-1", "Recipient")))
	}
	// One from a previous year, inserted directly because the fixture helper hardcodes 2026.
	prior := newHandover(9, "ASSIGNED", "asset-9", "AST-0009", "Old Asset", "emp-9", "Old Recipient")
	prior.HandoverCode = "AHO-2025-0001"
	assert.NoError(t, repo.Insert(prior))

	t.Run("counts only the requested year", func(t *testing.T) {
		n, err := repo.CountByCodePrefix("AHO-2026-%")
		assert.NoError(t, err)
		assert.Equal(t, 3, n, "the 2025 handover must not be counted toward 2026's sequence")
	})

	t.Run("the other year is counted separately", func(t *testing.T) {
		n, err := repo.CountByCodePrefix("AHO-2025-%")
		assert.NoError(t, err)
		assert.Equal(t, 1, n)
	})

	t.Run("a year with no handovers counts zero rather than erroring", func(t *testing.T) {
		n, err := repo.CountByCodePrefix("AHO-2027-%")
		assert.NoError(t, err)
		assert.Equal(t, 0, n, "the first handover of a new year needs this to be 0, not an error")
	})

	// The count is over every status. A version that excluded terminal handovers would reissue a
	// code already used by a completed one.
	t.Run("terminal handovers still consume a sequence number", func(t *testing.T) {
		assert.NoError(t, repo.Insert(newHandover(4, "REJECTED", "asset-4", "AST-0004", "Asset", "emp-1", "Recipient")))
		n, err := repo.CountByCodePrefix("AHO-2026-%")
		assert.NoError(t, err)
		assert.Equal(t, 4, n, "a rejected handover keeps its code -- reusing it would collide")
	})
}

// TestAssetHandoverPGRepository_UpdateKeepsColumnAndDocInSync covers the dual write. The status
// column is what queries filter on; the doc is what callers read. If they diverge, a filtered list
// returns rows that contradict their own payload -- and every single-field assertion still passes.
func TestAssetHandoverPGRepository_UpdateKeepsColumnAndDocInSync(t *testing.T) {
	newPGHarness(t)
	repo := NewAssetHandoverPGRepository()

	h := newHandover(1, "PENDING_RECIPIENT_CONFIRMATION", "asset-1", "AST-0001", "Dell Laptop", "emp-1", "Sarah Chen")
	assert.NoError(t, repo.Insert(h))

	h.Status = "PENDING_IT_PROCESSING"
	confirmed := "2026-09-02T00:00:00Z"
	h.ConfirmedAt = &confirmed
	ok, err := repo.Update(h.ID, h)
	assert.NoError(t, err)
	assert.True(t, ok)

	t.Run("the status column moved, so the new status filters it in", func(t *testing.T) {
		rows, total, err := repo.List(model.AssetHandoverListQuery{Status: "PENDING_IT_PROCESSING"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total)
		assert.Len(t, rows, 1)
		// The document agrees with the column it was filtered by.
		assert.Equal(t, "PENDING_IT_PROCESSING", rows[0].Status,
			"the doc's own status must match the column the query matched on")
	})

	t.Run("the old status no longer matches", func(t *testing.T) {
		_, total, err := repo.List(model.AssetHandoverListQuery{Status: "PENDING_RECIPIENT_CONFIRMATION"})
		assert.NoError(t, err)
		assert.Equal(t, 0, total)
	})

	t.Run("fields carried only by the document survive the update", func(t *testing.T) {
		got, err := repo.GetByCode(h.HandoverCode)
		assert.NoError(t, err)
		assert.NotNil(t, got.ConfirmedAt, "ConfirmedAt exists only inside the JSON")
		if got.ConfirmedAt != nil {
			assert.Equal(t, confirmed, *got.ConfirmedAt)
		}
		assert.Equal(t, "IT Hardware", got.Asset.Category, "nested asset snapshot survives")
	})

	// Update must also release the asset once it reaches a terminal state -- the guard reads the
	// column, so a doc-only update would leave the asset locked forever.
	t.Run("reaching a terminal status releases the asset", func(t *testing.T) {
		held, err := repo.HasActiveForAsset("asset-1")
		assert.NoError(t, err)
		assert.True(t, held, "still in flight before the final transition")

		h.Status = "ASSIGNED"
		_, err = repo.Update(h.ID, h)
		assert.NoError(t, err)

		held, err = repo.HasActiveForAsset("asset-1")
		assert.NoError(t, err)
		assert.False(t, held, "ASSIGNED is terminal, so the asset is free again")
	})
}

func TestAssetHandoverPGRepository_GetByCodeAcceptsEitherIdentifier(t *testing.T) {
	newPGHarness(t)
	repo := NewAssetHandoverPGRepository()

	h := newHandover(1, "PENDING_IT_PROCESSING", "asset-1", "AST-0001", "Dell Laptop", "emp-1", "Sarah Chen")
	assert.NoError(t, repo.Insert(h))

	t.Run("by handover code", func(t *testing.T) {
		got, err := repo.GetByCode("AHO-2026-0001")
		assert.NoError(t, err)
		assert.Equal(t, h.ID, got.ID)
	})

	t.Run("by internal id", func(t *testing.T) {
		got, err := repo.GetByCode("aho-0001")
		assert.NoError(t, err)
		assert.Equal(t, h.HandoverCode, got.HandoverCode)
	})

	t.Run("an identifier matching neither returns an error", func(t *testing.T) {
		_, err := repo.GetByCode("AHO-2026-9999")
		assert.Error(t, err)
	})
}

func TestAssetHandoverPGRepository_ListFiltersAndPagination(t *testing.T) {
	newPGHarness(t)
	repo := NewAssetHandoverPGRepository()

	assert.NoError(t, repo.Insert(newHandover(1, "PENDING_IT_PROCESSING", "asset-1", "AST-0001", "Dell OptiPlex", "emp-1", "Sarah Chen")))
	assert.NoError(t, repo.Insert(newHandover(2, "ASSIGNED", "asset-2", "AST-0002", "HP Monitor", "emp-2", "John Smith")))
	assert.NoError(t, repo.Insert(newHandover(3, "PENDING_IT_PROCESSING", "asset-3", "AST-0003", "Epson Projector", "emp-1", "Sarah Chen")))

	t.Run("recipientEmployeeId is an exact match", func(t *testing.T) {
		_, total, err := repo.List(model.AssetHandoverListQuery{RecipientEmployeeID: "emp-1"})
		assert.NoError(t, err)
		assert.Equal(t, 2, total)
	})

	t.Run("search matches the asset code, which no filter reads", func(t *testing.T) {
		rows, total, err := repo.List(model.AssetHandoverListQuery{Search: "AST-0002"})
		assert.NoError(t, err)
		assert.Equal(t, 1, total)
		assert.Equal(t, "AHO-2026-0002", rows[0].HandoverCode)
	})

	t.Run("search is case-insensitive", func(t *testing.T) {
		_, total, err := repo.List(model.AssetHandoverListQuery{Search: "sarah"})
		assert.NoError(t, err)
		assert.Equal(t, 2, total, "ILIKE must match \"Sarah Chen\" from lowercase")
	})

	t.Run("status and recipient combine with AND", func(t *testing.T) {
		_, total, err := repo.List(model.AssetHandoverListQuery{
			Status: "PENDING_IT_PROCESSING", RecipientEmployeeID: "emp-2"})
		assert.NoError(t, err)
		assert.Equal(t, 0, total, "emp-2's only handover is ASSIGNED, so the pair matches nothing")
	})

	t.Run("results are ordered by handover code descending", func(t *testing.T) {
		rows, _, err := repo.List(model.AssetHandoverListQuery{})
		assert.NoError(t, err)
		assert.Equal(t, []string{"AHO-2026-0003", "AHO-2026-0002", "AHO-2026-0001"}, handoverCodesOf(rows))
	})

	t.Run("a page is one page while total stays the full count", func(t *testing.T) {
		rows, total, err := repo.List(model.AssetHandoverListQuery{Limit: 2})
		assert.NoError(t, err)
		assert.Len(t, rows, 2)
		assert.Equal(t, 3, total)
		assert.Equal(t, []string{"AHO-2026-0003", "AHO-2026-0002"}, handoverCodesOf(rows))
	})

	t.Run("paging covers every row exactly once", func(t *testing.T) {
		var seen []string
		for page := 1; ; page++ {
			rows, _, err := repo.List(model.AssetHandoverListQuery{Limit: 2, Page: page})
			assert.NoError(t, err)
			if len(rows) == 0 {
				break
			}
			seen = append(seen, handoverCodesOf(rows)...)
			if page > 5 {
				t.Fatal("paging did not terminate")
			}
		}
		assert.Equal(t, []string{"AHO-2026-0003", "AHO-2026-0002", "AHO-2026-0001"}, seen)
	})
}
