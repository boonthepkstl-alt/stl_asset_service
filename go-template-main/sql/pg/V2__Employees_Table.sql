-- RAISE Employee domain (supports RAISE-FR-ASSET-003 custody/assignment). PostgreSQL only --
-- see model/employeeModel.go.
CREATE TABLE employees (
	id varchar(64) NOT NULL,
	employee_code varchar(50) NOT NULL,
	name varchar(200) NOT NULL,
	email varchar(200) NOT NULL,
	phone varchar(50) NULL,
	job_title varchar(150) NULL,
	title varchar(150) NULL,
	department varchar(200) NOT NULL,
	department_id varchar(64) NULL,
	location varchar(200) NOT NULL,
	desk_location varchar(150) NULL,
	manager varchar(200) NULL,
	manager_id varchar(64) NULL,
	status varchar(30) NOT NULL DEFAULT 'Active',
	avatar_color varchar(50) NULL,
	initials varchar(5) NULL,
	start_date date NOT NULL,
	workstation_type varchar(150) NULL,
	primary_os varchar(150) NULL,
	assigned_count integer NOT NULL DEFAULT 0,
	CONSTRAINT employees_pk PRIMARY KEY (id),
	CONSTRAINT employees_code_uk UNIQUE (employee_code),
	CONSTRAINT employees_email_uk UNIQUE (email)
);

CREATE INDEX employees_department_idx ON employees (department);
CREATE INDEX employees_status_idx ON employees (status);
