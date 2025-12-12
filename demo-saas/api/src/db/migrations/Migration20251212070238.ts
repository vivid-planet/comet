import { Migration } from '@mikro-orm/migrations';

export class Migration20251212070238 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "TenantUser" ("id" uuid not null, "tenant" uuid not null, "userId" text not null, constraint "TenantUser_pkey" primary key ("id"));`);
    this.addSql(`alter table "TenantUser" add constraint "TenantUser_tenant_userId_unique" unique ("tenant", "userId");`);
    this.addSql(`alter table "TenantUser" add constraint "TenantUser_tenant_foreign" foreign key ("tenant") references "Tenant" ("id") on update cascade;`);

  }

}
