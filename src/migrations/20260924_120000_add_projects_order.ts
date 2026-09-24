import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cases become orderable by drag and drop, which stores a fractional index in
 * `_order`. Seeded from the current hand-typed `order`, then newest first, so
 * the site does not reshuffle on deploy. The old `order` column stays: dropping
 * it would break the running deploy until the new code is live.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "_order" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version__order" varchar;
  CREATE INDEX IF NOT EXISTS "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");

  WITH ranked AS (
    SELECT id, row_number() OVER (ORDER BY "order" ASC NULLS LAST, "period_start" DESC NULLS LAST, id) AS rn
    FROM "projects" WHERE "_order" IS NULL
  )
  UPDATE "projects" p
  SET "_order" = 'a' || substr('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', ranked.rn::int, 1)
  FROM ranked WHERE p.id = ranked.id AND ranked.rn <= 62;

  UPDATE "_projects_v" v SET "version__order" = p."_order"
  FROM "projects" p WHERE v."parent_id" = p.id AND v."version__order" IS NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "projects__order_idx";
  DROP INDEX IF EXISTS "_projects_v_version_version__order_idx";
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "_order";
  ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version__order";`)
}
