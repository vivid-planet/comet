import { Migration } from '@mikro-orm/migrations';

export class Migration20250709092128 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "DamMediaAlternative" drop constraint if exists "DamMediaAlternative_type_check";');
    this.addSql('alter table "DamMediaAlternative" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "DamMediaAlternative" add constraint "DamMediaAlternative_type_check" check ("type" in (\'captions\', \'audioDescriptions\', \'transcripts\'));');
  }

}
