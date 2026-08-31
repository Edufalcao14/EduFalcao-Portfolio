import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" ADD COLUMN "hero_role_tag" varchar DEFAULT 'Full Stack Developer';
  ALTER TABLE "_home_page_v_locales" ADD COLUMN "version_hero_role_tag" varchar DEFAULT 'Full Stack Developer';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" DROP COLUMN "hero_role_tag";
  ALTER TABLE "_home_page_v_locales" DROP COLUMN "version_hero_role_tag";`)
}
