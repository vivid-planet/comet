import { Migration } from "@mikro-orm/migrations";

export class Migration20231206123505 extends Migration {
    async up(): Promise<void> {
        const result = await this.execute(
            `select count(*) from "${this.config.get("migrations").tableName}" where name = 'Migration20230831110518';`,
        );
        if (result[0].count == 1) {
            this.addSql('drop table if exists "UserContentScopes";');
            this.addSql('drop table if exists "UserPermission";');
        }
    }

    async down(): Promise<void> {}
}
