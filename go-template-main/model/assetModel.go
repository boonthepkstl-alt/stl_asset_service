package model

// AssetSpec is a free-form label/value pair (e.g. "RAM" / "16GB"), matching the frontend's
// AssetSpec type (frontend/src/types/asset.ts) exactly. Stored as a JSONB array on the assets
// table rather than a child table, since specs are asset-type-specific and have no independent
// identity or query need of their own yet.
type AssetSpec struct {
	Label string `json:"label"`
	Value string `json:"value"`
}

// AssetModel mirrors the frontend Asset type (frontend/src/types/asset.ts) field-for-field --
// JSON field names match exactly so the frontend's HttpAssetRepository (once written) needs no
// field-mapping layer. This is the RAISE Asset Registry domain (RAISE-FR-ASSET-001), not the
// template's demo "sample" domain -- PostgreSQL only (the project's primary/KEEP engine per
// COMPANY-FOUNDATION-BASELINE.md Sec1), no per-database fan-out like SampleRepository's, since
// that multi-engine shape was demo scaffolding, not a pattern real domains need to repeat.
type AssetModel struct {
	ID                 string      `json:"id"`
	Code               string      `json:"code"`
	Name               string      `json:"name"`
	Category           string      `json:"category"`
	Type               string      `json:"type"`
	Status             string      `json:"status"`
	Condition          string      `json:"condition"`
	Location           string      `json:"location"`
	Department         string      `json:"department"`
	AssignedTo         *string     `json:"assignedTo"`
	AssignedEmployeeID *string     `json:"assignedEmployeeId,omitempty"`
	AssignedDate       *string     `json:"assignedDate,omitempty"`
	PurchaseDate       string      `json:"purchaseDate"`
	PurchaseCost       float64     `json:"purchaseCost"`
	CurrentValue       float64     `json:"currentValue"`
	WarrantyExpiry     string      `json:"warrantyExpiry"`
	Vendor             string      `json:"vendor"`
	SerialNumber       string      `json:"serialNumber"`
	Specs              []AssetSpec `json:"specs"`
}

// AssetListQuery mirrors the frontend's AssetListQuery (frontend/src/types/asset.ts).
type AssetListQuery struct {
	Page       int    `query:"page"`
	Limit      int    `query:"limit"`
	Search     string `query:"search"`
	Status     string `query:"status"`
	Department string `query:"department"`
}

// AssetListResponse mirrors the frontend's AssetListResult shape ({data, total}) --
// deliberately not the sample domain's {data,total,page,limit,total_pages} envelope, since the
// Asset Management vertical slice (frontend/src/services/asset-repository.ts) was built against
// this narrower shape and pagination isn't yet wired into the Assets page's UI.
type AssetListResponse struct {
	Data  []AssetModel `json:"data"`
	Total int          `json:"total"`
}

// CreateAssetRequest mirrors the frontend's CreateAssetInput.
type CreateAssetRequest struct {
	Name           string  `json:"name"`
	Code           string  `json:"code,omitempty"`
	Category       string  `json:"category"`
	Type           string  `json:"type"`
	SerialNumber   string  `json:"serialNumber"`
	Vendor         string  `json:"vendor,omitempty"`
	PurchaseCost   float64 `json:"purchaseCost"`
	PurchaseDate   string  `json:"purchaseDate"`
	WarrantyExpiry string  `json:"warrantyExpiry,omitempty"`
	Department     string  `json:"department"`
	Location       string  `json:"location"`
	Condition      string  `json:"condition"`
}

// AssignAssetRequest mirrors the frontend's AssignAssetInput (minus assetId, which comes from
// the route param).
type AssignAssetRequest struct {
	EmployeeID   string `json:"employeeId"`
	EmployeeName string `json:"employeeName"`
	Notes        string `json:"notes,omitempty"`
}

// PostgreSQL SQL -- the only engine this domain targets.
// Dual lookup by id or code -- same convention as Employee/Ticket's GetByCode. Added for
// RAISE-FR-OPS-001 (QR/Barcode): a printed/scanned code encodes the asset's `code` (e.g.
// "AST-0004"), not its internal UUID `id`, so identification-by-code must resolve here too.
var SQL_asset_pg_get = `SELECT id, code, name, category, type, status, condition, location, department, assigned_to, assigned_employee_id, assigned_date, purchase_date, purchase_cost, current_value, warranty_expiry, vendor, serial_number, specs FROM assets WHERE id = $1 OR code = $1`

var SQL_asset_pg_insert = `INSERT INTO assets (id, code, name, category, type, status, condition, location, department, assigned_to, assigned_employee_id, assigned_date, purchase_date, purchase_cost, current_value, warranty_expiry, vendor, serial_number, specs)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`

var SQL_asset_pg_update = `UPDATE assets SET code = $1, name = $2, category = $3, type = $4, status = $5, condition = $6, location = $7, department = $8, assigned_to = $9, assigned_employee_id = $10, assigned_date = $11, purchase_date = $12, purchase_cost = $13, current_value = $14, warranty_expiry = $15, vendor = $16, serial_number = $17, specs = $18 WHERE id = $19`

var SQL_asset_pg_delete = `DELETE FROM assets WHERE id = $1`

var SQL_asset_pg_count_base = `SELECT COUNT(*) FROM assets WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR code ILIKE '%' || $1 || '%') AND ($2 = '' OR status = $2) AND ($3 = '' OR department = $3)`

var SQL_asset_pg_list_base = `SELECT id, code, name, category, type, status, condition, location, department, assigned_to, assigned_employee_id, assigned_date, purchase_date, purchase_cost, current_value, warranty_expiry, vendor, serial_number, specs FROM assets WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR code ILIKE '%' || $1 || '%') AND ($2 = '' OR status = $2) AND ($3 = '' OR department = $3) ORDER BY code LIMIT $4 OFFSET $5`
