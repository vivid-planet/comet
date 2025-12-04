import { Migration } from '@mikro-orm/migrations';

export class Migration20251204114159 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "Tenant" ("id" uuid not null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, "name" varchar(255) not null, constraint "Tenant_pkey" primary key ("id"));`);
  }
  
}
