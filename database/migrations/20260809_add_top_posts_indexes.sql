-- Speed up the date-filtered API query and allow non-blocking refreshes of the
-- top_posts materialized view.
--
-- CREATE INDEX CONCURRENTLY cannot run inside a transaction. Run this file
-- directly with psql; do not wrap it in BEGIN/COMMIT.

SET statement_timeout = 0;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS top_posts_id_uidx
  ON public.top_posts (id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS top_posts_created_date_idx
  ON public.top_posts (created_date);
