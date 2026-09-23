import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "links_backend_repo_url" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_links_backend_repo_url" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN IF EXISTS "links_backend_repo_url";
  ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version_links_backend_repo_url";`)
}
