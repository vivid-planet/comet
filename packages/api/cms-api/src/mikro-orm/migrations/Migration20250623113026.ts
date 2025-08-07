import { Migration } from '@mikro-orm/migrations';

export class Migration20250623113026 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "DamMediaAlternative" ("id" uuid not null, "language" text not null, "type" text check ("type" in (\'captions\')) not null, "for" uuid not null, "alternative" uuid not null, constraint "DamMediaAlternative_pkey" primary key ("id"));');

    this.addSql('alter table "DamMediaAlternative" add constraint "DamMediaAlternative_for_foreign" foreign key ("for") references "DamFile" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "DamMediaAlternative" add constraint "DamMediaAlternative_alternative_foreign" foreign key ("alternative") references "DamFile" ("id") on update cascade on delete cascade;');
  }
}
