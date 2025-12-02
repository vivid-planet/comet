import { Migration } from '@mikro-orm/migrations';

export class Migration20251202112331 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "Tenant" ("id" uuid not null, "name" varchar(255) not null, constraint "Tenant_pkey" primary key ("id"));`);

    this.addSql(`alter table "Product" add column "tenant" uuid not null;`);
    this.addSql(`alter table "Product" add constraint "Product_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);

    // set Row Level Security
    this.addSql(`alter table "Product" enable row level security;`);
    // Force RLS so it applies to all users including table owner
    this.addSql(`alter table "Product" force row level security;`);

    this.addSql(`CREATE POLICY tenant_isolation_policy ON "Product" FOR ALL 
                  USING (tenant = current_setting('app.tenant')::uuid) 
                  WITH CHECK (tenant = current_setting('app.tenant')::uuid);`);
  }

}
