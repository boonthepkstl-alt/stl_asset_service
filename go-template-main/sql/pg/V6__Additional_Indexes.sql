-- P1 index hardening (2026-09-11). Found during the 2026-09-10 database status review and
-- carried out after P0 (pagination for employees/tickets/asset_handovers, PR #129): five
-- columns are used as exact-match filter predicates in a List/count query's WHERE clause today
-- but have no index, so each becomes a full sequential scan once the table has real data volume.
--
-- Scope, stated precisely: only columns that appear as an exact-match ($n = col) filter in an
-- existing List/count query and are not already covered by an index. NOT included, on purpose:
-- free-text columns matched with ILIKE '%...%' (name, email, job_title, title, handover_code,
-- asset_name, etc.) -- a plain B-tree index does not accelerate a leading-wildcard ILIKE scan;
-- that would need a trigram (pg_trgm) GIN index, a heavier, extension-adding decision this
-- migration deliberately does not make. Also not included: any column not referenced by any
-- List/count WHERE clause today (e.g. assets/employees/tickets have no query filtering on
-- manager_id, warranty_expiry, etc.) -- adding those would be a guess at future query shape,
-- not a fix for a confirmed gap.
--
-- Every column added here was verified directly against the actual SQL_*_pg_list_base/
-- SQL_*_pg_count_base variables in go-template-main/model/*.go before this file was written,
-- not inferred from the table's column list.

-- tickets: SQL_ticket_pg_list_base/count_base filter on priority, category and
-- requester_name -- all three by exact match ($n = col), not ILIKE (see model/ticketModel.go).
-- status and department were already indexed (V3); priority, category and requester_name
-- were not. requester_name is a display-name column, but its own filter clause is an exact
-- match, not a substring search (that's handled separately by the same query's ILIKE $6
-- clause), so it meets the same inclusion criterion as the other two.
CREATE INDEX tickets_priority_idx ON tickets (priority);
CREATE INDEX tickets_category_idx ON tickets (category);
CREATE INDEX tickets_requester_name_idx ON tickets (requester_name);

-- employees: SQL_employee_pg_list_base/count_base filters on location (see
-- model/employeeModel.go); department and status were already indexed (V2), location was not.
CREATE INDEX employees_location_idx ON employees (location);

-- asset_handovers: SQL_asset_handover_pg_list_base/count_base filters on recipient_employee_id
-- (see model/assetHandoverModel.go); status and asset_id were already indexed (V5),
-- recipient_employee_id was not.
CREATE INDEX asset_handovers_recipient_idx ON asset_handovers (recipient_employee_id);
