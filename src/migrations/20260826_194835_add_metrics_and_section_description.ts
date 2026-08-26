import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "projects_metrics_locales" (
  	"label" varchar,
  	"method" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_metrics_locales" (
  	"label" varchar,
  	"method" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects_project_section_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "_projects_v_version_project_section_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "projects_metrics" ADD CONSTRAINT "projects_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_metrics_locales" ADD CONSTRAINT "projects_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics" ADD CONSTRAINT "_projects_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics_locales" ADD CONSTRAINT "_projects_v_version_metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_metrics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_metrics_order_idx" ON "projects_metrics" USING btree ("_order");
  CREATE INDEX "projects_metrics_parent_id_idx" ON "projects_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_metrics_locales_locale_parent_id_unique" ON "projects_metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_metrics_order_idx" ON "_projects_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_projects_v_version_metrics_parent_id_idx" ON "_projects_v_version_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_metrics_locales_locale_parent_id_unique" ON "_projects_v_version_metrics_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_metrics" CASCADE;
  DROP TABLE "projects_metrics_locales" CASCADE;
  DROP TABLE "_projects_v_version_metrics" CASCADE;
  DROP TABLE "_projects_v_version_metrics_locales" CASCADE;
  ALTER TABLE "projects_project_section_locales" DROP COLUMN "description";
  ALTER TABLE "_projects_v_version_project_section_locales" DROP COLUMN "description";`)
}
