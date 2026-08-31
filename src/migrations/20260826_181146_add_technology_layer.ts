import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The guard below makes this migration safe to re-run.
 *
 * `prodMigrations` in payload.config.ts applies pending migrations when the app
 * boots in production. If the schema was ever created without recording a row in
 * `payload_migrations` (an early `push`, or SQL run by hand), Payload sees this
 * migration as pending and re-runs it against objects that already exist, which
 * aborts the boot. Checking for its own change first turns that into a no-op.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const applied = await db.execute(sql`select to_regclass('public.technologies') is not null and exists (select 1 from information_schema.columns where table_name = 'technologies' and column_name = 'layer') as present`)
  if (applied.rows[0]?.present) {
    payload.logger.info('Skipping: technologies.layer is already present.')
    return
  }

  await db.execute(sql`
   CREATE TYPE "public"."enum_technologies_layer" AS ENUM('frontend', 'backend', 'tooling');
  ALTER TABLE "technologies" ADD COLUMN "layer" "enum_technologies_layer";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "technologies" DROP COLUMN "layer";
  DROP TYPE "public"."enum_technologies_layer";`)
}
