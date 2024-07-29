import { Migration } from "@mikro-orm/migrations";

export class Migration20240725071750 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table if exists "PublicUpload" rename to "CometFileUpload";');
    }
}
