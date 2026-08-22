-- RAISE Asset Registry (RAISE-FR-ASSET-001). PostgreSQL only -- see model/assetModel.go.
CREATE TABLE assets (
	id varchar(64) NOT NULL,
	code varchar(50) NOT NULL,
	name varchar(200) NOT NULL,
	category varchar(100) NOT NULL,
	type varchar(100) NOT NULL,
	status varchar(30) NOT NULL DEFAULT 'Available',
	condition varchar(30) NOT NULL,
	location varchar(200) NOT NULL,
	department varchar(200) NOT NULL,
	assigned_to varchar(200) NULL,
	assigned_employee_id varchar(64) NULL,
	assigned_date date NULL,
	purchase_date date NOT NULL,
	purchase_cost numeric(14, 2) NOT NULL DEFAULT 0,
	current_value numeric(14, 2) NOT NULL DEFAULT 0,
	warranty_expiry date NULL,
	vendor varchar(200) NULL,
	serial_number varchar(200) NOT NULL,
	specs jsonb NOT NULL DEFAULT '[]',
	CONSTRAINT assets_pk PRIMARY KEY (id),
	CONSTRAINT assets_code_uk UNIQUE (code)
);

CREATE INDEX assets_status_idx ON assets (status);
CREATE INDEX assets_department_idx ON assets (department);
