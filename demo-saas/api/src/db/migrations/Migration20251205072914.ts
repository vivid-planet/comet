import { Migration } from '@mikro-orm/migrations';

export class Migration20251205072914 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "Department" ("id" uuid not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "name" varchar(255) not null, "tenant" uuid not null, constraint "Department_pkey" primary key ("id"));`);
    this.addSql(`alter table "Department" add constraint "Department_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);

    // Create a default tenant and department, otherwise you land on a "No access - authorizations missing" page.
    const tenantId = "f9c86c6c-0625-46c0-9be5-bee3a14cc7f4";
    const departmentId = "98afb709-3d59-4599-9770-a9528d336c39";
    this.addSql(`insert into "Tenant" ("id", "createdAt", "updatedAt", "name") values ('${tenantId}', now(), now(), 'Default Tenant');`);
    this.addSql(`insert into "Department" ("id", "createdAt", "updatedAt", "name", "tenant") values ('${departmentId}', now(), now(), 'main', '${tenantId}');`);
  }

}
