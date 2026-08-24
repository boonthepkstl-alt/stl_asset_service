-- RAISE Maintenance/Ticket domain (RAISE-FR-MAINT-001, "IT Requisition & Maintenance").
-- PostgreSQL only -- see model/ticketModel.go. `doc` holds the full ticket document; the other
-- columns are denormalized purely to support List()'s filters/search without parsing JSON.
CREATE TABLE tickets (
	id varchar(64) NOT NULL,
	ticket_code varchar(50) NOT NULL,
	title varchar(300) NOT NULL,
	status varchar(30) NOT NULL,
	category varchar(100) NOT NULL,
	priority varchar(20) NOT NULL,
	department varchar(200) NULL,
	requester_name varchar(200) NULL,
	technician_name varchar(200) NULL,
	asset_name varchar(200) NULL,
	asset_code varchar(100) NULL,
	doc jsonb NOT NULL,
	CONSTRAINT tickets_pk PRIMARY KEY (id),
	CONSTRAINT tickets_code_uk UNIQUE (ticket_code)
);

CREATE INDEX tickets_status_idx ON tickets (status);
CREATE INDEX tickets_department_idx ON tickets (department);

-- Technicians: read-only/seeded for now, matching
-- frontend/src/data/fixtures/requisitionData.ts's initialTechnicians exactly -- no create/
-- update path exists on the frontend for technicians yet, so none is built here either.
CREATE TABLE technicians (
	id varchar(64) NOT NULL,
	name varchar(200) NOT NULL,
	role varchar(150) NULL,
	specialty varchar(250) NULL,
	avatar_color varchar(50) NULL,
	initials varchar(5) NULL,
	active_tickets_count integer NOT NULL DEFAULT 0,
	completed_this_month integer NOT NULL DEFAULT 0,
	CONSTRAINT technicians_pk PRIMARY KEY (id)
);

INSERT INTO technicians (id, name, role, specialty, avatar_color, initials, active_tickets_count, completed_this_month) VALUES
	('tech-1', 'Alex Rivera', 'Lead Hardware Specialist', 'Apple Certified & Laptop Hardware', 'bg-brand-600', 'AR', 3, 18),
	('tech-2', 'Maya Lin', 'Senior Network Engineer', 'Cisco, Wi-Fi 6 & Infrastructure', 'bg-emerald-600', 'ML', 2, 14),
	('tech-3', 'Sam Taylor', 'Systems Administrator', 'Windows Enterprise, Linux & Servers', 'bg-indigo-600', 'ST', 4, 22),
	('tech-4', 'Elena Rostova', 'IT Support & Mobility Specialist', 'Mobile Devices, Monitors & Peripherals', 'bg-amber-600', 'ER', 1, 16);
