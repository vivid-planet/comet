import { Migration } from '@mikro-orm/migrations';

export class Migration20240223151902 extends Migration {

  async up(): Promise<void> {
    this.addSql('delete from "Manufacturer";');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_street" type varchar(255) using ("addressAsEmbeddable_street"::varchar(255));');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_street" set not null;');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_zip" type int using ("addressAsEmbeddable_zip"::int);');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_zip" set not null;');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_country" type varchar(255) using ("addressAsEmbeddable_country"::varchar(255));');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_country" set not null;');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_street" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_street"::varchar(255));');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_street" set not null;');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_zip" type int using ("addressAsEmbeddable_alternativeAddress_zip"::int);');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_zip" set not null;');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_country" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_country"::varchar(255));');
    this.addSql('alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_country" set not null;');
  }
}
