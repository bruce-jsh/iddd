# Data Conventions

> Default rules for data modeling. Modify these to match your project's requirements.

## Primary Key Strategy

- **Default**: UUID v7 (time-sortable)
- Auto-increment integer IDs are allowed as an alternative
- All PKs use the column name `id`

## Naming Conventions

- **Database columns**: `snake_case`
- **Code properties**: `camelCase`
- **Table names**: plural form (e.g., `users`, `order_items`)
- **Boolean columns**: prefix with `is_` or `has_` (e.g., `is_active`, `has_verified`)

## Timestamps

- All entities automatically include `created_at` and `updated_at`
- Stored as `TIMESTAMP WITH TIME ZONE` (UTC)

## Soft Delete

- Pattern: `deleted_at` column (nullable timestamp)
- Which entities use soft delete is determined in Phase 2

## Indexes

- Foreign keys automatically get an index
- Add additional indexes for frequently searched attributes
- Composite indexes for common query patterns

## ENUM vs Reference Table

- **3 or fewer fixed values**: use ENUM type
- **More than 3 values** or values that may change: use a reference table

## JSON Columns

- Allowed only for metadata whose structure changes frequently
- If a JSON field is a search target, normalize it into proper columns
