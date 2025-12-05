import { Migration } from '@mikro-orm/migrations';

export class Migration20251205072313 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "Tenant" ("id" uuid not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "name" text not null, constraint "Tenant_pkey" primary key ("id"));`);
  }

}
