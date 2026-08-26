import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_technologies_layer" AS ENUM('frontend', 'backend', 'tooling');
  ALTER TABLE "technologies" ADD COLUMN "layer" "enum_technologies_layer";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "technologies" DROP COLUMN "layer";
  DROP TYPE "public"."enum_technologies_layer";`)
}
