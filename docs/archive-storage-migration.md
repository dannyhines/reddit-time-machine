# Static archive storage migration

## Recommendation

Store one gzip-compressed JSON object per archive date in a **new, dedicated,
private S3 bucket** and expose it through a **CloudFront Free flat-rate
distribution** using Origin Access Control. Use the CloudFront-generated domain
as `ARCHIVE_BASE_URL`; no public DNS change is required.

This is the best default for this project because it has a $0/month envelope at
the expected size and traffic, keeps the S3 bucket private, adds global caching
and DDoS protection, and does not add runtime SDKs or credentials to Vercel.
Direct S3 is the lower-infrastructure alternative, but its public bucket and
uncapped request charges are a worse failure mode. R2 becomes equally attractive
if the site's DNS zone is already managed by Cloudflare.

Pricing and limits below were checked on 2026-08-30 against the providers'
official pages:

- [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/)
- [Amazon CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 production access and limits](https://developers.cloudflare.com/r2/platform/limits/)
- [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Neon pricing](https://neon.com/pricing)
- [Neon paid-plan transfer change](https://neon.com/blog/more-data-transfer-on-paid-plans)

## Dataset estimate

The archive contains 5,113 dates (2009-01-01 through 2022-12-31). The Neon
transfer quota currently prevents even a small aggregate measurement, so a
complete export size is not yet available. A real, ignored media-heavy row in
the existing checkout measured 5,700 bytes as JSON and 1,464 bytes with gzip.
Using the 36 posts selected for the desktop category layout as a planning
average gives this sizing model (it is not a hard upper bound on `top_posts`):

| Measure | 36-post/day model |
| --- | ---: |
| Date objects | 5,113 |
| Rows | 184,068 |
| JSON | 1,049,187,600 bytes (0.98 GiB) |
| Gzip | 269,475,552 bytes (257 MiB) |
| Average gzip object | 52.7 KB |

Daily-object compression should usually beat the per-row estimate because JSON
keys and URL prefixes repeat. At 100 exported rows per date, the same deliberately
heavy per-row model is about 714 MiB gzip; at 250 rows it is about 1.74 GiB. The
exporter's `manifest.json` records exact post, object, compressed-byte,
uncompressed-byte, and SHA-256 measurements; use those numbers for the final
approval checkpoint.

## Cost comparison

Costs use the 0.269 GB compressed planning estimate. Traffic scenarios are
one complete 5,113-page crawl and 100,000 cold object reads/month (about 5.27 GB).
Cached date-page hits on Vercel do not read object storage again.

| Option | Storage and write cost | Read/transfer cost | Operational notes |
| --- | --- | --- | --- |
| S3 + CloudFront Free flat-rate | $0/month: the plan includes 5 GB of S3 storage credits, 1M requests, and 100 GB transfer per distribution | $0 in both scenarios; no overage charges | Recommended. Two dedicated resources, private origin, global cache, WAF/DDoS, default HTTPS domain. |
| Direct S3, us-east-1 | About $0.0062/month storage; about $0.0256 one-time for 5,114 PUTs | About $0.002 per full crawl or $0.040 per 100k GETs; transfer stays within AWS's shared 100 GB/month free allowance | One resource and regional latency. Requires public object reads and leaves request costs uncapped. S3 website endpoints do not support HTTPS; use the REST endpoint. |
| Cloudflare R2 Standard | $0: 10 GB-month and 1M Class A writes included | $0: 10M Class B reads included and egress is free | Production caching requires a Cloudflare-managed custom domain; `r2.dev` is rate-limited/non-production, and JSON needs an explicit Cache Rule. |
| Vercel Blob | About $0.0062/month and $0.0256 for 5,114 uploads at on-demand rates | Up to about $0.264 Blob transfer plus $0.040 simple operations per 100k cold reads, before standard Edge/Fast Origin charges | Lowest integration effort on Pro. Hobby includes 1 GB, 2,000 advanced operations, and 10 GB transfer, so the 5,114-object initial upload exceeds its hard monthly operation allowance even if the final archive fits its storage allowance. |
| Neon primary reads | Launch: $0.35/GB-month storage plus $0.106/CU-hour; Free includes 0.5 GB, 100 CU-hours, and 5 GB public transfer | Paid plans include 500 GB transfer, then $0.10/GB | Queryable but unnecessary for immutable data; compute wakeups, quotas, and per-request SQL remain failure modes. Retain only as a temporary, explicit fallback. |

CloudFront and R2 are tied at $0 for this workload. CloudFront wins here because
its generated hostname works without moving DNS and its private S3 origin avoids
a public storage endpoint. If an existing Cloudflare-managed zone is confirmed,
R2 plus `archive.<domain>` and a JSON cache rule is a reasonable equivalent.

## Local export

No credentials are read from files or written to the export. Load the existing
`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_DATABASE` variables into
the shell, choose a new empty destination, and run:

```bash
yarn export:archive --output archive-export
```

The exporter:

- reads `top_posts` in 1,000-row keyset-paginated batches;
- selects explicit columns rather than `SELECT *`;
- writes all 5,113 dates, including empty arrays for dates without posts;
- sorts each date by descending score with a stable ID tie-breaker;
- writes deterministic `dates/YYYY-MM-DD.json.gz` objects atomically;
- refuses to reuse a non-empty output directory; and
- writes a deterministic manifest with exact sizes and SHA-256 hashes.

The export is one read-only database pass, but PostgreSQL compression happens
client-side, so Neon meters the uncompressed result transfer. The 36-post/day
model is roughly 1 GB uncompressed; use the current row count or restore enough
quota headroom before running the real export.

Verify before any upload:

```bash
node -e 'const m=require("./archive-export/manifest.json"); if(m.objectCount!==5113) process.exit(1); console.log({objects:m.objectCount,posts:m.postCount,compressedBytes:m.compressedBytes,uncompressedBytes:m.uncompressedBytes})'
find archive-export/dates -type f | wc -l
```

## Approval-gated production migration

None of these steps are performed by this change. Before executing them, present
the manifest's exact sizes plus the exact AWS account/region/resource names and
obtain approval for that scope.

Proposed targets:

1. A new private S3 bucket in `us-east-1`, dedicated only to Reddit Time Machine
   archive objects, with versioning off and default SSE-S3 encryption.
2. A new CloudFront distribution on the $0/month Free flat-rate plan, using its
   generated HTTPS hostname, an Origin Access Control for that bucket, and no
   custom DNS or certificate.
3. A bucket policy granting that distribution `s3:GetObject` only. Do not grant
   public access or `s3:ListBucket`.
4. Exactly 5,114 uploads: 5,113 gzip date objects plus `manifest.json`.
5. Vercel Production environment variables for the existing project:
   `ARCHIVE_BASE_URL=https://<distribution>.cloudfront.net` and initially
   `ARCHIVE_DATABASE_FALLBACK=true`.
6. One production deployment of the approved commit.

Upload metadata must be:

- date objects: `Content-Type: application/json`, `Content-Encoding: gzip`,
  `Cache-Control: public, max-age=31536000, immutable`;
- manifest: `Content-Type: application/json`, `Cache-Control: no-cache`.

An approved upload can use commands equivalent to:

```bash
aws s3 cp archive-export/dates s3://<approved-bucket>/dates \
  --recursive \
  --content-type application/json \
  --content-encoding gzip \
  --cache-control 'public, max-age=31536000, immutable'

aws s3 cp archive-export/manifest.json s3://<approved-bucket>/manifest.json \
  --content-type application/json \
  --cache-control no-cache
```

After upload, verify the manifest, a known populated date, an empty date if one
exists, response headers, a 404 object, the sitemap, and a random sample of date
pages. Then set `ARCHIVE_DATABASE_FALLBACK=false` and deploy again so an object
storage outage fails visibly instead of silently consuming Neon quota.

## Build and rollback behavior

`getStaticPaths` now returns no date paths with `fallback: "blocking"`. A build
therefore performs zero archive or Neon reads. The first request for a valid date
generates the HTML once; Next/Vercel caches that immutable page for subsequent
visitors and crawlers. Archive index/month pages and the sitemap remain generated
without data reads, so crawlers still discover every date.

Rollback is configuration-only: redeploy the previous production deployment, or
unset `ARCHIVE_BASE_URL` to restore database-primary reads. Keep Neon and all
database variables unchanged until the static path has been verified and a
separate retirement decision is approved. No database, bucket, distribution, or
blob deletion is part of this migration.
