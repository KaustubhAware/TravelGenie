-- Backfill missing package slugs for existing databases.
-- Safe to run multiple times.

UPDATE packages
SET slug = CONCAT(
    REGEXP_REPLACE(
        LOWER(TRIM(COALESCE(title, 'package'))),
        '[^a-z0-9]+',
        '-',
        'g'
    ),
    '-',
    id
)
WHERE slug IS NULL OR TRIM(slug) = '';
