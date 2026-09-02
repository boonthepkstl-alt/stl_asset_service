-- RAISE-FR-OPS-002's IT Hardware Assignment Approval Workflow (PRD Sec16 Resolved
-- Question 43, narrowing Resolved Question 42) -- category-scoped exception: assigning an
-- IT Hardware asset now goes through this 4-stage approval record before the asset's
-- status becomes Assigned, instead of the immediate state-change every other category
-- keeps. See model/assetHandoverModel.go. `doc` holds the full record; the other columns
-- are denormalized purely to support List()'s filters without parsing JSON, same
-- convention as V3__Tickets_Table.sql.
CREATE TABLE asset_handovers (
	id varchar(64) NOT NULL,
	handover_code varchar(50) NOT NULL,
	asset_id varchar(64) NOT NULL,
	asset_code varchar(100) NULL,
	asset_name varchar(200) NULL,
	recipient_employee_id varchar(64) NOT NULL,
	recipient_name varchar(200) NULL,
	status varchar(40) NOT NULL,
	doc jsonb NOT NULL,
	CONSTRAINT asset_handovers_pk PRIMARY KEY (id),
	CONSTRAINT asset_handovers_code_uk UNIQUE (handover_code)
);

CREATE INDEX asset_handovers_status_idx ON asset_handovers (status);
CREATE INDEX asset_handovers_asset_idx ON asset_handovers (asset_id);
