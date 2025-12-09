import { Migration } from '@mikro-orm/migrations';

export class Migration20251205072914 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "TenantScope" ("id" uuid not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "domain" varchar(255) not null, "language" varchar(255) not null, "tenant" uuid not null, constraint "TenantScope_pkey" primary key ("id"));`);
    this.addSql(`alter table "TenantScope" add constraint "TenantScope_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);


    // Create a default tenant and tenant scope, otherwise you land on a "No access - authorizations missing" page.
    const tenantId = "f9c86c6c-0625-46c0-9be5-bee3a14cc7f4";
    const tenantScopeId = "98afb709-3d59-4599-9770-a9528d336c39";
    this.addSql(`insert into "Tenant" ("id", "createdAt", "updatedAt", "name") values ('${tenantId}', now(), now(), 'Default Tenant');`);
    this.addSql(`insert into "TenantScope" ("id", "createdAt", "updatedAt", "domain", "language", "tenant") values ('${tenantScopeId}', now(), now(), 'main', 'en', '${tenantId}');`);
  }

}
