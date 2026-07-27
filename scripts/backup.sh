#!/bin/sh
# Nightly Postgres dump pushed to the Supabase bucket.
# Runs inside the `backup` service in docker-compose.yml.
set -eu

STAMP="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
FILE="/backups/portfolio-${STAMP}.sql.gz"

pg_dump --host=db --username=portfolio --dbname=portfolio --no-owner --no-privileges \
  | gzip -9 > "$FILE"

echo "dumped $(du -h "$FILE" | cut -f1) to $FILE"

if [ -n "${S3_BUCKET:-}" ] && [ -n "${S3_ENDPOINT:-}" ]; then
  AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
  AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
    aws --endpoint-url "$S3_ENDPOINT" s3 cp "$FILE" "s3://${S3_BUCKET}/db-backups/$(basename "$FILE")"
  echo "uploaded $(basename "$FILE")"
else
  echo "S3 not configured — dump kept locally only"
fi

# Local retention. Remote retention is a bucket lifecycle rule, set in Supabase.
find /backups -name 'portfolio-*.sql.gz' -mtime "+${RETENTION_DAYS:-30}" -delete
