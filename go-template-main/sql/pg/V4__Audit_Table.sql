-- RAISE Immutable Audit Log domain (RAISE-FR-AUDIT-001) -- first cut, see model/auditModel.go.
-- Design §15 (RAISE-DESIGN.md) confirms only Actor/Timestamp/Action/Entity as required fields;
-- Before/After/Source/Result are explicitly "design candidates, not finalized PRD requirements"
-- and are NOT modeled here. Retention period and storage architecture remain open questions
-- (PRD §16 Q24-Q25) -- this table has no retention/partitioning policy, by design, not oversight.
--
-- Immutability (AC-AUDIT-001-02) is enforced by omission: no UPDATE/DELETE statement exists
-- anywhere in this codebase for this table (see repository/auditPGRepository.go and
-- repository/auditRepository.go -- neither exposes an Update or Delete method). Revoking
-- UPDATE/DELETE at the database-role level would be a stronger, defense-in-depth guarantee but
-- is deferred -- this template's migrations don't manage DB roles/grants elsewhere either.
CREATE TABLE audit_logs (
	id varchar(64) NOT NULL,
	actor varchar(200) NOT NULL,
	action varchar(200) NOT NULL,
	entity_type varchar(50) NOT NULL,
	entity_id varchar(64) NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	doc jsonb NOT NULL,
	CONSTRAINT audit_logs_pk PRIMARY KEY (id)
);

CREATE INDEX audit_logs_entity_idx ON audit_logs (entity_type, entity_id);
CREATE INDEX audit_logs_created_at_idx ON audit_logs (created_at DESC);
