# Database operations

Database migrations are plain SQL files intended to be run with `psql`. They
are not executed by the application or during a Vercel deployment.

## Connect

The application uses the `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and
`DB_DATABASE` environment variables. With those variables loaded into your
shell, run a migration with:

```bash
PGPASSWORD="$DB_PASSWORD" psql \
  --host "$DB_HOST" \
  --port "$DB_PORT" \
  --username "$DB_USER" \
  --dbname "$DB_DATABASE" \
  --set ON_ERROR_STOP=1 \
  --file database/migrations/20260809_add_top_posts_indexes.sql
```

Do not commit database credentials or put them directly in shell history.

## Refresh `top_posts`

The `top_posts_id_uidx` unique index makes a concurrent refresh possible. A
concurrent refresh keeps the existing materialized-view contents readable while
PostgreSQL builds the replacement:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY public.top_posts;
```

Run only one refresh at a time. PostgreSQL requires the view to already be
populated, and the refresh will fail if the source data would produce duplicate
or null `id` values. The source `posts.id` primary key currently guarantees
that each selected row has a unique, non-null ID.

## Verify the indexes

Check that both indexes are present, valid, and ready:

```sql
SELECT
  indexrelid::regclass AS index_name,
  indisunique,
  indisvalid,
  indisready
FROM pg_index
WHERE indrelid = 'public.top_posts'::regclass
ORDER BY indexrelid::regclass::text;
```

Date lookups should use `top_posts_created_date_idx` rather than a sequential
scan:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM public.top_posts
WHERE created_date = DATE '2018-06-12';
```
