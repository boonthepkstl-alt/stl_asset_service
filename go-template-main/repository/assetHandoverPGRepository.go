package repository

import (
	"context"
	"encoding/json"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
)

type AssetHandoverPGRepository interface {
	Insert(handover model.AssetHandoverModel) error
	GetByCode(code string) (model.AssetHandoverModel, error)
	Update(id string, handover model.AssetHandoverModel) (bool, error)
	List(query model.AssetHandoverListQuery) ([]model.AssetHandoverModel, int, error)
	HasActiveForAsset(assetID string) (bool, error)
	CountByCodePrefix(prefix string) (int, error)
}

type assetHandoverPGRepository struct{}

func NewAssetHandoverPGRepository() AssetHandoverPGRepository {
	return &assetHandoverPGRepository{}
}

func scanAssetHandoverDoc(row interface{ Scan(dest ...any) error }) (model.AssetHandoverModel, error) {
	var docRaw []byte
	if err := row.Scan(&docRaw); err != nil {
		return model.AssetHandoverModel{}, err
	}
	var handover model.AssetHandoverModel
	if err := json.Unmarshal(docRaw, &handover); err != nil {
		return model.AssetHandoverModel{}, err
	}
	return handover, nil
}

func (r *assetHandoverPGRepository) GetByCode(code string) (model.AssetHandoverModel, error) {
	log := logger.GetLogger()
	log.Debugf("asset handover PG get code=%s", code)

	rdb, err := GetPGReadDB()
	if err != nil {
		return model.AssetHandoverModel{}, err
	}

	row := rdb.DB.QueryRowContext(context.Background(), model.SQL_asset_handover_pg_get, code)
	handover, err := scanAssetHandoverDoc(row)
	if err != nil {
		log.Errorf("asset handover PG get scan: %v", err)
		return model.AssetHandoverModel{}, err
	}

	log.Infof("read served by %s (asset handover get code=%s)", rdb.Label, code)
	return handover, nil
}

func (r *assetHandoverPGRepository) List(query model.AssetHandoverListQuery) ([]model.AssetHandoverModel, int, error) {
	log := logger.GetLogger()
	log.Debugf("asset handover PG list query=%+v", query)

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, 0, err
	}
	ctx := context.Background()

	var total int
	if err = rdb.DB.QueryRowContext(ctx, model.SQL_asset_handover_pg_count_base,
		query.Search, query.Status, query.RecipientEmployeeID,
	).Scan(&total); err != nil {
		log.Errorf("asset handover PG count query: %v", err)
		return nil, 0, err
	}

	rows, err := rdb.DB.QueryContext(ctx, model.SQL_asset_handover_pg_list_base,
		query.Search, query.Status, query.RecipientEmployeeID,
	)
	if err != nil {
		log.Errorf("asset handover PG list query: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	items := []model.AssetHandoverModel{}
	for rows.Next() {
		handover, err := scanAssetHandoverDoc(rows)
		if err != nil {
			log.Errorf("asset handover PG list scan: %v", err)
			return nil, 0, err
		}
		items = append(items, handover)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	log.Infof("read served by %s (asset handover list total=%d)", rdb.Label, total)
	return items, total, nil
}

func (r *assetHandoverPGRepository) Insert(handover model.AssetHandoverModel) error {
	log := logger.GetLogger()
	log.Debugf("asset handover PG insert id=%s", handover.ID)

	db, err := GetPGWriteDb()
	if err != nil {
		return err
	}

	docJSON, err := json.Marshal(handover)
	if err != nil {
		return err
	}

	stmt, err := db.Prepare(model.SQL_asset_handover_pg_insert)
	if err != nil {
		log.Errorf("asset handover PG insert prepare: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		handover.ID, handover.HandoverCode, handover.Asset.ID, nullableString(&handover.Asset.Code),
		nullableString(&handover.Asset.Name), handover.Recipient.ID, nullableString(&handover.Recipient.Name),
		handover.Status, docJSON,
	)
	if err != nil {
		log.Errorf("asset handover PG insert exec: %v", err)
		return err
	}

	log.Infof("write served by MASTER (asset handover insert id=%s)", handover.ID)
	return nil
}

func (r *assetHandoverPGRepository) Update(id string, handover model.AssetHandoverModel) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("asset handover PG update id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	docJSON, err := json.Marshal(handover)
	if err != nil {
		return false, err
	}

	stmt, err := db.PrepareContext(ctx, model.SQL_asset_handover_pg_update)
	if err != nil {
		log.Errorf("asset handover PG update prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx, handover.Status, docJSON, id)
	if err != nil {
		log.Errorf("asset handover PG update exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (asset handover update id=%s)", id)
	return rowsAffected > 0, nil
}

func (r *assetHandoverPGRepository) HasActiveForAsset(assetID string) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("asset handover PG has-active-for-asset asset_id=%s", assetID)

	rdb, err := GetPGReadDB()
	if err != nil {
		return false, err
	}

	var count int
	if err := rdb.DB.QueryRowContext(context.Background(), model.SQL_asset_handover_pg_active_for_asset, assetID).Scan(&count); err != nil {
		log.Errorf("asset handover PG has-active-for-asset query: %v", err)
		return false, err
	}

	return count > 0, nil
}

// CountByCodePrefix backs the year-scoped HandoverCode sequence number -- a cheap COUNT-only
// query, avoiding List()'s full row fetch + JSON unmarshal just to discard the results.
func (r *assetHandoverPGRepository) CountByCodePrefix(prefix string) (int, error) {
	log := logger.GetLogger()
	log.Debugf("asset handover PG count-by-code-prefix prefix=%s", prefix)

	rdb, err := GetPGReadDB()
	if err != nil {
		return 0, err
	}

	var count int
	if err := rdb.DB.QueryRowContext(context.Background(), model.SQL_asset_handover_pg_count_by_code_prefix, prefix+"%").Scan(&count); err != nil {
		log.Errorf("asset handover PG count-by-code-prefix query: %v", err)
		return 0, err
	}

	return count, nil
}
