import { Migration } from "@mikro-orm/migrations";

export class Migration20231206123505 extends Migration {
    async up(): Promise<void> {
        this.addSql('drop table if exists "UserContentScopes";');
        this.addSql('drop table if exists "UserPermission";');
    }

    async down(): Promise<void> {}
}
