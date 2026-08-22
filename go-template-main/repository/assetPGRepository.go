package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"singer/go-template-new-2026-06/logger"
	"singer/go-template-new-2026-06/model"
)

type AssetPGRepository interface {
	Insert(asset model.AssetModel) error
	GetByID(id string) (model.AssetModel, error)
	Update(id string, asset model.AssetModel) (bool, error)
	Delete(id string) (bool, error)
	List(query model.AssetListQuery) ([]model.AssetModel, int, error)
}

type assetPGRepository struct{}

func NewAssetPGRepository() AssetPGRepository {
	return &assetPGRepository{}
}

// scanAsset reads one row into an AssetModel, coercing nullable DB columns (assigned_to,
// assigned_employee_id, assigned_date, warranty_expiry, vendor) into the frontend's
// non-nullable-except-assignedTo shape (frontend/src/types/asset.ts): warrantyExpiry and
// vendor are always strings (empty when null in the DB), matching CreateAssetInput's optional
// fields defaulting to "" in MockAssetRepository.
func scanAsset(row interface{ Scan(dest ...any) error }) (model.AssetModel, error) {
	var a model.AssetModel
	var assignedTo, assignedEmployeeID, assignedDate, warrantyExpiry, vendor sql.NullString
	var specsRaw []byte

	err := row.Scan(
		&a.ID, &a.Code, &a.Name, &a.Category, &a.Type, &a.Status, &a.Condition, &a.Location, &a.Department,
		&assignedTo, &assignedEmployeeID, &assignedDate,
		&a.PurchaseDate, &a.PurchaseCost, &a.CurrentValue, &warrantyExpiry, &vendor, &a.SerialNumber, &specsRaw,
	)
	if err != nil {
		return model.AssetModel{}, err
	}

	if assignedTo.Valid {
		a.AssignedTo = &assignedTo.String
	}
	if assignedEmployeeID.Valid {
		a.AssignedEmployeeID = &assignedEmployeeID.String
	}
	if assignedDate.Valid {
		a.AssignedDate = &assignedDate.String
	}
	a.WarrantyExpiry = warrantyExpiry.String
	a.Vendor = vendor.String

	a.Specs = []model.AssetSpec{}
	if len(specsRaw) > 0 {
		if err := json.Unmarshal(specsRaw, &a.Specs); err != nil {
			return model.AssetModel{}, err
		}
	}

	return a, nil
}

func nullableString(s *string) sql.NullString {
	if s == nil || *s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: *s, Valid: true}
}

func (r *assetPGRepository) GetByID(id string) (model.AssetModel, error) {
	log := logger.GetLogger()
	log.Debugf("asset PG get id=%s", id)

	rdb, err := GetPGReadDB()
	if err != nil {
		return model.AssetModel{}, err
	}

	row := rdb.DB.QueryRowContext(context.Background(), model.SQL_asset_pg_get, id)
	asset, err := scanAsset(row)
	if err != nil {
		log.Errorf("asset PG get scan: %v", err)
		return model.AssetModel{}, err
	}

	log.Infof("read served by %s (asset get id=%s)", rdb.Label, id)
	return asset, nil
}

func (r *assetPGRepository) List(query model.AssetListQuery) ([]model.AssetModel, int, error) {
	log := logger.GetLogger()
	log.Debugf("asset PG list query=%+v", query)

	rdb, err := GetPGReadDB()
	if err != nil {
		return nil, 0, err
	}
	ctx := context.Background()

	var total int
	if err = rdb.DB.QueryRowContext(ctx, model.SQL_asset_pg_count_base, query.Search, query.Status, query.Department).Scan(&total); err != nil {
		log.Errorf("asset PG count query: %v", err)
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

	rows, err := rdb.DB.QueryContext(ctx, model.SQL_asset_pg_list_base, query.Search, query.Status, query.Department, limit, offset)
	if err != nil {
		log.Errorf("asset PG list query: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	items := []model.AssetModel{}
	for rows.Next() {
		asset, err := scanAsset(rows)
		if err != nil {
			log.Errorf("asset PG list scan: %v", err)
			return nil, 0, err
		}
		items = append(items, asset)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	log.Infof("read served by %s (asset list total=%d)", rdb.Label, total)
	return items, total, nil
}

func (r *assetPGRepository) Insert(asset model.AssetModel) error {
	log := logger.GetLogger()
	log.Debugf("asset PG insert id=%s", asset.ID)

	db, err := GetPGWriteDb()
	if err != nil {
		return err
	}

	specsJSON, err := json.Marshal(asset.Specs)
	if err != nil {
		return err
	}

	stmt, err := db.Prepare(model.SQL_asset_pg_insert)
	if err != nil {
		log.Errorf("asset PG insert prepare: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(
		asset.ID, asset.Code, asset.Name, asset.Category, asset.Type, asset.Status, asset.Condition, asset.Location, asset.Department,
		nullableString(asset.AssignedTo), nullableString(asset.AssignedEmployeeID), nullableString(asset.AssignedDate),
		asset.PurchaseDate, asset.PurchaseCost, asset.CurrentValue, nullableString(&asset.WarrantyExpiry), nullableString(&asset.Vendor),
		asset.SerialNumber, specsJSON,
	)
	if err != nil {
		log.Errorf("asset PG insert exec: %v", err)
		return err
	}

	log.Infof("write served by MASTER (asset insert id=%s)", asset.ID)
	return nil
}

func (r *assetPGRepository) Update(id string, asset model.AssetModel) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("asset PG update id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	specsJSON, err := json.Marshal(asset.Specs)
	if err != nil {
		return false, err
	}

	stmt, err := db.PrepareContext(ctx, model.SQL_asset_pg_update)
	if err != nil {
		log.Errorf("asset PG update prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx,
		asset.Code, asset.Name, asset.Category, asset.Type, asset.Status, asset.Condition, asset.Location, asset.Department,
		nullableString(asset.AssignedTo), nullableString(asset.AssignedEmployeeID), nullableString(asset.AssignedDate),
		asset.PurchaseDate, asset.PurchaseCost, asset.CurrentValue, nullableString(&asset.WarrantyExpiry), nullableString(&asset.Vendor),
		asset.SerialNumber, specsJSON, id,
	)
	if err != nil {
		log.Errorf("asset PG update exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (asset update id=%s)", id)
	return rowsAffected > 0, nil
}

func (r *assetPGRepository) Delete(id string) (bool, error) {
	log := logger.GetLogger()
	log.Debugf("asset PG delete id=%s", id)

	db, err := GetPGWriteDb()
	if err != nil {
		return false, err
	}
	ctx := context.Background()

	stmt, err := db.PrepareContext(ctx, model.SQL_asset_pg_delete)
	if err != nil {
		log.Errorf("asset PG delete prepare: %v", err)
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.ExecContext(ctx, id)
	if err != nil {
		log.Errorf("asset PG delete exec: %v", err)
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	log.Infof("write served by MASTER (asset delete id=%s)", id)
	return rowsAffected > 0, nil
}
