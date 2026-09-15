# Static archive storage migration

## Recommendation

Store one gzip-compressed JSON object per archive date in a **new, dedicated,
private S3 bucket** and expose it through a **CloudFront Free flat-rate
distribution** using Origin Access Control. The deployed CloudFront-generated
domain is the committed application default; `ARCHIVE_BASE_URL` remains an
optional endpoint override. No public DNS change is required.

This is the best default for this project because it has a $0/month envelope at
the expected size and traffic, keeps the S3 bucket private, adds global caching
and DDoS protection, and does not add runtime SDKs or credentials to Vercel.
Direct S3 is the lower-infrastructure alternative, but its public bucket and
uncapped request charges are a worse failure mode. R2 becomes equally attractive
if the site's DNS zone is already managed by Cloudflare.

Pricing and limits below were rechecked on 2026-09-14 against the providers'
official pages:

- [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/)
- [Amazon CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 production access and limits](https://developers.cloudflare.com/r2/platform/limits/)
- [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Neon pricing](https://neon.com/pricing)
- [Neon paid-plan transfer change](https://neon.com/blog/more-data-transfer-on-paid-plans)

## Measured dataset

A complete read-only export succeeded on 2026-09-14 and passed full local
checksum, gzip, JSON-shape, date, per-object count, and aggregate verification.

| Measure | Verified export |
| --- | ---: |
| Date objects | 5,113 |
| Posts | 299,749 |
| JSON | 341,363,114 bytes (325.5 MiB) |
| Gzip | 90,670,127 bytes (86.5 MiB / 0.0907 GB) |
| Average gzip object | 17.7 KB |
| Posts per date | 50 minimum, 60 median, 60 maximum |
| Empty dates | 0 |

The compressed export is 26.6% of the JSON size. The ignored local export is the
source of the exact figures; `manifest.json` records every object size and
SHA-256 checksum without containing credentials. A committed, credential-free
measurement record is in [`archive-export-summary.json`](archive-export-summary.json).

## Cost comparison

Costs use the measured 0.0907 GB compressed export. Traffic scenarios are one
complete 5,113-page crawl (0.0907 GB) and 100,000 cold object reads/month (about
1.77 GB).
Cached date-page hits on Vercel do not read object storage again.

| Option | Storage and write cost | Read/transfer cost | Operational notes |
| --- | --- | --- | --- |
| S3 + CloudFront Free flat-rate | $0/month CloudFront and storage: the plan includes 5 GB of S3 storage credits, 1M requests, and 100 GB transfer per distribution. About $0.0256 one-time for 5,114 S3 PUTs | CloudFront delivery is $0 within the allowance. S3 origin GETs are about $0.002 per complete 5,113-object fill or $0.040 per 100k origin GETs | Recommended. Two dedicated resources, private origin, global cache, WAF/DDoS, default HTTPS domain. |
| Direct S3, us-east-1 | About $0.0021/month storage; about $0.0256 one-time for 5,114 PUTs | About $0.002 per full crawl or $0.040 per 100k GETs; transfer stays within AWS's shared 100 GB/month free allowance | One resource and regional latency. Requires public object reads and leaves request costs uncapped. S3 website endpoints do not support HTTPS; use the REST endpoint. |
| Cloudflare R2 Standard | $0: 10 GB-month and 1M Class A writes included | $0: 10M Class B reads included and egress is free | Production caching requires a Cloudflare-managed custom domain; `r2.dev` is rate-limited/non-production, and JSON needs an explicit Cache Rule. |
| Vercel Blob | About $0.0021/month and $0.0256 for 5,114 uploads at on-demand rates | Up to about $0.089 Blob transfer plus $0.040 simple operations per 100k cold reads, before standard Edge/Fast Origin charges | Lowest integration effort on Pro. Hobby includes 1 GB, 2,000 advanced operations, and 10 GB transfer, so the 5,114-object initial upload exceeds its hard monthly operation allowance. |
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
client-side. The verified JSON payload is 341.4 MB before protocol overhead,
which is also a useful lower-bound approximation for the repeated transfer caused
by every full database-backed build.

Verify before any upload:

```bash
yarn verify:archive archive-export
```

## Deployed AWS archive infrastructure

The infrastructure is defined in the separate TypeScript CDK app under
`infra/`. Synthesize and test it without changing AWS:

```bash
cd infra
yarn install --frozen-lockfile
yarn build
yarn test
yarn synth
```

`yarn preflight` checks that the active credentials resolve to account alias
`dhines-ccp` and region `us-east-1`; it deliberately does not print or commit the
numeric account ID. Use `yarn diff:checked` for a read-only diff.
`yarn deploy:checked` performs the same guard before deployment.

The pinned CDK CLI uses CloudFormation's current resource types, including
`AWS::PricingPlanManager::Subscription`, so the system AWS CLI does not need to
be upgraded for this deployment. The account has an existing legacy
`CDKToolkit` stack but not the modern bootstrap marker. Because this app contains
no CDK file or Docker assets, it intentionally uses `LegacyStackSynthesizer` and
does not create or update bootstrap buckets, ECR repositories, KMS keys, or IAM
roles.

Deployed and verified on 2026-09-14:

1. AWS account alias `dhines-ccp`, region `us-east-1`.
2. Private S3 bucket `reddit-time-machine-archive-prod-20260914`, dedicated
   only to Reddit Time Machine archive objects, with Bucket owner enforced,
   Block Public Access on, versioning off, default SSE-S3 encryption, and a
   `Retain` deletion policy.
3. CloudFront distribution comment `reddit-time-machine-archive-prod` on the
   $0/month Free flat-rate plan, available at
   `https://d62zosiwnxg1g.cloudfront.net`, with no custom DNS, certificate,
   access logs, Lambda, or CloudFront Functions.
4. Origin Access Control named `reddit-time-machine-archive-prod-oac`, using
   always-signed SigV4 requests to the S3 REST origin.
5. CloudFront-scope WAF web ACL named
   `reddit-time-machine-archive-prod-web-acl`. AWS requires a WAF ACL for every
   flat-rate CloudFront plan; this dedicated allow-by-default ACL has metrics and
   request sampling disabled and is covered by the Free plan.
6. Active Free-tier `AWS::PricingPlanManager::Subscription` associating only the
   distribution and WAF ACL at $0/month.
7. A bucket policy granting only that distribution `s3:GetObject` for the
   bucket's objects. Do not grant public access or `s3:ListBucket`.
8. Exactly 5,114 uploaded objects: 5,113 gzip date objects plus `manifest.json`.
   The remote listing contains 91,896,119 bytes including the manifest; every
   remote key, size, and single-part S3 ETag matches its local source.
9. The application defaults to
   `https://d62zosiwnxg1g.cloudfront.net` in source control, so Vercel Preview
   and Production deployments use the archive without environment mutation.
   `ARCHIVE_BASE_URL` can override the endpoint; setting it to `database` (or an
   empty value) explicitly restores database-primary reads.
10. `ARCHIVE_DATABASE_FALLBACK` remains disabled by default. Setting it to
    `true` is an optional emergency fallback, not part of the normal cutover.

The installed AWS CLI is version 2.0.16 and predates CloudFront flat-rate plan
commands, but its credential, CloudFormation, and S3 operations used here remain
compatible. The project pins its own current CDK CLI, so a system-wide AWS CLI
upgrade is optional rather than a deployment dependency.

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

Post-upload verification passed for both boundary dates. CloudFront returns
byte-identical content with the expected type, gzip encoding, and cache headers;
a repeated application-style request changed from an edge miss to a hit. Direct
S3 access is denied with 403. Missing objects also return 403 because the OAC has
`s3:GetObject` but deliberately lacks `s3:ListBucket`. A local production runtime
rendered 2009-01-01 and 2022-12-31 from CloudFront with database fallback
disabled.

The remaining application cutover is to merge and deploy the PR commit, then
verify production. No Vercel environment change is required, and an object
storage outage fails visibly instead of silently consuming Neon quota.

## Build and rollback behavior

`getStaticPaths` now returns no date paths with `fallback: "blocking"`. A build
therefore performs zero archive or Neon reads. The first request for a valid date
generates the HTML once; Next/Vercel caches that immutable page for subsequent
visitors and crawlers. Archive index/month pages and the sitemap remain generated
without data reads, so crawlers still discover every date.

Application rollback is configuration-only: redeploy the previous production
deployment, or set `ARCHIVE_BASE_URL=database` to restore database-primary
reads. Keep Neon and all database variables unchanged until the static path has
been verified and a separate retirement decision is approved.

Infrastructure rollback is `cdk destroy`. CloudFormation removes the Free
subscription first (AWS cancels a Free subscription immediately), then the
distribution, WAF ACL, OAC, and bucket policy. The archive bucket has a `Retain`
deletion policy, so its objects survive stack deletion and can be downloaded or
deleted separately after explicit approval. No existing distribution is
imported, updated, or deleted by this stack.
