import { Migration } from '@mikro-orm/migrations';

export class Migration20250618071843 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "LinkedDamFile" ("id" uuid not null, "language" text not null, "type" text check ("type" in (\'captions\')) not null, "source" uuid not null, "target" uuid not null, constraint "LinkedDamFile_pkey" primary key ("id"));');

    this.addSql('alter table "LinkedDamFile" add constraint "LinkedDamFile_source_foreign" foreign key ("source") references "DamFile" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "LinkedDamFile" add constraint "LinkedDamFile_target_foreign" foreign key ("target") references "DamFile" ("id") on update cascade on delete cascade;');
  }

}
