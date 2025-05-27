import { Migration } from "@mikro-orm/migrations";

export class Migration20250411072548 extends Migration {
    override async up(): Promise<void> {
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_zip" type varchar(255) using ("addressAsEmbeddable_zip"::varchar(255));`,
        );
        this.addSql(
            `alter table "Manufacturer" alter column "addressAsEmbeddable_alternativeAddress_zip" type varchar(255) using ("addressAsEmbeddable_alternativeAddress_zip"::varchar(255));`,
        );
    }
}
