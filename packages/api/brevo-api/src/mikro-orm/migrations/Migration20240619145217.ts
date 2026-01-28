import { Migration } from "@mikro-orm/migrations";

export class Migration20240619145217 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop table "BrevoConfig";');
    }
}
